import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Groups } from "../models/group-model";
import { GroupSessions } from "../models/group-session-model";
import { Curriculums } from "../models/curriculum-model";
import { Users } from "../models/user-model";
import { Roles } from "../models/roles-model";
import { Sessions } from "../models/session-model";
import { CurriculumChangeLogs } from "../models/curriculum-change-log-model";
import { isGlobalRole } from "../services/permission-cache";
import { actorFrom, logChange } from "../services/change-log";
import HttpError from "../util/errors/http-error";

/**
 * Groups — a professional's record of running a curriculum with a set of
 * people.
 *
 * Two rules shape most of what follows:
 *
 *  - **Visibility is per group, not per role.** Holding `groups:read` does not
 *    mean seeing everyone's groups; it means seeing your own. A global role
 *    sees all of them, which is how admins supervise.
 *  - **The curriculum can move underneath a group.** Sessions are referenced,
 *    not copied, so opening a group reconciles its session rows against the
 *    curriculum as it is *now* and reports what changed.
 */

const isGlobal = (req: Request): boolean =>
  Boolean(req.user?.roles && isGlobalRole(req.user.roles));

const currentUserId = (req: Request): mongoose.Types.ObjectId | null =>
  req.user?.id && mongoose.Types.ObjectId.isValid(req.user.id)
    ? new mongoose.Types.ObjectId(req.user.id)
    : null;

/** Groups this caller may see: their own, or all of them for a global role. */
const visibilityFilter = (req: Request): Record<string, unknown> => {
  if (isGlobal(req)) return {};
  const me = currentUserId(req);
  if (!me) return { _id: null }; // matches nothing
  return { $or: [{ mainProfessionalId: me }, { coProfessionalIds: me }] };
};

type GroupDoc = {
  _id: mongoose.Types.ObjectId;
  curriculumId: mongoose.Types.ObjectId;
  // Either an id or, on the routes that populate for display, the user
  // document. `idOf` below reads both — see the note there.
  mainProfessionalId: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId };
  coProfessionalIds: Array<mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId }>;
  createdAt?: Date;
};

/**
 * The id of a reference, whether or not it has been populated.
 *
 * The detail route populates the professionals so it can show their names, and
 * a populated field is the user document, not an ObjectId — `String()` on it
 * yields "[object Object]", which matches nobody. Comparing that against the
 * caller locked every creator out of the group they had just made. Normalising
 * here means the checks below no longer care whether their caller populated.
 */
const idOf = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "object" && value !== null && "_id" in (value as Record<string, unknown>)) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
};

const canView = (req: Request, group: GroupDoc): boolean => {
  if (isGlobal(req)) return true;
  const me = String(currentUserId(req) ?? "");
  if (!me) return false;
  return (
    idOf(group.mainProfessionalId) === me ||
    (group.coProfessionalIds ?? []).some((id) => idOf(id) === me)
  );
};

/**
 * Renaming a group, changing who runs it, or deleting it belongs to the person
 * accountable for it — the main professional — or to an admin. A
 * co-professional records participants but does not reshape the record.
 */
const canManage = (req: Request, group: GroupDoc): boolean => {
  if (isGlobal(req)) return true;
  const me = String(currentUserId(req) ?? "");
  return Boolean(me) && idOf(group.mainProfessionalId) === me;
};

/**
 * Bring a group's session rows in line with its curriculum.
 *
 * Returns what changed so the caller can tell the professional. A session that
 * disappeared from the curriculum is flagged, never deleted — the participant
 * count on it is a record of an evening that happened.
 */
const reconcileSessions = async (
  group: GroupDoc,
): Promise<{ added: mongoose.Types.ObjectId[]; removed: mongoose.Types.ObjectId[] }> => {
  const [sessions, rows] = await Promise.all([
    Sessions.find({ curriculumId: group.curriculumId }).select("_id").lean(),
    GroupSessions.find({ groupId: group._id }).lean(),
  ]);

  const liveIds = new Set(sessions.map((s) => String(s._id)));
  const rowIds = new Set(rows.map((r) => String(r.sessionId)));

  const added = sessions.filter((s) => !rowIds.has(String(s._id))).map((s) => s._id);
  const removed = rows
    .filter((r) => !liveIds.has(String(r.sessionId)) && !r.removedAt)
    .map((r) => r.sessionId);

  if (added.length) {
    await GroupSessions.insertMany(
      added.map((sessionId) => ({ groupId: group._id, sessionId, participants: 0 })),
      // A concurrent open of the same group races here; the unique index makes
      // the loser a duplicate-key error rather than a second row, and there is
      // nothing to do about it but carry on.
      { ordered: false },
    ).catch(() => undefined);
  }

  if (removed.length) {
    await GroupSessions.updateMany(
      { groupId: group._id, sessionId: { $in: removed } },
      { $set: { removedAt: new Date() } },
    );
  }

  return { added, removed };
};

/**
 * GET /api/groups/professionals — who may be added to a group.
 *
 * Deliberately not `/api/users/all`: that needs `users:read`, and granting a
 * professional the whole user directory so they can pick a co-facilitator is
 * far more than the task needs. This returns names only, and only of people
 * whose role can actually run a group.
 *
 * Membership is derived from permissions rather than a role named
 * "Professional", so a new role composed in the Roles UI appears here the day
 * it is granted, with no code change. Global roles are included because they
 * bypass permission checks and would otherwise be invisible.
 */
export const getProfessionals = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const roles = await Roles.find({
      $or: [
        { permissions: { $in: ["groups:read", "groups:add", "groups:write", "groups:delete"] } },
        { isGlobal: true },
      ],
    })
      .select("name")
      .lean();

    const users = await Users.find({ roles: { $in: roles.map((r) => r.name) } })
      .select("name email roles")
      .sort({ name: 1 })
      .lean();

    res.json({ message: users });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load professionals", 500));
  }
};

/** GET /api/groups — the caller's groups, newest first. */
export const getGroups = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const groups = await Groups.find(visibilityFilter(req))
      .populate({ path: "curriculumId", select: "slug title accent archived" })
      .populate({ path: "mainProfessionalId", select: "name email" })
      .populate({ path: "coProfessionalIds", select: "name email" })
      .sort({ createdAt: -1 })
      .lean();

    // Participant totals for the table, in one query rather than one per row.
    const totals = await GroupSessions.aggregate<{
      _id: mongoose.Types.ObjectId;
      participants: number;
      sessions: number;
    }>([
      { $match: { groupId: { $in: groups.map((g) => g._id) }, removedAt: null } },
      { $group: { _id: "$groupId", participants: { $sum: "$participants" }, sessions: { $sum: 1 } } },
    ]);

    const byGroup = new Map(totals.map((t) => [String(t._id), t]));

    res.json({
      message: groups.map((group) => ({
        ...group,
        totalParticipants: byGroup.get(String(group._id))?.participants ?? 0,
        sessionCount: byGroup.get(String(group._id))?.sessions ?? 0,
        // Per row, because holding groups:delete is not the same as being
        // allowed to delete *this* group — a co-professional can see a group
        // they may not reshape. Without this the list can only gate on the
        // permission and offers a button the server refuses.
        canManage: canManage(req, group as unknown as GroupDoc),
      })),
    });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load groups", 500));
  }
};

/** POST /api/groups — start a group from a curriculum. */
export const createGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { curriculumId, name, notes, coProfessionalIds } = req.body ?? {};
  const me = currentUserId(req);

  if (!me) return next(new HttpError("Not authorized", 401));
  if (!curriculumId || !mongoose.Types.ObjectId.isValid(String(curriculumId))) {
    return next(new HttpError("A group needs a curriculum.", 400));
  }

  try {
    const curriculum = await Curriculums.findById(curriculumId).select("_id archived").lean();
    if (!curriculum) return next(new HttpError("Curriculum not found", 404));
    if (curriculum.archived) {
      return next(
        new HttpError("That curriculum is archived and cannot start new groups.", 400),
      );
    }

    const group = await Groups.create({
      curriculumId,
      mainProfessionalId: me,
      coProfessionalIds: Array.isArray(coProfessionalIds) ? coProfessionalIds : [],
      name: name ?? { en: "", es: "" },
      notes: notes ?? { en: "", es: "" },
    });

    // Seed a row per session so participants can be recorded immediately.
    await reconcileSessions(group.toObject() as GroupDoc);

    await logChange({
      scope: "group",
      curriculumId: group.curriculumId,
      groupId: group._id,
      actor: actorFrom(req),
      action: "group_created",
      changes: [{ field: "name", oldValue: null, newValue: group.name }],
    });

    res.status(201).json({ message: group });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to create group", 500));
  }
};

/**
 * GET /api/groups/:id — one group, its sessions, and anything that changed
 * under it since it was last opened.
 */
export const getGroupById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const group = await Groups.findById(req.params.id)
      .populate({ path: "mainProfessionalId", select: "name email" })
      .populate({ path: "coProfessionalIds", select: "name email" })
      .lean();

    if (!group) return next(new HttpError("Group not found", 404));
    if (!canView(req, group as unknown as GroupDoc)) {
      return next(new HttpError("You do not have access to this group", 403));
    }

    const pending = await reconcileSessions(group as unknown as GroupDoc);

    const [curriculum, sessions, rows] = await Promise.all([
      Curriculums.findById(group.curriculumId).lean(),
      Sessions.find({ curriculumId: group.curriculumId }).sort({ order: 1, number: 1 }).lean(),
      GroupSessions.find({ groupId: group._id }).lean(),
    ]);

    const rowBySession = new Map(rows.map((r) => [String(r.sessionId), r]));
    const sessionById = new Map(sessions.map((s) => [String(s._id), s]));

    // Live sessions in curriculum order, then anything the curriculum dropped —
    // still visible, still carrying its number, marked as gone.
    const live = sessions.map((session) => ({
      sessionId: session._id,
      number: session.number,
      title: session.title,
      mainTopic: session.mainTopic,
      participants: rowBySession.get(String(session._id))?.participants ?? 0,
      removed: false,
    }));

    const orphaned = rows
      .filter((row) => !sessionById.has(String(row.sessionId)))
      .map((row) => ({
        sessionId: row.sessionId,
        number: null,
        title: null,
        mainTopic: [],
        participants: row.participants,
        removed: true,
      }));

    if (pending.added.length || pending.removed.length) {
      await logChange({
        scope: "group",
        curriculumId: group.curriculumId,
        groupId: group._id,
        actor: actorFrom(req),
        action: "group_sessions_reconciled",
        changes: [
          { field: "added", oldValue: null, newValue: pending.added.length },
          { field: "removed", oldValue: null, newValue: pending.removed.length },
        ],
      });
    }

    res.json({
      message: {
        ...group,
        curriculum,
        sessions: [...live, ...orphaned],
        canManage: canManage(req, group as unknown as GroupDoc),
        // Non-empty only on the first open after the curriculum changed, so the
        // client can raise this once and never nag again.
        pendingChanges: {
          added: pending.added.length,
          removed: pending.removed.length,
        },
      },
    });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load group", 500));
  }
};

/** PUT /api/groups/:id — rename, re-note, or change who runs it. */
export const updateGroup = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const group = await Groups.findById(req.params.id);
    if (!group) return next(new HttpError("Group not found", 404));
    if (!canManage(req, group.toObject() as GroupDoc)) {
      return next(
        new HttpError("Only the main professional or an admin can change this group.", 403),
      );
    }

    const { name, notes, coProfessionalIds } = req.body ?? {};
    const before = { name: group.name, coProfessionalIds: [...group.coProfessionalIds] };

    if (name !== undefined) group.name = name;
    if (notes !== undefined) group.notes = notes;
    if (Array.isArray(coProfessionalIds)) group.coProfessionalIds = coProfessionalIds;

    await group.save();

    const actor = actorFrom(req);

    if (name !== undefined) {
      await logChange({
        scope: "group",
        curriculumId: group.curriculumId,
        groupId: group._id,
        actor,
        action: "group_updated",
        changes: [{ field: "name", oldValue: before.name, newValue: group.name }],
      });
    }

    if (Array.isArray(coProfessionalIds)) {
      await logChange({
        scope: "group",
        curriculumId: group.curriculumId,
        groupId: group._id,
        actor,
        action: "professionals_changed",
        changes: [
          {
            field: "coProfessionals",
            oldValue: before.coProfessionalIds.map(String),
            newValue: group.coProfessionalIds.map(String),
          },
        ],
      });
    }

    res.json({ message: group });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to update group", 500));
  }
};

/** PATCH /api/groups/:id/sessions/:sessionId — record attendance. */
export const setParticipants = async (
  req: Request<{ id: string; sessionId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const participants = Number(req.body?.participants);

  if (!Number.isFinite(participants) || participants < 0) {
    return next(new HttpError("Participants must be zero or more.", 400));
  }

  try {
    const group = await Groups.findById(req.params.id).lean();
    if (!group) return next(new HttpError("Group not found", 404));
    // Recording attendance is the co-professional's job too, so this is a view
    // check rather than a manage check.
    if (!canView(req, group as unknown as GroupDoc)) {
      return next(new HttpError("You do not have access to this group", 403));
    }

    const existing = await GroupSessions.findOne({
      groupId: group._id,
      sessionId: req.params.sessionId,
    }).lean();

    await GroupSessions.updateOne(
      { groupId: group._id, sessionId: req.params.sessionId },
      { $set: { participants } },
      { upsert: true },
    );

    await logChange({
      scope: "group",
      curriculumId: group.curriculumId,
      groupId: group._id,
      sessionId: new mongoose.Types.ObjectId(req.params.sessionId),
      actor: actorFrom(req),
      action: "participants_updated",
      changes: [
        { field: "participants", oldValue: existing?.participants ?? 0, newValue: participants },
      ],
    });

    res.json({ message: { sessionId: req.params.sessionId, participants } });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to record participants", 500));
  }
};

/** DELETE /api/groups/:id — session rows cascade with it. */
export const deleteGroup = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const group = await Groups.findById(req.params.id).lean();
    if (!group) return next(new HttpError("Group not found", 404));
    if (!canManage(req, group as unknown as GroupDoc)) {
      return next(
        new HttpError("Only the main professional or an admin can delete this group.", 403),
      );
    }

    await Groups.findOneAndDelete({ _id: group._id });

    await logChange({
      scope: "group",
      curriculumId: group.curriculumId,
      groupId: group._id,
      actor: actorFrom(req),
      action: "group_deleted",
      changes: [{ field: "name", oldValue: group.name, newValue: null }],
    });

    res.json({ message: group._id });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to delete group", 500));
  }
};

/**
 * GET /api/groups/:id/history — one timeline.
 *
 * The group's own entries plus any change an author made to the curriculum
 * since the group started. Bounding template changes by the group's creation
 * date is what keeps this readable: a professional wants what changed under
 * them, not years of authoring that predates their group.
 */
export const getGroupHistory = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const group = await Groups.findById(req.params.id).lean();
    if (!group) return next(new HttpError("Group not found", 404));
    if (!canView(req, group as unknown as GroupDoc)) {
      return next(new HttpError("You do not have access to this group", 403));
    }

    const since = (group as unknown as GroupDoc).createdAt ?? new Date(0);

    const entries = await CurriculumChangeLogs.find({
      $or: [
        { groupId: group._id },
        { scope: "curriculum", curriculumId: group.curriculumId, timestamp: { $gte: since } },
      ],
    })
      .sort({ timestamp: -1 })
      .limit(300)
      .lean();

    res.json({ message: entries });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load history", 500));
  }
};
