/**
 * CURRICULUM_ICONS — the icons an author may attach to a curriculum item.
 *
 * Stored as plain string keys, never component references, so a curriculum
 * document stays serialisable JSON. The client maps each key to a Material
 * icon in `client/src/views/curriculum/icons.ts`; the two lists must agree.
 *
 * These are the icons the live Session 1 pages already use (see
 * MissionObjectivesPage.tsx and MissionPsychoeducationPage.tsx), so an authored
 * curriculum can reproduce the existing look.
 */
export const CURRICULUM_ICONS = [
  "shield",
  "people",
  "heart",
  "chat",
  "psychology",
  "volunteer",
  "spa",
  "book",
  "lightbulb",
  "target",
  "star",
  "hearing",
  "balance",
  "selfImprovement",
  "info",
  // Also used by the live Session 1 psychoeducation cards — "Difficulty
  // sleeping", "Repetitive thoughts", "Need for support and connection".
  "sleep",
  "cycle",
  "community",
] as const;

export type CurriculumIcon = (typeof CURRICULUM_ICONS)[number];

export const isCurriculumIcon = (value: unknown): value is CurriculumIcon =>
  typeof value === "string" && (CURRICULUM_ICONS as readonly string[]).includes(value);
