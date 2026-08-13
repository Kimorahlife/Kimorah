import mongoose, { Model, Schema } from "mongoose";
import { Localized, localized } from "./localized";
import { Sessions } from "./session-model";

/**
 * Curriculum — the authored form of a Mission psychoeducational curriculum.
 *
 * This models the AUTHOR'S source document, not the website's rendering of it.
 * The distinction matters: the live session pages show a title, a body
 * paragraph and two reflection prompts per concept, but the source document
 * carries only a single bullet line for each — the rest was written during the
 * website build. So `title` is the only required field on an item and
 * everything richer is optional enrichment layered on top.
 *
 * Sessions live in their own collection (`session-model.ts`) and point back
 * here through `curriculumId`. The API still hands clients a curriculum with
 * its `sessions` attached, so this split is invisible above the controller.
 */

export interface ICurriculum {
  _id: mongoose.Types.ObjectId;
  /** Card number on the Mission page ("1", "2"). */
  number: number;
  /** URL-safe id, e.g. "cuando-la-tierra-cambia". Unique. */
  slug: string;
  title: Localized;
  /** The accent line under the title ("Nosotros También"). */
  highlightedTitle: Localized;
  description: Localized;
  /** "Claudia A. González, MSC" */
  author: Localized;
  /** Card accent colour, e.g. "#7950c3". */
  accent: string;
  published: boolean;
  /**
   * Retired. Distinct from `published`: unpublished means not on the Mission
   * page yet, archived means no new groups may be started from it. Existing
   * groups keep working, which is what makes archiving a safe answer when a
   * curriculum cannot be deleted because groups depend on it.
   */
  archived: boolean;
  order: number;
}

export interface CurriculumModel extends Model<ICurriculum> {}

const curriculumSchema = new Schema<ICurriculum>(
  {
    number: { type: Number, default: 1 },
    slug: { type: String, required: true, unique: true, trim: true },
    title: localized(),
    highlightedTitle: localized(),
    description: localized(),
    author: localized(),
    accent: { type: String, default: "#7950c3" },
    published: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "curriculums",
    /**
     * The editor saves a whole curriculum at once. Without this, two authors
     * editing different sessions at the same time would silently overwrite one
     * another — the second save wins and the first author's work is gone with
     * no error. With it, the stale save fails and can be retried against
     * current content.
     */
    optimisticConcurrency: true,
  },
);

/**
 * Deleting a curriculum takes its sessions with it.
 *
 * Mongo has no foreign keys, so this is ours to enforce and it only fires on
 * the query paths hooked below. Every delete in this codebase goes through the
 * controller, which uses `findOneAndDelete`; the other two are covered so a
 * future caller reaching for them does not silently orphan a hundred sessions.
 */
const cascadeToSessions = async (ids: mongoose.Types.ObjectId[]): Promise<void> => {
  if (ids.length) await Sessions.deleteMany({ curriculumId: { $in: ids } });
};

type IdOnly = { _id: mongoose.Types.ObjectId };

curriculumSchema.pre("findOneAndDelete", async function () {
  const doc = await this.model.findOne(this.getFilter()).select("_id").lean<IdOnly | null>();
  if (doc) await cascadeToSessions([doc._id]);
});

curriculumSchema.pre("deleteOne", { document: false, query: true }, async function () {
  const doc = await this.model.findOne(this.getFilter()).select("_id").lean<IdOnly | null>();
  if (doc) await cascadeToSessions([doc._id]);
});

curriculumSchema.pre("deleteMany", async function () {
  const docs = await this.model.find(this.getFilter()).select("_id").lean<IdOnly[]>();
  await cascadeToSessions(docs.map((d) => d._id));
});

const Curriculums = mongoose.model<ICurriculum, CurriculumModel>("Curriculums", curriculumSchema);

export { Curriculums };
