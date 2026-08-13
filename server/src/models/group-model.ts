import mongoose, { Model, Schema } from "mongoose";
import { Localized, localized } from "./localized";
import { GroupSessions } from "./group-session-model";

/**
 * Group — one professional running one curriculum with one set of people.
 *
 * This is the join between users and curricula: a curriculum is run by many
 * groups, a professional runs many groups, and a group may be led by several
 * professionals at once. One of them is the main professional — the person
 * accountable for the record — and the rest are co-professionals.
 *
 * The group points at the curriculum rather than copying it, so an edit an
 * author makes reaches every group running it. What that costs is drift: a
 * session can appear or disappear underneath a group, which is why the
 * controller reconciles session rows on read and the change log keeps the
 * history.
 *
 * `name` is bilingual like everything else authored here. Unlike a curriculum
 * it is not authored in English and translated — a professional writes it in
 * whichever language they work in — so the translate control on the group form
 * has to take its direction from the author rather than always running EN→ES.
 */
export interface IGroup {
  _id: mongoose.Types.ObjectId;
  curriculumId: mongoose.Types.ObjectId;
  /** The professional accountable for this group. */
  mainProfessionalId: mongoose.Types.ObjectId;
  /** Everyone else facilitating it. */
  coProfessionalIds: mongoose.Types.ObjectId[];
  name: Localized;
  notes?: Localized;
}

export interface GroupModel extends Model<IGroup> {}

const groupSchema = new Schema<IGroup>(
  {
    curriculumId: { type: Schema.Types.ObjectId, ref: "Curriculums", required: true },
    mainProfessionalId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    coProfessionalIds: { type: [{ type: Schema.Types.ObjectId, ref: "Users" }], default: [] },
    name: localized(),
    notes: localized(),
  },
  { timestamps: true, collection: "groups" },
);

// "Which groups use this curriculum" gates every curriculum delete, so it runs
// on a path a user is waiting on.
groupSchema.index({ curriculumId: 1 });
// "My groups" — the professional's list page.
groupSchema.index({ mainProfessionalId: 1 });
groupSchema.index({ coProfessionalIds: 1 });

/**
 * Deleting a group takes its session rows with it.
 *
 * Mongo has no foreign keys, so this only fires on the query paths hooked
 * here. The controller deletes through `findOneAndDelete`; the other two are
 * covered so a later caller reaching for them cannot silently orphan rows.
 */
const cascadeToGroupSessions = async (ids: mongoose.Types.ObjectId[]): Promise<void> => {
  if (ids.length) await GroupSessions.deleteMany({ groupId: { $in: ids } });
};

type IdOnly = { _id: mongoose.Types.ObjectId };

groupSchema.pre("findOneAndDelete", async function () {
  const doc = await this.model.findOne(this.getFilter()).select("_id").lean<IdOnly | null>();
  if (doc) await cascadeToGroupSessions([doc._id]);
});

groupSchema.pre("deleteOne", { document: false, query: true }, async function () {
  const doc = await this.model.findOne(this.getFilter()).select("_id").lean<IdOnly | null>();
  if (doc) await cascadeToGroupSessions([doc._id]);
});

groupSchema.pre("deleteMany", async function () {
  const docs = await this.model.find(this.getFilter()).select("_id").lean<IdOnly[]>();
  await cascadeToGroupSessions(docs.map((d) => d._id));
});

const Groups = mongoose.model<IGroup, GroupModel>("Groups", groupSchema);

export { Groups };
