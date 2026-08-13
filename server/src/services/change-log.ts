import { Request } from "express";
import mongoose from "mongoose";
import {
  ChangeAction,
  CurriculumChangeLogs,
  IFieldChange,
} from "../models/curriculum-change-log-model";

/**
 * Writing and reading curriculum/group history.
 *
 * The diff here is deliberately *semantic* rather than field-by-field. A
 * curriculum is nested several levels deep — sessions, sections, groups, items,
 * each bilingual — so a generic object differ produces one entry per save
 * reading "sessions changed: [blob] → [blob]". True, and useless in a dialog.
 * Instead we compare session against session by id and report what a person
 * would say happened: a session was added, one was removed, or a named part of
 * one was edited.
 */

/** Bookkeeping that changes without the content changing. */
const NOISE_KEYS = new Set([
  "translatedFrom", // a fingerprint — re-approving a translation is not an edit
  "createdAt",
  "updatedAt",
  "__v",
  "_id",
  "curriculumId",
  "order",
]);

/** A stable string for comparison, with bookkeeping stripped at every depth. */
const contentOf = (value: unknown): string => {
  const strip = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(strip);
    if (node && typeof node === "object") {
      if (node instanceof Date) return node.toISOString();
      if (node instanceof mongoose.Types.ObjectId) return String(node);
      return Object.fromEntries(
        Object.entries(node as Record<string, unknown>)
          .filter(([key]) => !NOISE_KEYS.has(key))
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, v]) => [key, strip(v)]),
      );
    }
    return node ?? null;
  };
  return JSON.stringify(strip(value));
};

/** The parts of a session reported separately when they change. */
const SESSION_PARTS = [
  "title",
  "mainTopic",
  "presentation",
  "closing",
  "feedback",
  "therapeuticApproach",
  "clinicalReference",
] as const;

const SECTION_PARTS = [
  "concepts",
  "objectives",
  "psychoeducation",
  "intervention",
  "processing",
] as const;

interface SessionLike {
  _id: unknown;
  number?: number;
  title?: { en?: string; es?: string };
  sections?: Record<string, unknown>;
  [key: string]: unknown;
}

const labelOf = (session: SessionLike): string => {
  const title = session.title?.en || session.title?.es || "";
  const number = session.number ?? "";
  return title ? `Session ${number} — ${title}` : `Session ${number}`;
};

export interface SessionDiffEntry {
  action: Extract<ChangeAction, "session_added" | "session_removed" | "session_edited">;
  sessionId: mongoose.Types.ObjectId;
  changes: IFieldChange[];
}

/**
 * What changed between two versions of a curriculum's sessions.
 *
 * Matching is by `_id`, which is why preserving ids through the extraction and
 * through every editor save matters: a session whose id changed reads as one
 * session deleted and a different one added, and any group pointing at it is
 * orphaned for no reason.
 */
export const diffSessions = (
  before: SessionLike[],
  after: SessionLike[],
): SessionDiffEntry[] => {
  const beforeById = new Map(before.map((s) => [String(s._id), s]));
  const afterById = new Map(after.map((s) => [String(s._id), s]));
  const entries: SessionDiffEntry[] = [];

  for (const [id, session] of afterById) {
    if (beforeById.has(id)) continue;
    entries.push({
      action: "session_added",
      sessionId: new mongoose.Types.ObjectId(id),
      changes: [{ field: "session", oldValue: null, newValue: labelOf(session) }],
    });
  }

  for (const [id, session] of beforeById) {
    if (afterById.has(id)) continue;
    entries.push({
      action: "session_removed",
      sessionId: new mongoose.Types.ObjectId(id),
      changes: [{ field: "session", oldValue: labelOf(session), newValue: null }],
    });
  }

  for (const [id, next] of afterById) {
    const previous = beforeById.get(id);
    if (!previous) continue;

    const changes: IFieldChange[] = [];

    for (const part of SESSION_PARTS) {
      if (contentOf(previous[part]) !== contentOf(next[part])) {
        changes.push({ field: part, oldValue: previous[part] ?? null, newValue: next[part] ?? null });
      }
    }

    for (const part of SECTION_PARTS) {
      const a = (previous.sections as Record<string, unknown> | undefined)?.[part];
      const b = (next.sections as Record<string, unknown> | undefined)?.[part];
      if (contentOf(a) !== contentOf(b)) {
        changes.push({ field: part, oldValue: a ?? null, newValue: b ?? null });
      }
    }

    if (changes.length) {
      entries.push({ action: "session_edited", sessionId: new mongoose.Types.ObjectId(id), changes });
    }
  }

  return entries;
};

export interface Actor {
  changedBy: mongoose.Types.ObjectId | null;
  changedByName: string;
}

/**
 * Who is making this change.
 *
 * Falls back to "System" rather than failing: history that is missing an actor
 * is worth less than history, but losing the entry entirely is worse.
 */
export const actorFrom = (req: Request): Actor => {
  const user = req.user;
  if (user?.id && mongoose.Types.ObjectId.isValid(user.id)) {
    return {
      changedBy: new mongoose.Types.ObjectId(user.id),
      changedByName: user.name || user.email || "Unknown user",
    };
  }
  return { changedBy: null, changedByName: "System" };
};

export interface LogChangeOptions {
  scope: "curriculum" | "group";
  curriculumId: mongoose.Types.ObjectId;
  groupId?: mongoose.Types.ObjectId | null;
  sessionId?: mongoose.Types.ObjectId | null;
  actor: Actor;
  action: ChangeAction;
  changes?: IFieldChange[];
}

/**
 * Record one change.
 *
 * Never throws into the caller: an audit write failing should not fail the
 * edit that produced it. A missing history line is a smaller problem than a
 * save that appears to fail after it already succeeded.
 */
export const logChange = async (options: LogChangeOptions): Promise<void> => {
  try {
    await CurriculumChangeLogs.create({
      scope: options.scope,
      curriculumId: options.curriculumId,
      groupId: options.groupId ?? null,
      sessionId: options.sessionId ?? null,
      changedBy: options.actor.changedBy,
      changedByName: options.actor.changedByName,
      action: options.action,
      changes: options.changes ?? [],
    });
  } catch (error: any) {
    console.error("[ChangeLog] Failed to record change:", error?.message ?? error);
  }
};

/** Record a batch, e.g. every session change from one editor save. */
export const logChanges = async (entries: LogChangeOptions[]): Promise<void> => {
  for (const entry of entries) await logChange(entry);
};
