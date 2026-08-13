import type { Localized } from "./curriculum-types";

/**
 * Pairing the two languages of a curriculum draft.
 *
 * Curricula are authored in English; the Spanish is proposed by the translator,
 * reviewed by a person, and only then written into the draft. These helpers are
 * the two halves of that trip: pull every distinct string out of a draft, and
 * put approved translations back in.
 *
 * They walk the draft generically rather than naming fields, so a bilingual
 * field added anywhere in a curriculum is picked up the day it is added.
 *
 * Deliberately pure and dependency-free — no React, no HTTP — so the rules that
 * matter (never lose a translation, never touch the source language) can be
 * tested on their own.
 */

export type Lang = "en" | "es";

export interface TranslationPair {
  /** The authored string, in the source language. */
  source: string;
  /** Its translation today — empty when there isn't one yet. */
  target: string;
  /**
   * The source has been edited since this translation was approved, so the
   * translation may no longer say the same thing. False when there is no
   * translation yet, and false when nothing was ever approved — an unreviewed
   * line is untranslated, not stale.
   */
  stale: boolean;
}

/**
 * A short, stable fingerprint of a string.
 *
 * FNV-1a. Not security — this only has to change when the text changes, and
 * survive a round trip through Mongo as a plain string.
 */
export const fingerprint = (value: string): string => {
  let h = 0x811c9dc5;
  const text = value.trim();
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
};

const other = (lang: Lang): Lang => (lang === "en" ? "es" : "en");

const isLocalized = (v: unknown): v is Localized =>
  Boolean(v) &&
  typeof v === "object" &&
  typeof (v as Localized).en === "string" &&
  typeof (v as Localized).es === "string";

const walk = (node: unknown, visit: (l: Localized) => void): void => {
  if (isLocalized(node)) {
    visit(node);
    return;
  }
  if (Array.isArray(node)) node.forEach((n) => walk(n, visit));
  else if (node && typeof node === "object") Object.values(node).forEach((n) => walk(n, visit));
};

/**
 * Every distinct authored string in the draft, with whatever translation it
 * already has.
 *
 * De-duplicating by source matters more than it looks: headings like "Explain:"
 * repeat across sessions, and the review should show them once, translate them
 * once, and apply one answer everywhere.
 */
export const collectPairs = (node: unknown, to: Lang): TranslationPair[] => {
  const from = other(to);
  const pairs = new Map<string, TranslationPair>();

  walk(node, (l) => {
    const source = l[from].trim();
    if (!source) return;
    const target = l[to].trim();
    // A translation is stale only when we know what it was approved against
    // and that no longer matches. No fingerprint means nobody has reviewed it,
    // which is not the same thing as out of date.
    const approved = l.translatedFrom ?? "";
    const stale = Boolean(target) && Boolean(approved) && approved !== fingerprint(source);

    const seen = pairs.get(source);
    // First non-empty translation wins, so an existing one is never hidden by a
    // later blank copy of the same string.
    if (seen === undefined || (!seen.target && target)) pairs.set(source, { source, target, stale });
  });

  return Array.from(pairs.values());
};

/** The subset still waiting on a translation — what actually gets sent. */
export const untranslated = (node: unknown, to: Lang): string[] =>
  collectPairs(node, to)
    .filter((p) => !p.target)
    .map((p) => p.source);

/** Lines whose source changed after the translation was approved. */
export const needsReview = (node: unknown, to: Lang): string[] =>
  collectPairs(node, to)
    .filter((p) => p.stale)
    .map((p) => p.source);

/**
 * A deep copy with the target language written from `map`.
 *
 * Applied unconditionally for any source present in the map, because the map
 * comes from a review the author just approved — including edits to a
 * translation that already existed.
 *
 * Every source in the map is fingerprinted, even where the text did not change:
 * the author just looked at that pairing and accepted it, which is exactly what
 * makes a later edit to the English worth flagging. `filled` still counts only
 * the lines whose translation actually changed.
 */
export const applyTranslations = <T>(
  node: T,
  to: Lang,
  map: Map<string, string>,
): { value: T; filled: number } => {
  const from = other(to);
  let filled = 0;

  const rebuild = (n: unknown): unknown => {
    if (isLocalized(n)) {
      const source = n[from].trim();
      if (!source) return n;
      const next = map.get(source);
      if (next === undefined) return n;
      const stamp = fingerprint(source);
      if (next === n[to] && n.translatedFrom === stamp) return n;
      if (next !== n[to]) filled += 1;
      return { ...n, [to]: next, translatedFrom: stamp };
    }
    if (Array.isArray(n)) return n.map(rebuild);
    if (n && typeof n === "object") {
      return Object.fromEntries(Object.entries(n).map(([k, v]) => [k, rebuild(v)]));
    }
    return n;
  };

  return { value: rebuild(node) as T, filled };
};

/** Pair the strings sent with the translations returned, dropping anything blank. */
export const toTranslationMap = (sent: string[], received: unknown): Map<string, string> => {
  const list = Array.isArray(received) ? received : [];
  const map = new Map<string, string>();
  sent.forEach((source, i) => {
    const value = list[i];
    if (typeof value === "string" && value.trim()) map.set(source, value);
  });
  return map;
};
