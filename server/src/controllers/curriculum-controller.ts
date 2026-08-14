import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Curriculums, ICurriculum } from "../models/curriculum-model";
import { SECTION_KEYS, Sessions } from "../models/session-model";
import { Groups } from "../models/group-model";
import { GroupSessions } from "../models/group-session-model";
import { CurriculumChangeLogs } from "../models/curriculum-change-log-model";
import { actorFrom, diffSessions, logChange, logChanges } from "../services/change-log";
import HttpError from "../util/errors/http-error";

type CurriculumBody = Partial<Omit<ICurriculum, "_id">> & { sessions?: unknown };

/**
 * Sessions are their own collection, but the API still speaks in whole
 * curricula: a reader gets `{ ...curriculum, sessions: [...] }` and the editor
 * saves the same shape back. Keeping that contract is what let the storage
 * split happen without touching a single page or route on the client.
 */

/** Fields an author may set on the curriculum document itself. */
const WRITABLE = [
  "number",
  "slug",
  "title",
  "highlightedTitle",
  "description",
  "author",
  "accent",
  "published",
  "archived",
  "order",
] as const;

/** Derive a URL-safe slug from a title when the author has not supplied one. */
const slugify = (s: string): string =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

const emptyLocalized = () => ({ en: "", es: "" });

/**
 * Fill in anything the client omitted, so a session always round-trips with
 * every section key present and every section shaped `{ intro, groups }`.
 * Without this, a session saved before a section existed would come back
 * missing it and break the editor's `.map`.
 *
 * Also accepts a bare array for a section — the shape this model used before
 * grouped sections — and lifts it into a single unnamed group, so an early
 * document is not stranded.
 */
const normalizeSection = (raw: any): any => {
  if (Array.isArray(raw)) {
    return { intro: emptyLocalized(), groups: raw.length ? [{ order: 0, items: raw }] : [] };
  }
  return {
    intro: raw?.intro ?? emptyLocalized(),
    groups: Array.isArray(raw?.groups)
      ? raw.groups.map((g: any, i: number) => ({
          ...g,
          order: typeof g?.order === "number" ? g.order : i,
          items: Array.isArray(g?.items) ? g.items : [],
        }))
      : [],
  };
};

const normalizeSessions = (sessions: any): any[] =>
  Array.isArray(sessions)
    ? sessions.map((s, i) => ({
        ...s,
        order: typeof s?.order === "number" ? s.order : i,
        mainTopic: Array.isArray(s?.mainTopic) ? s.mainTopic : [],
        feedback: Array.isArray(s?.feedback) ? s.feedback : [],
        presentation: {
          body: s?.presentation?.body ?? emptyLocalized(),
          prompts: Array.isArray(s?.presentation?.prompts) ? s.presentation.prompts : [],
          reminder: s?.presentation?.reminder ?? emptyLocalized(),
        },
        sections: Object.fromEntries(
          SECTION_KEYS.map((k) => [k, normalizeSection(s?.sections?.[k])]),
        ),
      }))
    : [];

const pickWritable = (body: CurriculumBody): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const key of WRITABLE) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
};

/** This curriculum's sessions, in authoring order. */
export const listSessions = (curriculumId: mongoose.Types.ObjectId) =>
  Sessions.find({ curriculumId }).sort({ order: 1, number: 1 }).lean();

/** Put the sessions back on a curriculum so the client sees one document. */
const withSessions = async (doc: any): Promise<any> => ({
  ...doc,
  sessions: await listSessions(doc._id),
});

/**
 * Write the editor's session array into the sessions collection.
 *
 * Ids are preserved wherever the client sent one it already had, because a
 * session id is what a group's participant rows and the change log point at —
 * reassigning one on every save would orphan them all. A session the editor
 * dropped is deleted; anything new gets a server-assigned id.
 *
 * An unknown id is treated as new rather than upserted, so a body naming
 * another curriculum's session cannot move it here.
 */
const syncSessions = async (
  curriculumId: mongoose.Types.ObjectId,
  incoming: unknown,
  tx?: mongoose.ClientSession,
): Promise<void> => {
  const normalized = normalizeSessions(incoming);

  const existing = new Set(
    (await Sessions.find({ curriculumId }).select("_id").session(tx ?? null).lean()).map((d) => String(d._id)),
  );

  const kept: mongoose.Types.ObjectId[] = [];

  for (const [index, session] of normalized.entries()) {
    const { _id, curriculumId: _ignored, createdAt, updatedAt, __v, ...rest } = session;
    const payload = {
      ...rest,
      curriculumId,
      order: typeof session.order === "number" ? session.order : index,
    };

    if (_id && existing.has(String(_id))) {
      await Sessions.updateOne({ _id, curriculumId }, { $set: payload }, { session: tx });
      kept.push(new mongoose.Types.ObjectId(String(_id)));
    } else {
      const [created] = await Sessions.create([payload], { session: tx });
      kept.push(created._id);
    }
  }

  await Sessions.deleteMany({ curriculumId, _id: { $nin: kept } }, { session: tx });
};

/** GET /api/curriculums/all — every curriculum, authoring order. */
export const getAllCurriculums = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const list = await Curriculums.find().sort({ order: 1, number: 1 }).lean();
    res.json({ message: await Promise.all(list.map(withSessions)) });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load curriculums", 500));
  }
};

/**
 * GET /api/curriculums/public — no authentication.
 *
 * What the public Mission page renders its cards from. Published only, and
 * without `sessions`: the card needs a title and a description, and shipping
 * every session's prose to an anonymous visitor would be both wasteful and a
 * way to read an unfinished curriculum through a page that never shows it.
 */
export const getPublicCurriculums = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const list = await Curriculums.find({ published: true, archived: { $ne: true } })
      .select("number slug title highlightedTitle description author accent order")
      .sort({ order: 1, number: 1 });
    res.json({ message: list });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load curriculums", 500));
  }
};

/**
 * GET /api/curriculums/public/:slug — no authentication.
 *
 * One published curriculum, sessions and all. This is what the session pages
 * render from, so unlike the card list it must carry the whole document.
 *
 * Archived curricula still resolve here: a group that started before the
 * archive keeps its links working.
 */
export const getPublicCurriculumBySlug = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const doc = await Curriculums.findOne({ slug: req.params.slug, published: true }).lean();
    if (!doc) return next(new HttpError("Curriculum not found", 404));
    res.json({ message: await withSessions(doc) });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load curriculum", 500));
  }
};

/** GET /api/curriculums/:id */
export const getCurriculumById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const doc = await Curriculums.findById(req.params.id).lean();
    if (!doc) return next(new HttpError("Curriculum not found", 404));
    res.json({ message: await withSessions(doc) });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load curriculum", 500));
  }
};

/** POST /api/curriculums/create */
export const createCurriculum = async (
  req: Request<{}, {}, CurriculumBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const body = pickWritable(req.body ?? {});
  const title = (req.body?.title as any)?.en || (req.body?.title as any)?.es || "";
  const slug = String(body.slug || slugify(title)).trim();

  if (!slug) {
    return next(new HttpError("A curriculum needs a title or a slug.", 400));
  }

  try {
    const doc = await Curriculums.create({ ...body, slug });
    if (req.body?.sessions !== undefined) await syncSessions(doc._id, req.body.sessions);

    await logChange({
      scope: "curriculum",
      curriculumId: doc._id,
      actor: actorFrom(req),
      action: "curriculum_created",
      changes: [{ field: "slug", oldValue: null, newValue: doc.slug }],
    });

    res.status(201).json({ message: await withSessions(doc.toObject()) });
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return next(new HttpError(`A curriculum with the slug '${slug}' already exists.`, 400));
    }
    return next(new HttpError(error.message || "Failed to create curriculum", 500));
  }
};

/** PUT /api/curriculums/:id — the editor saves the whole document. */
export const updateCurriculum = async (
  req: Request<{ id: string }, {}, CurriculumBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const doc = await Curriculums.findById(req.params.id);
    if (!doc) return next(new HttpError("Curriculum not found", 404));

    const actor = actorFrom(req);

    // Snapshot before anything moves, so the history entries below describe the
    // save rather than its result.
    const sessionsBefore =
      req.body?.sessions !== undefined ? await listSessions(doc._id) : [];

    // One transaction for the whole save. Without it a failure part-way
    // through leaves the curriculum updated, some sessions written and the
    // delete of the rest already run — which is how a save can lose sessions.
    const tx = await mongoose.startSession();
    try {
      await tx.withTransaction(async () => {
        doc.set(pickWritable(req.body ?? {}));
        await doc.save({ session: tx });
        if (req.body?.sessions !== undefined) {
          await syncSessions(doc._id, req.body.sessions, tx);
        }
      });
    } finally {
      await tx.endSession();
    }

    if (req.body?.sessions !== undefined) {
      const sessionsAfter = await listSessions(doc._id);

      await logChanges(
        diffSessions(sessionsBefore as any[], sessionsAfter as any[]).map((entry) => ({
          scope: "curriculum" as const,
          curriculumId: doc._id,
          sessionId: entry.sessionId,
          actor,
          action: entry.action,
          changes: entry.changes,
        })),
      );
    }

    res.json({ message: await withSessions(doc.toObject()) });
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return next(new HttpError("Another curriculum already uses that slug.", 400));
    }
    if (error.name === "VersionError") {
      return next(
        new HttpError(
          "This curriculum changed while you were editing it. Reload and reapply your changes.",
          409,
        ),
      );
    }
    return next(new HttpError(error.message || "Failed to update curriculum", 500));
  }
};

/**
 * Which groups depend on this curriculum, and which of its sessions carry
 * recorded participants.
 *
 * Serves two warnings from one query set: the dialog shown when a curriculum
 * cannot be deleted, and the builder's warning before an author removes a
 * session someone has already recorded attendance against.
 */
const usageOf = async (curriculumId: mongoose.Types.ObjectId) => {
  const groups = await Groups.find({ curriculumId })
    .populate({ path: "mainProfessionalId", select: "name email" })
    .select("name mainProfessionalId createdAt")
    .lean();

  const sessionUsage = await GroupSessions.aggregate<{
    _id: mongoose.Types.ObjectId;
    groups: number;
    participants: number;
  }>([
    { $match: { groupId: { $in: groups.map((g) => g._id) } } },
    {
      $group: {
        _id: "$sessionId",
        groups: { $sum: 1 },
        participants: { $sum: "$participants" },
      },
    },
  ]);

  return {
    groups,
    inUse: groups.length > 0,
    sessionUsage: Object.fromEntries(
      sessionUsage.map((s) => [String(s._id), { groups: s.groups, participants: s.participants }]),
    ),
  };
};

/** GET /api/curriculums/:id/usage */
export const getCurriculumUsage = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new HttpError("Curriculum not found", 404));
    }
    res.json({ message: await usageOf(new mongoose.Types.ObjectId(req.params.id)) });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load curriculum usage", 500));
  }
};

/**
 * PATCH /api/curriculums/:id/archive — retire a curriculum without deleting it.
 *
 * The answer to "this is in use and I still want it gone". Existing groups keep
 * resolving their sessions and keep their participant history; the curriculum
 * simply stops being available to start new groups from.
 */
export const setCurriculumArchived = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const archived = Boolean(req.body?.archived);

  try {
    const doc = await Curriculums.findById(req.params.id);
    if (!doc) return next(new HttpError("Curriculum not found", 404));

    doc.archived = archived;
    await doc.save();

    await logChange({
      scope: "curriculum",
      curriculumId: doc._id,
      actor: actorFrom(req),
      action: archived ? "curriculum_archived" : "curriculum_unarchived",
      changes: [{ field: "archived", oldValue: !archived, newValue: archived }],
    });

    res.json({ message: doc });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to archive curriculum", 500));
  }
};

/**
 * DELETE /api/curriculums/:id — sessions cascade with it.
 *
 * Refused while any group depends on it. There is deliberately no force flag:
 * a group's participant counts belong to the professional who recorded them,
 * and one admin confirming a dialog should not be able to destroy another
 * person's record. Archiving is the way through.
 */
export const deleteCurriculum = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new HttpError("Curriculum not found", 404));
    }

    const id = new mongoose.Types.ObjectId(req.params.id);
    const usage = await usageOf(id);

    if (usage.inUse) {
      // The details ride through the error handler so the dialog can name the
      // groups and the professionals running them.
      return next(
        new HttpError(
          `This curriculum is used by ${usage.groups.length} group${
            usage.groups.length === 1 ? "" : "s"
          } and cannot be deleted. Archive it instead to stop new groups from using it.`,
          409,
          { groups: usage.groups },
        ),
      );
    }

    const doc = await Curriculums.findByIdAndDelete(id);
    if (!doc) return next(new HttpError("Curriculum not found", 404));

    await logChange({
      scope: "curriculum",
      curriculumId: doc._id,
      actor: actorFrom(req),
      action: "curriculum_deleted",
      changes: [{ field: "slug", oldValue: doc.slug, newValue: null }],
    });

    res.json({ message: doc });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to delete curriculum", 500));
  }
};

/**
 * GET /api/curriculums/:id/history — every change to this curriculum.
 *
 * The admin-side view of the same log a group reads: curriculum-scoped entries
 * only, so it is the template's story rather than any one group's.
 */
export const getCurriculumHistory = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const entries = await CurriculumChangeLogs.find({
      curriculumId: req.params.id,
      scope: "curriculum",
    })
      .sort({ timestamp: -1 })
      .limit(300)
      .lean();
    res.json({ message: entries });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load history", 500));
  }
};
