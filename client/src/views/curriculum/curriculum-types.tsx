import { ReactNode } from "react";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import HearingOutlinedIcon from "@mui/icons-material/HearingOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SelfImprovementOutlinedIcon from "@mui/icons-material/SelfImprovementOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";

/**
 * Client-side mirror of the curriculum model in
 * server/src/models/curriculum-model.ts. Keep the two in step — the section
 * keys and icon keys are a contract between them.
 *
 * This models the author's source document, not the website's rendering of it:
 * an item's `title` alone reproduces the document, and `lead` / `body` /
 * `prompts` / `icon` are optional enrichment the site layers on top.
 */

export interface Localized {
  en: string;
  es: string;
  /**
   * Fingerprint of the English this Spanish was approved against. Lets the
   * editor tell "translated a while ago" from "the English has changed since".
   * Absent on anything written before this existed — that reads as unknown,
   * not stale.
   */
  translatedFrom?: string;
}

export interface CurriculumItem {
  _id?: string;
  order: number;
  icon?: string;
  title: Localized;
  lead?: Localized;
  body?: Localized;
  prompts: Localized[];
}

/** A named run of items — Psicoeducación's "Explicar:", "Teoría Polivagal", … */
export interface ItemGroup {
  _id?: string;
  order: number;
  heading?: Localized;
  intro?: Localized;
  items: CurriculumItem[];
}

export interface CurriculumSection {
  intro?: Localized;
  groups: ItemGroup[];
}

/** The five list-backed sections, in source-document order. */
export const SECTION_KEYS = [
  "concepts",
  "objectives",
  "psychoeducation",
  "intervention",
  "processing",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

/**
 * Labels as the source document names them, plus the singular used by the
 * "Add …" buttons and a hint shown above each section in the editor.
 */
export const SECTION_LABELS: Record<
  SectionKey,
  { en: string; es: string; one: string; hint?: string }
> = {
  concepts: { en: "Concepts", es: "Conceptos", one: "concept" },
  objectives: { en: "Objectives", es: "Objetivos", one: "objective" },
  psychoeducation: {
    en: "Psychoeducation",
    es: "Psicoeducación",
    one: "point",
    hint: 'Use a named group per headed run — "Explicar", "Teoría Polivagal", "Estrategias adaptativas".',
  },
  intervention: {
    en: "Intervention",
    es: "Intervención",
    one: "focus",
    hint: 'The lead-in ("Enfocada en:") goes in the section intro.',
  },
  processing: {
    en: "Processing",
    es: "Procesamiento",
    one: "question",
    hint: 'The lead-in ("Preguntas sugeridas:") goes in the section intro.',
  },
};

/** Sections where the optional enrichment fields are worth showing. */
export const SECTIONS_WITH_LEAD: SectionKey[] = ["concepts"];
export const SECTIONS_WITH_PROMPTS: SectionKey[] = ["concepts"];

export type CurriculumSections = Record<SectionKey, CurriculumSection>;

/** Session 1's opening round. Empty on every other session. */
export interface Presentation {
  body: Localized;
  prompts: Localized[];
  reminder: Localized;
}

export interface CurriculumSession {
  _id?: string;
  order: number;
  number: number;
  title: Localized;
  /** "Tema principal" — theme keywords, not a paragraph. */
  mainTopic: Localized[];
  presentation: Presentation;
  sections: CurriculumSections;
  /** "Cierre psicoeducativo" — prose. */
  closing: Localized;
  /** "Feedback y cierre en una nota positiva". */
  feedback: Localized[];
  /** "Enfoque terapéutico". */
  therapeuticApproach: Localized;
  /** "Referencia clínica". */
  clinicalReference: Localized;
}

export interface Curriculum {
  _id?: string;
  number: number;
  slug: string;
  title: Localized;
  highlightedTitle: Localized;
  description: Localized;
  author: Localized;
  accent: string;
  published: boolean;
  order: number;
  sessions: CurriculumSession[];
}

/** Icon keys must match server/src/config/curriculum-icons.ts. */
export const ICON_OPTIONS: Array<{ key: string; label: string; node: ReactNode }> = [
  { key: "shield", label: "Shield", node: <ShieldOutlinedIcon /> },
  { key: "people", label: "People", node: <PeopleOutlineRoundedIcon /> },
  { key: "heart", label: "Heart", node: <FavoriteBorderRoundedIcon /> },
  { key: "chat", label: "Chat", node: <ChatBubbleOutlineRoundedIcon /> },
  { key: "psychology", label: "Psychology", node: <PsychologyOutlinedIcon /> },
  { key: "volunteer", label: "Volunteer", node: <VolunteerActivismOutlinedIcon /> },
  { key: "spa", label: "Spa", node: <SpaOutlinedIcon /> },
  { key: "book", label: "Book", node: <MenuBookOutlinedIcon /> },
  { key: "lightbulb", label: "Lightbulb", node: <LightbulbOutlinedIcon /> },
  { key: "target", label: "Target", node: <TrackChangesOutlinedIcon /> },
  { key: "star", label: "Star", node: <StarBorderRoundedIcon /> },
  { key: "hearing", label: "Hearing", node: <HearingOutlinedIcon /> },
  { key: "balance", label: "Balance", node: <BalanceOutlinedIcon /> },
  { key: "selfImprovement", label: "Self-improvement", node: <SelfImprovementOutlinedIcon /> },
  { key: "info", label: "Info", node: <InfoOutlinedIcon /> },
  { key: "sleep", label: "Sleep", node: <BedtimeOutlinedIcon /> },
  { key: "cycle", label: "Repeating", node: <LoopRoundedIcon /> },
  { key: "community", label: "Community", node: <Diversity3OutlinedIcon /> },
];

export const iconNode = (key?: string): ReactNode =>
  ICON_OPTIONS.find((o) => o.key === key)?.node ?? null;

export const emptyLocalized = (): Localized => ({ en: "", es: "" });

export const emptyItem = (order: number): CurriculumItem => ({
  order,
  icon: "",
  title: emptyLocalized(),
  lead: emptyLocalized(),
  body: emptyLocalized(),
  prompts: [],
});

export const emptyGroup = (order: number): ItemGroup => ({
  order,
  heading: emptyLocalized(),
  intro: emptyLocalized(),
  items: [],
});

export const emptySection = (): CurriculumSection => ({
  intro: emptyLocalized(),
  groups: [],
});

export const emptySections = (): CurriculumSections =>
  SECTION_KEYS.reduce((acc, k) => {
    acc[k] = emptySection();
    return acc;
  }, {} as CurriculumSections);

export const emptySession = (order: number): CurriculumSession => ({
  order,
  number: order + 1,
  title: emptyLocalized(),
  mainTopic: [],
  presentation: { body: emptyLocalized(), prompts: [], reminder: emptyLocalized() },
  sections: emptySections(),
  closing: emptyLocalized(),
  feedback: [],
  therapeuticApproach: emptyLocalized(),
  clinicalReference: emptyLocalized(),
});

export const emptyCurriculum = (): Curriculum => ({
  number: 1,
  slug: "",
  title: emptyLocalized(),
  highlightedTitle: emptyLocalized(),
  description: emptyLocalized(),
  author: emptyLocalized(),
  accent: "#7950c3",
  published: false,
  order: 0,
  sessions: [],
});

/**
 * Fill any gap a stored document may have — a section added after it was
 * saved, or a section still held as a bare array from before grouped sections
 * existed. Mirrors the server's normalisation so the editor never maps over
 * undefined.
 */
const hydrateSection = (raw: any): CurriculumSection => {
  if (Array.isArray(raw)) {
    return { intro: emptyLocalized(), groups: raw.length ? [{ ...emptyGroup(0), items: raw }] : [] };
  }
  return {
    intro: raw?.intro ?? emptyLocalized(),
    groups: Array.isArray(raw?.groups) ? raw.groups : [],
  };
};

export const hydrateSession = (s: Partial<CurriculumSession>, i: number): CurriculumSession => ({
  ...emptySession(i),
  ...s,
  mainTopic: Array.isArray(s.mainTopic) ? s.mainTopic : [],
  feedback: Array.isArray(s.feedback) ? s.feedback : [],
  presentation: {
    body: s.presentation?.body ?? emptyLocalized(),
    prompts: Array.isArray(s.presentation?.prompts) ? s.presentation!.prompts : [],
    reminder: s.presentation?.reminder ?? emptyLocalized(),
  },
  sections: SECTION_KEYS.reduce((acc, k) => {
    acc[k] = hydrateSection((s.sections as any)?.[k]);
    return acc;
  }, {} as CurriculumSections),
});

/** Total authored items across every group of every section of a session. */
export const sessionItemCount = (s: CurriculumSession): number =>
  SECTION_KEYS.reduce(
    (n, k) => n + (s.sections?.[k]?.groups ?? []).reduce((m, g) => m + (g.items?.length ?? 0), 0),
    0,
  );
