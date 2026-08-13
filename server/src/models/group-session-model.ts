import mongoose, { Model, Schema } from "mongoose";

/**
 * GroupSession — one session of one group, and how many people were there.
 *
 * A row exists for every session the group's curriculum had when the group was
 * created, plus any added since. Participants are recorded per session because
 * attendance is a per-evening fact, not a property of the group.
 *
 * `removedAt` is what happens when an admin deletes a session from the
 * curriculum underneath a running group. The row is kept, not deleted: a
 * professional who recorded twelve participants recorded a real evening with
 * real people, and losing that because someone edited a template later would
 * be destroying their record. It shows as removed and keeps its number.
 */
export interface IGroupSession {
  _id: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  /** The `_id` of a document in the sessions collection. */
  sessionId: mongoose.Types.ObjectId;
  participants: number;
  /** Set when this session no longer exists on the curriculum. */
  removedAt?: Date | null;
}

export interface GroupSessionModel extends Model<IGroupSession> {}

const groupSessionSchema = new Schema<IGroupSession>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: "Groups", required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: "Sessions", required: true },
    participants: { type: Number, default: 0, min: 0 },
    removedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "group_sessions" },
);

// One row per session per group. Reconciliation upserts against this, so the
// constraint is what stops a double-open of a group creating two rows.
groupSessionSchema.index({ groupId: 1, sessionId: 1 }, { unique: true });

const GroupSessions = mongoose.model<IGroupSession, GroupSessionModel>(
  "GroupSessions",
  groupSessionSchema,
);

export { GroupSessions };
