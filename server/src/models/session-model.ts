import mongoose, { Model, Schema } from "mongoose";
import { CURRICULUM_ICONS } from "../config/curriculum-icons";
import { Localized, localized, localizedList } from "./localized";

/**
 * Session — one session of a curriculum, as its own document.
 *
 * These were embedded in `Curriculums.sessions[]` until groups arrived. A group
 * records participants per session, and the change log records what happened to
 * a session, so both need to reference one — and a reference into an array
 * element is a key you cannot populate, index across curricula, or protect.
 *
 * The extraction preserved every `_id`, because the embedded subdocuments
 * already carried real ObjectIds. Nothing that pointed at a session before the
 * move points anywhere different after it.
 *
 * Content below the session — sections, groups, items — is still nested here.
 * A session is edited and saved whole, so keeping it in one document keeps that
 * write atomic; splitting further would buy nothing today.
 *
 * A session's shape, taken from the source document:
 *
 *   Título · Tema principal (keywords) · [Presentación de los participantes]
 *   Conceptos · Objetivos · Psicoeducación · Intervención · Procesamiento
 *   Cierre psicoeducativo (prose) · Feedback y cierre
 *   Enfoque terapéutico · Referencia clínica
 */

/**
 * One bullet from the source document, with optional enrichment.
 *
 * `title` alone reproduces the document faithfully. `lead`, `body`, `prompts`
 * and `icon` are what the website adds on top — leave them empty and the item
 * is still complete.
 */
export interface CurriculumItem {
  order: number;
  icon?: string;
  title: Localized;
  lead?: Localized;
  body?: Localized;
  prompts: Localized[];
}

const itemSchema = new Schema<CurriculumItem>(
  {
    order: { type: Number, default: 0 },
    icon: { type: String, enum: [...CURRICULUM_ICONS, ""], default: "" },
    title: localized(),
    lead: localized(),
    body: localized(),
    prompts: localizedList(),
  },
  { _id: true },
);

/**
 * A named run of items inside a section.
 *
 * Psicoeducación is the reason this exists: it is not one list but several
 * headed ones. Simpler sections carry a single group with no heading, so one
 * shape covers both.
 */
/**
 * How a group's items are meant to read.
 *
 * "points" is the bulleted shape every section has always had. "prose" is for
 * a run that is really a paragraph or two of explanation, where each item is a
 * sentence rather than a bullet — the site sets it as flowing text instead of
 * tiles. Kept on the group because it is a property of the writing, not of the
 * page: the same group reads the same way wherever it is shown.
 */
export const GROUP_LAYOUTS = ["points", "prose"] as const;
export type GroupLayout = (typeof GROUP_LAYOUTS)[number];

export interface ItemGroup {
  order: number;
  heading?: Localized;
  intro?: Localized;
  layout?: GroupLayout;
  items: CurriculumItem[];
}

const groupSchema = new Schema<ItemGroup>(
  {
    order: { type: Number, default: 0 },
    heading: localized(),
    intro: localized(),
    // Defaulted rather than required so every group written before this field
    // existed keeps rendering exactly as it did.
    layout: { type: String, enum: GROUP_LAYOUTS, default: "points" },
    items: { type: [itemSchema], default: [] },
  },
  { _id: true },
);

export interface CurriculumSection {
  /** Prose above the groups, e.g. Intervención's "Enfocada en:". */
  intro?: Localized;
  groups: ItemGroup[];
}

const sectionSchema = new Schema<CurriculumSection>(
  {
    intro: localized(),
    groups: { type: [groupSchema], default: [] },
  },
  { _id: false },
);

/** The five list-backed sections, in the order the source document presents them. */
export const SECTION_KEYS = [
  "concepts",
  "objectives",
  "psychoeducation",
  "intervention",
  "processing",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export type CurriculumSections = Record<SectionKey, CurriculumSection>;

/**
 * The opening round only the first session runs — participants introduce
 * themselves. Every other session leaves it empty.
 */
export interface Presentation {
  body: Localized;
  prompts: Localized[];
  reminder: Localized;
}

export interface ISession {
  _id: mongoose.Types.ObjectId;
  curriculumId: mongoose.Types.ObjectId;
  order: number;
  number: number;
  title: Localized;
  /** "Tema principal" — a list of theme keywords, not a paragraph. */
  mainTopic: Localized[];
  presentation: Presentation;
  sections: CurriculumSections;
  /** "Cierre psicoeducativo" — prose, one to three paragraphs. */
  closing: Localized;
  /** "Feedback y cierre en una nota positiva" — closing prompts. */
  feedback: Localized[];
  /** "Enfoque terapéutico" — e.g. "ACT, Teoría Polivagal y Mindfulness". */
  therapeuticApproach: Localized;
  /** "Referencia clínica" — the paragraph justifying the modalities. */
  clinicalReference: Localized;
}

export interface SessionModel extends Model<ISession> {}

const sessionSchema = new Schema<ISession>(
  {
    curriculumId: { type: Schema.Types.ObjectId, ref: "Curriculums", required: true },
    order: { type: Number, default: 0 },
    number: { type: Number, default: 1 },
    title: localized(),
    mainTopic: localizedList(),
    presentation: {
      body: localized(),
      prompts: localizedList(),
      reminder: localized(),
    },
    sections: {
      type: new Schema(
        Object.fromEntries(
          SECTION_KEYS.map((k) => [
            k,
            { type: sectionSchema, default: () => ({ intro: { en: "", es: "" }, groups: [] }) },
          ]),
        ),
        { _id: false },
      ),
      default: () => ({}),
    },
    closing: localized(),
    feedback: localizedList(),
    therapeuticApproach: localized(),
    clinicalReference: localized(),
  },
  { timestamps: true, collection: "sessions" },
);

// Every read is "the sessions of this curriculum, in authoring order".
sessionSchema.index({ curriculumId: 1, order: 1 });

const Sessions = mongoose.model<ISession, SessionModel>("Sessions", sessionSchema);

export { Sessions };
