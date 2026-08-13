import mongoose, { Model, Schema } from "mongoose";

/**
 * CurriculumChangeLog — what happened, to which curriculum or group, and who
 * did it.
 *
 * One collection carries both scopes so a group's history can be read as a
 * single timeline: an author editing session 3 and a professional recording
 * attendance for session 2 belong on the same page, in the order they
 * happened. `scope` says which kind an entry is, `curriculumId` is always set
 * so a group can find the template changes that affected it, and `groupId` is
 * set only on entries a group produced.
 *
 * `changedByName` is stored beside `changedBy` on purpose. Admins delete
 * users, and history that reads "deleted user changed session 3" is history
 * nobody can act on. The denormalised copy survives the account.
 *
 * Entries are written from the controllers rather than model hooks or an event
 * bus: a hook cannot see who the actor was, and an emitter would need a
 * registration guard to avoid writing an entry twice per reload.
 */

export interface IFieldChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export const CHANGE_ACTIONS = [
  // Curriculum scope — an author edited the template.
  "curriculum_created",
  "curriculum_updated",
  "curriculum_archived",
  "curriculum_unarchived",
  "curriculum_deleted",
  "session_added",
  "session_removed",
  "session_edited",
  // Group scope — a professional worked on their own record.
  "group_created",
  "group_updated",
  "group_deleted",
  "participants_updated",
  "professionals_changed",
  // Written when a group notices its curriculum gained or lost a session.
  "group_sessions_reconciled",
] as const;

export type ChangeAction = (typeof CHANGE_ACTIONS)[number];

export interface ICurriculumChangeLog {
  _id: mongoose.Types.ObjectId;
  scope: "curriculum" | "group";
  curriculumId: mongoose.Types.ObjectId;
  groupId?: mongoose.Types.ObjectId | null;
  /** Set on session-scoped entries, so a group can filter to one session. */
  sessionId?: mongoose.Types.ObjectId | null;
  changedBy?: mongoose.Types.ObjectId | null;
  changedByName: string;
  action: ChangeAction;
  changes: IFieldChange[];
  timestamp: Date;
}

export interface CurriculumChangeLogModel extends Model<ICurriculumChangeLog> {}

const fieldChangeSchema = new Schema<IFieldChange>(
  {
    field: { type: String, required: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

const changeLogSchema = new Schema<ICurriculumChangeLog>(
  {
    scope: { type: String, enum: ["curriculum", "group"], required: true },
    curriculumId: { type: Schema.Types.ObjectId, ref: "Curriculums", required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Groups", default: null },
    sessionId: { type: Schema.Types.ObjectId, ref: "Sessions", default: null },
    changedBy: { type: Schema.Types.ObjectId, ref: "Users", default: null },
    changedByName: { type: String, required: true },
    action: { type: String, enum: CHANGE_ACTIONS, required: true },
    changes: { type: [fieldChangeSchema], default: [] },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false, collection: "curriculum_change_logs" },
);

// The two ways history is ever read: a curriculum's, and a group's.
changeLogSchema.index({ curriculumId: 1, timestamp: -1 });
changeLogSchema.index({ groupId: 1, timestamp: -1 });

const CurriculumChangeLogs = mongoose.model<ICurriculumChangeLog, CurriculumChangeLogModel>(
  "CurriculumChangeLogs",
  changeLogSchema,
);

export { CurriculumChangeLogs };
