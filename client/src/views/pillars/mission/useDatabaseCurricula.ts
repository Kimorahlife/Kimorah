import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../../api";
import { PriorityProgramItem } from "./mission-data";

/**
 * The curriculum cards, built from the database instead of `mission-data.ts`.
 *
 * Only the per-curriculum fields come from the database — number, title,
 * highlighted title, description, accent. Everything around them (the artwork,
 * the purpose line, the audience note, the "Explore curriculum" label) is
 * programme copy that a curriculum document does not carry, so it keeps coming
 * from `mission-data.ts` unchanged. That split is the whole point: the two
 * cards should differ only where the database is actually the source.
 */

interface Localized {
  en: string;
  es: string;
}

interface CurriculumCard {
  _id: string;
  number: number;
  slug: string;
  title: Localized;
  highlightedTitle?: Localized;
  description: Localized;
  accent: string;
}

export interface DatabaseCurricula {
  /** The hardcoded programme, with its curricula swapped for the stored ones. */
  program: PriorityProgramItem | null;
  loading: boolean;
  /** Set when the fetch failed outright, so the page can say so rather than look empty. */
  error: string | null;
  /** True when a signed-in author is seeing drafts the public would not. */
  includesDrafts: boolean;
}

export const useDatabaseCurricula = (fallback: PriorityProgramItem): DatabaseCurricula => {
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language).startsWith("es");

  const [rows, setRows] = useState<CurriculumCard[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includesDrafts, setIncludesDrafts] = useState(false);

  useEffect(() => {
    let live = true;

    const load = async () => {
      // An author with a token sees drafts too, so a curriculum can be checked
      // here before it is published. Anyone else gets the published list.
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await api.get("/api/curriculums/all");
          if (!live) return;
          setRows(data?.message ?? []);
          setIncludesDrafts(true);
          setLoading(false);
          return;
        } catch {
          // No curriculums grant — fall through to the public list.
        }
      }

      try {
        const { data } = await api.get("/api/curriculums/public");
        if (!live) return;
        setRows(data?.message ?? []);
        setIncludesDrafts(false);
      } catch (e: any) {
        if (!live) return;
        setError(e?.response?.data?.message || e?.message || "Could not load curricula.");
      } finally {
        if (live) setLoading(false);
      }
    };

    load();
    return () => {
      live = false;
    };
  }, []);

  const pick = (value?: Localized): string => (spanish ? value?.es || value?.en : value?.en || value?.es) ?? "";

  const program: PriorityProgramItem | null =
    rows && rows.length
      ? {
          ...fallback,
          curricula: rows.map((row, index) => ({
            number: row.number,
            slug: row.slug,
            title: pick(row.title),
            highlightedTitle: pick(row.highlightedTitle) || undefined,
            description: pick(row.description),
            // Not stored on a curriculum — the same label on every card.
            action: fallback.curricula[index]?.action ?? fallback.curricula[0]?.action ?? "",
            accent: row.accent || fallback.curricula[index]?.accent || "#7950c3",
          })),
        }
      : null;

  return { program, loading, error, includesDrafts };
};
