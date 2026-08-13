import mongoose, { Model, Schema } from "mongoose";
import { CURRICULUM_ICONS } from "../config/curriculum-icons";

/**
 * Curriculum — the authored form of a Mission psychoeducational curriculum.
 *
 * This models the AUTHOR'S source document, not the website's rendering of it.
 * The distinction matters: the live Session 1 pages show a title, a body
 * paragraph and two reflection prompts per concept, but the source document
 * carries only a single bullet line for each — the rest was written during the
 * website build. So `title` is the only required field on an item and
 * everything richer is optional enrichment layered on top.
 *
 * A session's shape, taken from the source document:
 *
 *   Título · Tema principal (keywords) · [Presentación de los participantes]
 *   Conceptos · Objetivos · Psicoeducación · Intervención · Procesamiento
 *   Cierre psicoeducativo (prose) · Feedback y cierre
 *   Enfoque terapéutico · Referencia clínica
 *
 * Sessions and their content are embedded rather than separate collections: a
 * curriculum is small, always read whole, and always saved whole from the
 * editor, so a single document keeps reads and writes atomic.
 */

/**
 * Every author-facing string is bilingual — the whole site runs EN/ES.
 *
 * `translatedFrom` fingerprints the English the Spanish was approved against,
 * so the editor can tell a translation that is merely old from one that is now
 * wrong. Empty on anything written before this existed, which reads as
 * "unknown" rather than "stale" — an author is never nagged about a line
 * nobody has reviewed yet.
 */
export interface Localized {
  en: string;
  es: string;
  translatedFrom?: string;
}

const localizedSchema = new Schema<Localized>(
  {
    en: { type: String, default: "" },
    es: { type: String, default: "" },
    translatedFrom: { type: String, default: "" },
  },
  { _id: false },
);

const localized = () => ({ type: localizedSchema, default: () => ({ en: "", es: "" }) });
const localizedList = () => ({ type: [localizedSchema], default: [] });

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
 * headed ones — "Explicar:", "Normalizar respuestas frecuentes como:",
 * "Teoría Polivagal", "Estrategias adaptativas" / "desadaptativas". Simpler
 * sections carry a single group with no heading, so one shape covers both.
 */
export interface ItemGroup {
  order: number;
  heading?: Localized;
  intro?: Localized;
  items: CurriculumItem[];
}

const groupSchema = new Schema<ItemGroup>(
  {
    order: { type: Number, default: 0 },
    heading: localized(),
    intro: localized(),
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
 * The opening round only Session 1 runs — participants introduce themselves.
 * Every other session leaves it empty.
 */
export interface Presentation {
  body: Localized;
  prompts: Localized[];
  reminder: Localized;
}

export interface CurriculumSession {
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

const sessionSchema = new Schema<CurriculumSession>(
  {
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
  { _id: true },
);

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
  order: number;
  sessions: CurriculumSession[];
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
    order: { type: Number, default: 0 },
    sessions: { type: [sessionSchema], default: [] },
  },
  { timestamps: true, collection: "curriculums" },
);

const Curriculums = mongoose.model<ICurriculum, CurriculumModel>("Curriculums", curriculumSchema);

export { Curriculums };
