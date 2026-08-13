import { Schema } from "mongoose";

/**
 * Every author-facing string is bilingual — the whole site runs EN/ES.
 *
 * `translatedFrom` fingerprints the English the Spanish was approved against,
 * so the editor can tell a translation that is merely old from one that is now
 * wrong. Empty on anything written before this existed, which reads as
 * "unknown" rather than "stale" — an author is never nagged about a line
 * nobody has reviewed yet.
 *
 * Lives on its own because both curricula and sessions are built from it, and
 * sessions are their own collection. Importing it from either model would make
 * the two models depend on each other.
 */
export interface Localized {
  en: string;
  es: string;
  translatedFrom?: string;
}

export const localizedSchema = new Schema<Localized>(
  {
    en: { type: String, default: "" },
    es: { type: String, default: "" },
    translatedFrom: { type: String, default: "" },
  },
  { _id: false },
);

export const localized = () => ({
  type: localizedSchema,
  default: () => ({ en: "", es: "" }),
});

export const localizedList = () => ({ type: [localizedSchema], default: [] });
