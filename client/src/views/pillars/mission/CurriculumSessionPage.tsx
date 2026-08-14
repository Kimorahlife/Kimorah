import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HearingOutlinedIcon from "@mui/icons-material/HearingOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SelfImprovementOutlinedIcon from "@mui/icons-material/SelfImprovementOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CurriculumHeader from "../../shared/CurriculumHeader";
import type { GroupDetail } from "../../../types/groups";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import { api } from "../../../api";

/**
 * One session of a stored curriculum, rendered in Session 1's design.
 *
 * This is the template: every session of every curriculum in the database goes
 * through this one page, so the layout and typography Session 1 established
 * are what sessions 2, 3 and 7 get for free. The hand-built session pages stay
 * where they are for comparison — nothing here replaces them yet.
 *
 * Content comes from the curriculum document. The blocks that read the same on
 * every curriculum — the facilitator reminders, the intervention note — are
 * page furniture and live here in the page, deliberately not in the data.
 */

const SERIF = '"Inter", "Segoe UI", Arial, sans-serif';
const TITLE_FONT = '"Playfair Display", Georgia, "Times New Roman", serif';
const INK = "#211866";
const PURPLE = "#7650b3";
const PAPER = "rgba(255,255,255,.72)";
/** What the curriculum model stores when no colour has been chosen. */
const DEFAULT_ACCENT = "#7950c3";
const WHEN_LOVE_REMAINS_SLUG = "when-love-remains";
const WHEN_LOVE_REMAINS_MAGENTA = "#aa3f7b";

type Lang = "en" | "es";
interface Localized { en: string; es: string }
interface Item { icon?: string; title: Localized; lead?: Localized; body?: Localized; prompts: Localized[]; layout?: "prose" | "point" }
/** Mirrors GROUP_LAYOUTS on the server; absent means "points". */
type GroupLayout = "points" | "prose";
interface Group { heading?: Localized; intro?: Localized; layout?: GroupLayout; items: Item[] }
interface Section { intro?: Localized; groups: Group[] }
interface Session {
  number: number;
  title: Localized;
  mainTopic: Localized[];
  presentation: { body: Localized; prompts: Localized[]; reminder: Localized };
  sections: Record<string, Section>;
  closing: Localized;
  feedback: Localized[];
  therapeuticApproach: Localized;
  clinicalReference: Localized;
}
interface Curriculum { slug: string; title: Localized; accent: string; sessions: Session[] }

type TabId = "introduction" | "concepts" | "objectives" | "psychoeducation" | "intervention" | "processing" | "closing";

const TABS: Array<{ id: TabId; icon: typeof SpaOutlinedIcon; en: string; es: string }> = [
  { id: "introduction", icon: SpaOutlinedIcon, en: "Introduction", es: "Introducción" },
  { id: "concepts", icon: LightbulbOutlinedIcon, en: "Concepts", es: "Conceptos" },
  { id: "objectives", icon: TrackChangesOutlinedIcon, en: "Objectives", es: "Objetivos" },
  { id: "psychoeducation", icon: MenuBookOutlinedIcon, en: "Psychoeducation", es: "Psicoeducación" },
  { id: "intervention", icon: SpaOutlinedIcon, en: "Intervention", es: "Intervención" },
  { id: "processing", icon: ForumOutlinedIcon, en: "Processing", es: "Procesamiento" },
  { id: "closing", icon: FavoriteBorderRoundedIcon, en: "Closing", es: "Cierre" },
];

/**
 * The icon an item chose, matching the keys the builder offers. Falls back to
 * the item's position, so a bullet with no icon still gets the same 58px disc
 * the hardcoded page draws.
 */
const ICONS: Record<string, typeof SpaOutlinedIcon> = {
  shield: ShieldOutlinedIcon, people: GroupsOutlinedIcon, community: GroupsOutlinedIcon,
  heart: FavoriteBorderRoundedIcon, chat: ForumOutlinedIcon, psychology: PsychologyOutlinedIcon,
  volunteer: VolunteerActivismOutlinedIcon, spa: SpaOutlinedIcon, book: MenuBookOutlinedIcon,
  lightbulb: LightbulbOutlinedIcon, target: TrackChangesOutlinedIcon, star: StarBorderRoundedIcon,
  hearing: HearingOutlinedIcon, balance: BalanceOutlinedIcon, selfImprovement: SelfImprovementOutlinedIcon,
  info: InfoOutlinedIcon, sleep: BedtimeOutlinedIcon, cycle: LoopRoundedIcon,
};

const iconFor = (key: string | undefined, index: number): React.ReactNode => {
  const Icon = key ? ICONS[key] : undefined;
  return Icon ? <Icon sx={{ fontSize: 34 }} /> : index + 1;
};

/**
 * The Introduction's psychoeducation overview follows the six-icon visual
 * language established by Session 3. This presentation is intentionally
 * consistent across sessions, independent of the editor's list-item icons.
 */
const PSYCHOEDUCATION_OVERVIEW_ICONS = [
  PsychologyOutlinedIcon,
  PsychologyOutlinedIcon,
  SpaOutlinedIcon,
  FavoriteBorderRoundedIcon,
  VolunteerActivismOutlinedIcon,
  MenuBookOutlinedIcon,
];

const psychoeducationOverviewIcon = (index: number): React.ReactNode => {
  const Icon = PSYCHOEDUCATION_OVERVIEW_ICONS[index % PSYCHOEDUCATION_OVERVIEW_ICONS.length];
  return <Icon sx={{ fontSize: 42 }} />;
};

const sectionCard = {
  border: "1px solid rgba(73,50,139,.16)",
  borderRadius: { xs: 2.5, md: 3 },
  bgcolor: PAPER,
  boxShadow: "0 12px 30px rgba(67,45,126,.025)",
};

/**
 * Session 1's panel: a disc, a serif heading, then the content.
 *
 * The disc takes the curriculum's accent. `bgcolor` is set first as a flat
 * fallback and the gradient layered over it, so a browser without `color-mix`
 * still gets a filled disc in the right colour rather than an empty ring.
 */
const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accent?: string;
  children: React.ReactNode;
}> = ({ icon, title, subtitle, accent = PURPLE, children }) => (
  <Box component="section" sx={{ ...sectionCard, scrollMarginTop: 24, p: { xs: 2.25, md: 3 }, mb: 1.75 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: subtitle ? 0.25 : 2 }}>
      <Box
        sx={{
          width: 50, height: 50, borderRadius: "50%", color: "white",
          display: "grid", placeItems: "center", flexShrink: 0,
          bgcolor: accent,
          backgroundImage: `linear-gradient(145deg, ${accent}, color-mix(in srgb, ${accent} 62%, #000))`,
        }}
      >
        {icon}
      </Box>
      <Typography component="h2" sx={{ fontFamily: SERIF, fontSize: { xs: 25, md: 29 }, lineHeight: 1.1, color: INK }}>
        {title}
      </Typography>
    </Box>
    {subtitle && (
      <Typography sx={{ ml: { xs: 0, sm: 8.25 }, mt: 0.5, mb: 3, fontSize: 18, fontWeight: 700, color: accent }}>
        {subtitle}
      </Typography>
    )}
    {children}
  </Box>
);

/** The four lines Session 1 lists under "How will we apply them?". */
const APPLICATIONS: Array<{ icon: typeof SpaOutlinedIcon; en: string; es: string }> = [
  { icon: SpaOutlinedIcon, en: "Creating a safe and respectful space.", es: "Creando un espacio seguro y de respeto." },
  { icon: HearingOutlinedIcon, en: "Listening actively and without judgment.", es: "Escuchando activamente y sin juicios." },
  { icon: FavoriteBorderRoundedIcon, en: "Validating our emotions and those of others.", es: "Validando nuestras emociones y las de los demás." },
  { icon: TrackChangesOutlinedIcon, en: "Opening the door to reflection, learning, and healing.", es: "Abriendo la puerta a la reflexión, el aprendizaje y la sanación." },
];

/**
 * Each section draws its rows slightly differently on the hardcoded pages —
 * Concepts leads with the item's icon, Objectives numbers them in serif and
 * puts the title in purple above a body line. These are those measurements.
 */
const ROW: Record<string, {
  bgcolor: string; p: number; minHeight: number; disc: number; discFont: number;
  numbered: boolean; serifTitle: boolean; showBody: boolean;
}> = {
  concepts:        { bgcolor: "rgba(255,255,255,.82)", p: 2.5,  minHeight: 112, disc: 58, discFont: 14, numbered: false, serifTitle: false, showBody: false },
  objectives:      { bgcolor: "rgba(255,255,255,.86)", p: 2.25, minHeight: 105, disc: 56, discFont: 25, numbered: true,  serifTitle: true,  showBody: true },
  psychoeducation: { bgcolor: "rgba(255,255,255,.88)", p: 2.5,  minHeight: 112, disc: 58, discFont: 26, numbered: true,  serifTitle: false, showBody: true },
  intervention:    { bgcolor: "rgba(255,255,255,.88)", p: 2.5,  minHeight: 112, disc: 58, discFont: 26, numbered: true,  serifTitle: false, showBody: false },
  processing:      { bgcolor: "rgba(255,255,255,.88)", p: 2.5,  minHeight: 112, disc: 58, discFont: 26, numbered: true,  serifTitle: false, showBody: false },
};

/** Copy that is the same on every curriculum, so it belongs to the page. */
const FIXED = {
  aside: {
    en: "This is a space to accompany one another with respect, compassion, and humanity.",
    es: "Este es un espacio para acompañarnos con respeto, compasión y humanidad.",
  },

  // The two cards the Objectives tab shows in the sidebar, matching the
  // hardcoded objectives page. Same on every session and curriculum.
  objectivesWhy: {
    title: { en: "Why have clear objectives?", es: "¿Por qué tener objetivos claros?" },
    body: {
      en: "They give direction to our group work, help us focus on what matters, and give each step a meaningful purpose.",
      es: "Dan dirección al trabajo grupal, nos ayudan a enfocarnos en lo importante y dan a cada paso un propósito significativo.",
    },
  },
  objectivesReminder: {
    title: { en: "Important reminder", es: "Recordatorio importante" },
    body: {
      en: "Each objective is a guide, not a demand. Small, conscious steps support individual and group well-being.",
      es: "Cada objetivo es una guía, no una exigencia. Los pequeños pasos conscientes apoyan el bienestar individual y grupal.",
    },
  },

  cohesion: {
    quickTip: { en: "QUICK TIP", es: "CONSEJO RÁPIDO" },
    title: { en: "GROUP COHESION", es: "COHESIÓN GRUPAL" },
    source: {
      en: "Inspired by Irvin Yalom’s Theory of Group Psychotherapy.",
      es: "Inspirado en la Teoría de Psicoterapia de Grupo de Irvin Yalom.",
    },
    body: {
      en: "Cohesion grows when members feel belonging, acceptance, trust, and connection. Yalom viewed this connection as a key therapeutic factor supporting participation, mutual support, and deeper healing.",
      es: "La cohesión crece cuando los miembros sienten pertenencia, aceptación, confianza y conexión. Yalom consideraba esta conexión un factor terapéutico clave que favorece la participación, el apoyo mutuo y una sanación más profunda.",
    },
    reminderLabel: { en: "Facilitator reminder: ", es: "Recordatorio para quien facilita: " },
    reminder: {
      en: "You are not just guiding the process—you are cultivating connection. Create moments for everyone to feel seen, heard, and valued.",
      es: "No solo está guiando el proceso; está cultivando la conexión. Cree momentos para que todas las personas se sientan vistas, escuchadas y valoradas.",
    },
  },

  // Four runs, two of them bold — the emphasis is part of the copy.
  interventionNote: {
    en: ["You may choose any ", "evidence-based intervention", " that aligns with the therapeutic focus and objectives of this session. ", "Expressive and creative approaches—including art, music, poetry, writing, movement, or other evidence-informed activities—are encouraged when clinically appropriate and supportive of the group’s needs and therapeutic process."],
    es: ["Puede elegir cualquier ", "intervención basada en evidencia", " que se alinee con el enfoque terapéutico y los objetivos de esta sesión. ", "Se fomentan los enfoques expresivos y creativos—incluidos el arte, la música, la poesía, la escritura, el movimiento u otras actividades basadas en evidencia—cuando sean clínicamente apropiados y apoyen las necesidades del grupo y su proceso terapéutico."],
  },
};

const CurriculumSessionPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug = "", number = "1", section = "introduction", groupId } = useParams();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";
  const pick = (v?: Localized): string => (v ? (lang === "es" ? v.es || v.en : v.en || v.es) : "");

  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [error, setError] = useState<string | null>(null);
  // The whole group, not just its name: it carries each session's id and the
  // participants recorded against it, which is what the participation card
  // below reads and writes.
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [participants, setParticipants] = useState("");
  const [savingParticipants, setSavingParticipants] = useState(false);
  const [participantsSaved, setParticipantsSaved] = useState(false);

  /**
   * The same page, read either on its own or as a group's curriculum.
   *
   * Every link inside the page is built from this, so entering from a group
   * keeps that context through the tabs, the prev/next steps and the jump to
   * the following session. Without it the group is lost on the first click and
   * the reader is quietly back on the standalone copy.
   */
  const base = groupId ? `/groups/${groupId}/c/${slug}` : `/mission/c/${slug}`;

  const tabsRef = useRef<HTMLElement | null>(null);

  /**
   * Start at the step tabs, not the very top.
   *
   * The router keeps the scroll offset across a navigation, so moving between
   * sessions from the foot of a long one would land the reader partway down a
   * page they have not read. Landing on the tabs rather than at the very top
   * skips re-reading the hero on every move while still showing where in the
   * session they are. The margin clears the site header, which is sticky when
   * a curriculum is read from Mission.
   */
  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    const top = tabs.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(top, 0), behavior: "auto" });
  }, [number, section]);

  useEffect(() => {
    if (!groupId) return;
    let live = true;
    api
      .get(`/api/groups/${groupId}`)
      .then(({ data }) => {
        if (live) setGroup(data?.message ?? null);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [groupId]);

  /** This session's row in the group, or null when read as the template. */
  const participationRow =
    group?.sessions.find((s) => String(s.number) === String(number)) ?? null;

  // Keep the field in step with whichever session is open.
  useEffect(() => {
    setParticipants(participationRow ? String(participationRow.participants) : "");
    setParticipantsSaved(false);
  }, [participationRow?.sessionId, participationRow?.participants]);

  /** Whether the field holds something other than what is recorded. */
  const participantsChanged =
    participationRow !== null &&
    participants.trim() !== "" &&
    Math.max(0, Number(participants) || 0) !== participationRow.participants;

  /**
   * Saved on blur rather than on every keystroke — typing "12" would otherwise
   * record a 1 on the way past.
   */
  const saveParticipants = async () => {
    if (!groupId || !participationRow) return;
    const value = Math.max(0, Number(participants) || 0);
    if (value === participationRow.participants) return;

    setSavingParticipants(true);
    try {
      await api.patch(`/api/groups/${groupId}/sessions/${participationRow.sessionId}`, {
        participants: value,
      });
      setGroup((current) =>
        current
          ? {
              ...current,
              sessions: current.sessions.map((s) =>
                s.sessionId === participationRow.sessionId ? { ...s, participants: value } : s,
              ),
            }
          : current,
      );
      setParticipants(String(value));
      setParticipantsSaved(true);
    } catch {
      // Leave what was typed so it can be retried rather than silently lost.
    } finally {
      setSavingParticipants(false);
    }
  };

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        // Signed-in authors can preview drafts; everyone else gets the
        // published copy, so an unfinished curriculum stays unpublished.
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const { data } = await api.get("/api/curriculums/all");
            const found = (data?.message ?? []).find((c: Curriculum) => c.slug === slug);
            if (found) { if (live) setCurriculum(found); return; }
          } catch { /* fall through to the public copy */ }
        }
        const { data } = await api.get(`/api/curriculums/public/${slug}`);
        if (live) setCurriculum(data?.message ?? null);
      } catch (e: any) {
        if (live) setError(e?.response?.data?.message || "Curriculum not found.");
      }
    })();
    return () => { live = false; };
  }, [slug]);

  const active: TabId = (TABS.some((t) => t.id === section) ? section : "introduction") as TabId;
  const session = curriculum?.sessions?.find((s) => String(s.number) === String(number));
  /**
   * The curriculum's own colour themes the page.
   *
   * This was pinned to Session 1's purple, so every stored curriculum looked
   * like that page. The colour an author picks in the builder now paints the
   * chrome, so two curricula read as two curricula.
   *
   * DEFAULT_ACCENT is what the model writes when nobody has chosen a colour,
   * so it means "unset" rather than "purple on purpose". When Love Remains was
   * themed by hand before the builder carried a colour; it keeps that until its
   * accent is stored, and then this last special case can go.
   */
  const stored = curriculum?.accent?.trim();
  const authored = stored && stored !== DEFAULT_ACCENT ? stored : "";
  const curriculumSlug = String(curriculum?.slug || slug).trim().toLowerCase();
  const accent = authored || (curriculumSlug === WHEN_LOVE_REMAINS_SLUG ? WHEN_LOVE_REMAINS_MAGENTA : PURPLE);
  // The hero keeps its near-black plum unless a curriculum carries its own
  // colour, in which case it is mixed down from that rather than hand-picked.
  const headerBackground =
    accent === PURPLE
      ? "radial-gradient(circle at 50% 44%,#292455 0%,#17173d 48%,#10122f 100%)"
      : `radial-gradient(circle at 50% 44%,${accent} 0%,color-mix(in srgb,${accent} 55%,#000) 48%,color-mix(in srgb,${accent} 25%,#000) 100%)`;

  if (error || (curriculum && !session)) {
    return (
      <Box sx={{ minHeight: "60dvh", display: "grid", placeItems: "center", color: INK }}>
        <Typography sx={{ fontFamily: TITLE_FONT, fontSize: 28 }}>
          {error ?? (lang === "es" ? "Sesión no encontrada" : "Session not found")}
        </Typography>
      </Box>
    );
  }
  if (!curriculum || !session) {
    return (
      <Box sx={{ minHeight: "60dvh", display: "grid", placeItems: "center", color: INK }}>
        <Typography>{lang === "es" ? "Cargando…" : "Loading…"}</Typography>
      </Box>
    );
  }

  const topics = (session.mainTopic ?? []).map(pick).filter(Boolean).join(" · ");
  const sessionLabel = `${lang === "es" ? "SESIÓN" : "SESSION"} ${session.number}`;

  /** A section's groups, exactly as the editor stores them. */
  const renderSection = (key: TabId) => {
    const data = session.sections?.[key];
    const groups = data?.groups ?? [];
    return (
      <>
        {pick(data?.intro) && (
          <Typography sx={{ mt: 0.5, mb: 3, fontSize: 18, fontWeight: 700, color: accent }}>
            {pick(data.intro)}
          </Typography>
        )}
        {groups.map((group, gi) => (
          <Box key={gi} sx={{ mb: 3 }}>
            {pick(group.heading) && (
              <Typography sx={{ color: accent, fontSize: 22, fontWeight: 800, mb: 1.5 }}>
                {pick(group.heading)}
              </Typography>
            )}
            {pick(group.intro) && <Typography sx={{ mb: 1.5 }}>{pick(group.intro)}</Typography>}
            <Box sx={{ display: "grid", gap: 2 }}>
              {group.items.map((item, ii) => (
                <Box
                  key={ii}
                  sx={{
                    minHeight: ROW[key].minHeight,
                    display: "flex",
                    alignItems: "center",
                    gap: 2.5,
                    p: ROW[key].p,
                    bgcolor: ROW[key].bgcolor,
                    border: "1px solid rgba(69,45,143,.14)",
                    borderRadius: 3,
                    boxShadow: "0 8px 22px rgba(67,45,126,.03)",
                  }}
                >
                  <Box
                    sx={{
                      width: ROW[key].disc, height: ROW[key].disc, flexShrink: 0, borderRadius: "50%",
                      bgcolor: `color-mix(in srgb, ${accent} 12%, #fff)`, color: accent, display: "grid", placeItems: "center",
                      fontFamily: SERIF, fontSize: ROW[key].discFont,
                    }}
                  >
                    {ROW[key].numbered ? ii + 1 : iconFor(item.icon, ii)}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    {ROW[key].serifTitle ? (
                      <Typography sx={{ fontFamily: SERIF, color: accent, fontSize: 18, fontWeight: 600, lineHeight: 1.25 }}>
                        {pick(item.title)}
                      </Typography>
                    ) : (
                      <Typography sx={{ fontSize: { xs: 15, md: 17 }, lineHeight: 1.55, fontWeight: 600 }}>
                        {pick(item.title)}
                      </Typography>
                    )}
                    {ROW[key].showBody && pick(item.body) && (
                      <Typography sx={{ fontSize: 13, lineHeight: 1.55, mt: 0.5 }}>{pick(item.body)}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
        {groups.length === 0 && (
          <Typography sx={{ color: "rgba(21,28,92,.6)" }}>
            {lang === "es" ? "Esta sección aún no tiene contenido." : "This section has no content yet."}
          </Typography>
        )}
      </>
    );
  };

  const heading = (title: string, subtitle?: string) => (
    <>
      <Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: 25, md: 29 }, lineHeight: 1.1, color: INK }}>
        {title}
      </Typography>
      {subtitle && <Typography sx={{ mt: 0.5, mb: 3 }}>{subtitle}</Typography>}
    </>
  );

  /**
   * A group an author marked as prose: each item set as its own paragraph
   * rather than a bullet with an icon.
   *
   * Defined once and used by both the Psychoeducation section and the preview
   * of it on the Introduction, so the same group cannot read as prose in one
   * place and as tiles in the other.
   */
  const isProse = (group?: Group): boolean => group?.layout === "prose";

  /**
   * Whether one item reads as a paragraph.
   *
   * An explicit `layout` on the item always wins. Failing that, a group that
   * plainly mixes the two — a paragraph or more alongside a run of bullets —
   * is judged item by item, because one flag cannot describe it: marking the
   * group prose turns the bullets into paragraphs, marking it points turns the
   * paragraph into a bullet. A group that is uniform keeps following its own
   * layout exactly as before.
   */
  const PROSE_LENGTH = 200;
  const POINT_LENGTH = 120;
  const textOf = (item: Item): string => (pick(item.title) || "").trim();

  /**
   * Reads like a paragraph rather than a bullet.
   *
   * A line break is the surer signal: a bullet is one line by definition, so
   * anything an author has broken across lines is prose whatever its length.
   * Length alone misses a short paragraph — "The goal is not to leave behind…"
   * runs to 184 characters over three lines, and sat as a bullet until this
   * looked past the character count.
   */
  const readsAsProse = (item: Item): boolean => {
    const text = textOf(item);
    return text.includes("\n") || text.length >= PROSE_LENGTH;
  };

  const groupIsMixed = (group?: Group): boolean => {
    const items = group?.items ?? [];
    return items.some(readsAsProse) &&
      items.filter((i) => !readsAsProse(i) && textOf(i).length <= POINT_LENGTH).length >= 2;
  };

  const itemIsProse = (item: Item, group?: Group): boolean => {
    if (item.layout) return item.layout === "prose";
    if (groupIsMixed(group)) return readsAsProse(item);
    return group?.layout === "prose";
  };

  /**
   * A paragraph that sits between bullets gets the same panel the section
   * opens with — a disc and a card. Left bare it reads as text that escaped
   * the layout rather than a deliberate aside.
   *
   * The first run is already introduced by the group's own disc and heading,
   * so it stays plain and does not repeat the mark.
   */
  const proseRun = (items: Item[], first: boolean) =>
    first ? (
      proseParagraphs(items)
    ) : (
      <Box
        sx={{
          bgcolor: "rgba(255,255,255,.86)",
          border: "1px solid rgba(69,45,143,.14)",
          borderRadius: 3,
          p: 2.5,
        }}
      >
        <Box
          sx={{
            width: 46, height: 46, borderRadius: "50%", bgcolor: accent, color: "white",
            display: "grid", placeItems: "center", mb: 1.5,
          }}
        >
          <LightbulbOutlinedIcon />
        </Box>
        {proseParagraphs(items)}
      </Box>
    );

  /** Consecutive items that render the same way, so each run is drawn once. */
  const runsOf = (group?: Group): Array<{ prose: boolean; items: Item[] }> => {
    const runs: Array<{ prose: boolean; items: Item[] }> = [];
    for (const item of group?.items ?? []) {
      const prose = itemIsProse(item, group);
      const last = runs[runs.length - 1];
      if (last && last.prose === prose) last.items.push(item);
      else runs.push({ prose, items: [item] });
    }
    return runs;
  };

  /** True when the group contains any prose at all — it then wants full width. */
  const hasProse = (group?: Group): boolean =>
    (group?.items ?? []).some((item) => itemIsProse(item, group));

  /**
   * A prose item may hold several paragraphs, separated by line breaks in the
   * source document. HTML collapses those to spaces, so split them here or the
   * whole item arrives as one run-on wall of text.
   */
  const paragraphsOf = (text: string): string[] =>
    text.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  const proseParagraphs = (items: Item[]) => (
    <Box sx={{ display: "grid", gap: 1.4, maxWidth: 1050 }}>
      {items
        .filter((item) => pick(item.title))
        .map((item, i) => (
          <Box key={i} sx={{ display: "grid", gap: 1.4 }}>
            {paragraphsOf(pick(item.title)).map((paragraph, pi) => (
              <Typography
                key={pi}
                component="p"
                sx={{ m: 0, fontSize: { xs: 14, md: 15.5 }, lineHeight: 1.75, color: INK }}
              >
                {paragraph}
              </Typography>
            ))}
            {/* Body still shows — a paragraph may carry an aside without
                becoming a bullet. */}
            {pick(item.body) && (
              <Typography component="p" sx={{ m: 0, mt: 0.4, fontSize: 13.5, lineHeight: 1.6, color: "#5b5680" }}>
                {pick(item.body)}
              </Typography>
            )}
          </Box>
        ))}
    </Box>
  );

  const body = () => {
    const tab = TABS.find((t) => t.id === active)!;
    const label = lang === "es" ? tab.es : tab.en;

    if (active === "introduction") {
      const objectives = (session.sections?.objectives?.groups ?? []).flatMap((g) => g.items);
      const psychoed = session.sections?.psychoeducation;
      // Session 1 shows the first headed run here, not every point. A group
      // marked as prose is preferred outright; otherwise the first with more
      // than one item, since a lone item makes a poor tile row.
      const psychoedSource =
        (psychoed?.groups ?? []).find((g) => isProse(g) || g.items.length > 1) ??
        psychoed?.groups?.[0];
      const psychoedItems = (psychoedSource?.items ?? []).slice(0, 6);
      // Was pinned to one curriculum and sessions 2–7, so no other curriculum
      // could read as prose and session 8 could not either. It is now the
      // author's choice, stored on the group.
      const prosePsychoeducation = isProse(psychoedSource);
      return (
        <>
          {/* Group only — the template has no participants to record. Sits at
              the head of the introduction because attendance is taken as a
              session opens, not after it. */}
          {groupId && participationRow && (
            <Box
              component="section"
              sx={{
                ...sectionCard,
                p: { xs: 2.25, md: 2.75 }, mb: 1.75,
                display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
              }}
            >
              {/* A plain outlined mark rather than a filled disc — this is a
                  quiet input row, not one of the numbered content sections. */}
              <GroupsOutlinedIcon sx={{ fontSize: 27, color: accent, flexShrink: 0 }} />

              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography sx={{ fontFamily: SERIF, fontSize: 16.5, fontWeight: 700, color: INK }}>
                  {lang === "es"
                    ? `Participación · Sesión ${session.number}`
                    : `Session ${session.number} participation`}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "#5b5680", mt: 0.25 }}>
                  {lang === "es"
                    ? "Indique cuántas personas del grupo participaron en esta sesión."
                    : "Enter the number of group members participating in this session."}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexShrink: 0 }}>
                <TextField
                  type="number"
                  size="small"
                  value={participants}
                  disabled={savingParticipants}
                  onChange={(event) => setParticipants(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") saveParticipants();
                  }}
                  inputProps={{ min: 0, style: { textAlign: "center", fontWeight: 700, fontSize: 18 } }}
                  sx={{
                    width: 116, bgcolor: "#fff",
                    "& .MuiOutlinedInput-root": {
                      height: 52, borderRadius: 2.5,
                      "& fieldset": { borderColor: accent, borderWidth: 1.5 },
                      "&:hover fieldset": { borderColor: accent },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={saveParticipants}
                  // Nothing to save until the number actually differs, which
                  // also makes the button the answer to "did that record?".
                  disabled={savingParticipants || !participantsChanged}
                  sx={{
                    bgcolor: accent, borderRadius: 2.5, height: 52, px: 3,
                    textTransform: "none", fontWeight: 700, whiteSpace: "nowrap",
                    // Brightness rather than a second fixed colour, so the
                    // hover follows whatever accent the author chose.
                    boxShadow: "none",
                    "&:hover": { bgcolor: accent, filter: "brightness(1.1)", boxShadow: "none" },
                  }}
                >
                  {savingParticipants
                    ? lang === "es"
                      ? "Guardando…"
                      : "Saving…"
                    : participantsSaved
                      ? lang === "es"
                        ? "Guardado ✓"
                        : "Saved ✓"
                      : lang === "es"
                        ? "Guardar"
                        : "Save"}
                </Button>
              </Box>
            </Box>
          )}

          {pick(session.presentation?.body) && (
            <Section icon={<GroupsOutlinedIcon />} title={lang === "es" ? "Presentación de los participantes" : "Participant introductions"} accent={accent}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr .85fr" }, gap: { xs: 2.5, md: 4 }, ml: { md: 8.25 } }}>
                <Box>
                  <Typography sx={{ lineHeight: 1.65, fontSize: 14 }}>{pick(session.presentation.body)}</Typography>
                  {pick(session.presentation.reminder) && (
                    <Box sx={{ mt: 3, p: 1.7, bgcolor: `color-mix(in srgb, ${accent} 12%, #fff)`, border: "1px solid rgba(118,80,179,.14)", borderRadius: 2, display: "flex", gap: 1.4, alignItems: "center" }}>
                      <ShieldOutlinedIcon sx={{ color: accent }} />
                      <Typography sx={{ fontSize: 13.5 }}>
                        <Box component="strong">{lang === "es" ? "Recordatorio: " : "Reminder: "}</Box>
                        {pick(session.presentation.reminder)}
                      </Typography>
                    </Box>
                  )}
                </Box>
                {(session.presentation.prompts ?? []).filter((q) => pick(q)).length > 0 && (
                  <Box sx={{ bgcolor: `color-mix(in srgb, ${accent} 10%, #fff)`, borderRadius: 2.5, p: 2.25, mt: { md: -8.25 }, alignSelf: "start" }}>
                    <Typography sx={{ fontFamily: SERIF, fontSize: 20, mb: 1.75 }}>
                      {lang === "es" ? "Preguntas sugeridas para el grupo" : "Suggested group questions"}
                    </Typography>
                    {session.presentation.prompts.filter((q) => pick(q)).map((q, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.2, bgcolor: "white", borderRadius: 2, p: 1.6, mb: 1.2 }}>
                        <Typography sx={{ color: accent, fontFamily: TITLE_FONT, fontSize: 22, lineHeight: 1 }}>“</Typography>
                        <Typography sx={{ fontSize: 13.5, lineHeight: 1.5 }}>{pick(q)}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Section>
          )}

          {objectives.length > 0 && (
            <Section icon={<TrackChangesOutlinedIcon />} title={lang === "es" ? "Objetivos de la sesión" : "Session objectives"} accent={accent}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  columnGap: 7,
                  rowGap: 1.7,
                  ml: { md: 7.25 },
                  "& > div:nth-of-type(n+4)": { pl: { md: 4 }, borderLeft: { md: "1px solid rgba(73,50,139,.14)" } },
                }}
              >
                {objectives.map((o, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <CheckCircleOutlineRoundedIcon sx={{ color: accent, fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 13.5 }}>{pick(o.title)}</Typography>
                  </Box>
                ))}
              </Box>
            </Section>
          )}

          {psychoedItems.length > 0 && (
            <Section
              icon={<MenuBookOutlinedIcon />}
              title={lang === "es" ? "Psicoeducación" : "Psychoeducation"}
              subtitle={pick(psychoed?.intro) || undefined}
              accent={accent}
            >
              {prosePsychoeducation ? (
                <Box sx={{ ml: { md: 8.25 } }}>{proseParagraphs(psychoedSource?.items ?? [])}</Box>
              ) : (
                /* The first headed run, as a row of icon tiles — Session 1's shape. */
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: `repeat(${Math.max(psychoedItems.length, 1)},1fr)` },
                    ml: { md: 2.5 },
                    alignItems: "stretch",
                  }}
                >
                  {psychoedItems.map((item, i) => (
                    <Box
                      key={i}
                      sx={{
                        textAlign: "center", px: 2, py: 1.5, minHeight: 165,
                        display: "flex", flexDirection: "column", alignItems: "center",
                        borderRight: { md: i < psychoedItems.length - 1 ? "1px solid rgba(73,50,139,.14)" : 0 },
                      }}
                    >
                      <Box sx={{ minHeight: 58, mb: 1.25, color: accent, display: "grid", placeItems: "center", "& svg": { fontSize: 42, strokeWidth: 0.75 } }}>
                        {psychoeducationOverviewIcon(i)}
                      </Box>
                      <Typography sx={{ fontSize: 12, lineHeight: 1.4, maxWidth: 210 }}>{pick(item.title)}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Section>
          )}
        </>
      );
    }

    if (active === "closing") {
      // Four cards, as the hardcoded closing page lays them out — not a
      // Section panel, so this tab deliberately skips the shared wrapper.
      const card = {
        bgcolor: "rgba(255,255,255,.76)",
        border: "1px solid rgba(69,45,143,.15)",
        borderRadius: 3,
      };
      const feedback = (session.feedback ?? []).filter((f) => pick(f));
      return (
        <Box sx={{ display: "grid", gap: 2, minWidth: 0 }}>
          {pick(session.closing) && (
            <Box sx={{ ...card, p: { xs: 2.5, md: 4 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <FavoriteBorderRoundedIcon sx={{ color: accent, fontSize: 42 }} />
                <Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: 25, md: 29 }, lineHeight: 1.1, color: INK }}>
                  {lang === "es" ? "Cierre psicoeducativo" : "Psychoeducational closing"}
                </Typography>
              </Box>
              <Typography sx={{ mt: 2.5, fontSize: { xs: 15, md: 17 }, lineHeight: 1.75 }}>{pick(session.closing)}</Typography>
            </Box>
          )}

          {feedback.length > 0 && (
            <Box sx={{ ...card, p: { xs: 2.5, md: 4 } }}>
              <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 25, md: 29 }, lineHeight: 1.1, color: INK, mb: 2.5 }}>
                {lang === "es" ? "Feedback y cierre en una nota positiva" : "Feedback and closing on a positive note"}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2 }}>
                {feedback.map((f, i) => (
                  <Box key={i} sx={{ minHeight: 115, display: "flex", alignItems: "center", gap: 1.5, bgcolor: `color-mix(in srgb, ${accent} 10%, #fff)`, borderRadius: 3, p: 2.5 }}>
                    <FormatQuoteRoundedIcon sx={{ color: accent }} />
                    <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 19, md: 22 }, lineHeight: 1.35 }}>{pick(f)}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {(pick(session.therapeuticApproach) || pick(session.clinicalReference)) && (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: ".85fr 1.15fr" }, gap: 2 }}>
              {pick(session.therapeuticApproach) && (
                <Box sx={{ ...card, p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <SpaOutlinedIcon sx={{ color: accent, fontSize: 36 }} />
                    <Typography sx={{ fontFamily: SERIF, fontSize: 26 }}>
                      {lang === "es" ? "Enfoque terapéutico" : "Therapeutic approach"}
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 1.5, lineHeight: 1.65, fontStyle: "italic" }}>{pick(session.therapeuticApproach)}</Typography>
                </Box>
              )}
              {pick(session.clinicalReference) && (
                <Box sx={{ ...card, p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <MenuBookOutlinedIcon sx={{ color: accent, fontSize: 36 }} />
                    <Typography sx={{ fontFamily: SERIF, fontSize: 26 }}>
                      {lang === "es" ? "Referencia clínica" : "Clinical reference"}
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 1.5, lineHeight: 1.65, fontStyle: "italic" }}>{pick(session.clinicalReference)}</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      );
    }

    const TabIcon = tab.icon;

    // Psychoeducation puts its headed runs side by side: the first as titled
    // cards, the rest as a tinted list panel.
    if (active === "psychoeducation") {
      const data = session.sections?.psychoeducation;
      const [first, ...rest] = data?.groups ?? [];
      return (
        <Section icon={<TabIcon />} title={label} subtitle={pick(data?.intro) || undefined} accent={accent}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.1fr .9fr" }, gap: 2.5, alignItems: "start" }}>
            {first && (
              <Box
                sx={{
                  border: "1px solid rgba(69,45,143,.14)",
                  borderRadius: 3,
                  p: 2.5,
                  // Paragraphs take the full width — prose set in a narrow
                  // column reads as a stack of fragments.
                  gridColumn: hasProse(first) ? { lg: "1 / -1" } : undefined,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
                  <Box sx={{ width: 42, height: 42, borderRadius: "50%", bgcolor: accent, color: "white", display: "grid", placeItems: "center" }}>
                    <LightbulbOutlinedIcon />
                  </Box>
                  <Typography sx={{ fontFamily: SERIF, fontSize: 25, color: accent }}>{pick(first.heading)}</Typography>
                </Box>
                {pick(first.intro) && (
                  <Typography sx={{ fontSize: 14, lineHeight: 1.6, mb: 1.5, color: "#5b5680" }}>
                    {pick(first.intro)}
                  </Typography>
                )}
                {runsOf(first).map((run, ri) => run.prose ? (
                  <Box key={ri} sx={{ mb: 1.5 }}>{proseRun(run.items, ri === 0)}</Box>
                ) : (
                  <Box key={ri} sx={{ display: "grid", gap: 1.2 }}>
                    {run.items.map((item, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.5, p: 1.7, bgcolor: "rgba(255,255,255,.86)", border: "1px solid rgba(69,45,143,.11)", borderRadius: 2.5 }}>
                        <Box sx={{ width: 46, height: 46, flexShrink: 0, borderRadius: "50%", bgcolor: `color-mix(in srgb, ${accent} 12%, #fff)`, color: accent, display: "grid", placeItems: "center", "& svg": { fontSize: 24 } }}>
                          {iconFor(item.icon, i)}
                        </Box>
                        <Box>
                          <Typography sx={{ color: accent, fontSize: 15.5, fontWeight: 800, lineHeight: 1.3 }}>{pick(item.title)}</Typography>
                          {pick(item.body) && <Typography sx={{ fontSize: 13.5, lineHeight: 1.5, mt: 0.4 }}>{pick(item.body)}</Typography>}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            )}
            {rest.map((group, gi) => (
              <Box
                key={gi}
                sx={{
                  bgcolor: `color-mix(in srgb, ${accent} 8%, #fff)`,
                  border: "1px solid rgba(69,45,143,.12)",
                  borderRadius: 3,
                  p: 2.5,
                  gridColumn: hasProse(group) ? { lg: "1 / -1" } : undefined,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
                  <Diversity3OutlinedIcon sx={{ color: accent, fontSize: 34 }} />
                  <Typography sx={{ fontFamily: SERIF, fontSize: 23, color: accent }}>{pick(group.heading)}</Typography>
                </Box>
                {pick(group.intro) && (
                  <Typography sx={{ fontSize: 14, lineHeight: 1.6, mb: 1.5, color: "#5b5680" }}>
                    {pick(group.intro)}
                  </Typography>
                )}
                {runsOf(group).map((run, ri) => run.prose ? (
                  <Box key={ri} sx={{ mb: 1.5 }}>{proseRun(run.items, ri === 0)}</Box>
                ) : (
                  <Box key={ri} sx={{ display: "grid", gap: 1.2 }}>
                    {run.items.map((item, i) => (
                      <Box key={i} sx={{ minHeight: 68, display: "flex", alignItems: "center", gap: 1.5, bgcolor: "rgba(255,255,255,.9)", borderRadius: 2.5, p: 1.5 }}>
                        <Box sx={{ color: accent, display: "flex", "& svg": { fontSize: 24 } }}>{iconFor(item.icon, i)}</Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{pick(item.title)}</Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Section>
      );
    }

    // Processing is a grid of quote cards on the hardcoded pages, not the
    // numbered rows the other sections use.
    if (active === "processing") {
      const data = session.sections?.processing;
      const questions = (data?.groups ?? []).flatMap((g) => g.items);
      return (
        <Section icon={<TabIcon />} title={label} subtitle={pick(data?.intro) || undefined} accent={accent}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 1.5 }}>
            {questions.map((q, i) => (
              <Box
                key={i}
                sx={{
                  ...sectionCard,
                  minHeight: 125,
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: i % 2 ? `color-mix(in srgb, ${accent} 7%, #fff)` : `color-mix(in srgb, ${accent} 8%, #fff)`,
                }}
              >
                <FormatQuoteRoundedIcon sx={{ color: accent }} />
                <Typography sx={{ fontSize: 17 }}>{pick(q.title)}</Typography>
              </Box>
            ))}
            {/* Page furniture: the same tip on every curriculum. */}
            <Box
              sx={{
                gridColumn: "1 / -1", width: "100%", p: 2.5,
                border: "1px solid rgba(101,64,178,.18)", borderRadius: 3,
                bgcolor: `color-mix(in srgb, ${accent} 10%, #fff)`, boxShadow: "0 8px 22px rgba(67,45,126,.06)",
                "& .MuiTypography-root": { fontWeight: 700 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ width: 52, height: 52, flexShrink: 0, borderRadius: "50%", bgcolor: `color-mix(in srgb, ${accent} 12%, #fff)`, color: accent, display: "grid", placeItems: "center" }}>
                  <LightbulbOutlinedIcon sx={{ fontSize: 31 }} />
                </Box>
                <Box>
                  <Typography sx={{ color: accent, fontSize: 12, fontWeight: 800, letterSpacing: 0.6 }}>{FIXED.cohesion.quickTip[lang]}</Typography>
                  <Typography sx={{ color: accent, fontSize: 20, fontWeight: 800 }}>{FIXED.cohesion.title[lang]}</Typography>
                </Box>
              </Box>
              <Typography sx={{ mt: 1.5, fontSize: 13, lineHeight: 1.55 }}>{FIXED.cohesion.source[lang]}</Typography>
              <Box sx={{ display: "flex", gap: 1.25, mt: 2, pt: 2, borderTop: "1px solid rgba(101,64,178,.16)" }}>
                <GroupsOutlinedIcon sx={{ color: accent, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 13, lineHeight: 1.55 }}>{FIXED.cohesion.body[lang]}</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.25, mt: 2, p: 1.75, bgcolor: "rgba(238,231,250,.72)", borderRadius: 2 }}>
                <SpaOutlinedIcon sx={{ color: accent, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 13, lineHeight: 1.55 }}>
                  <Box component="strong" sx={{ color: accent }}>{FIXED.cohesion.reminderLabel[lang]}</Box>
                  {FIXED.cohesion.reminder[lang]}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Section>
      );
    }

    return (
      <>
        <Section icon={<TabIcon />} title={label} accent={accent}>
          {renderSection(active)}
        </Section>
        {/* Page furniture: identical on every curriculum, so it is not stored. */}
        {active === "intervention" && (
          <Box sx={{ p: { xs: 2.5, md: 3 }, mt: 1.8, bgcolor: "rgba(255,255,255,.88)", border: "1px solid rgba(69,45,143,.14)", borderRadius: 3 }}>
            <Typography sx={{ fontSize: 17, lineHeight: 1.7 }}>
              {FIXED.interventionNote[lang].map((run, i) =>
                i % 2 ? <Box component="strong" key={i}>{run}</Box> : <React.Fragment key={i}>{run}</React.Fragment>,
              )}
            </Typography>
          </Box>
        )}
      </>
    );
  };

  const step = TABS.findIndex((t) => t.id === active) + 1;

  // Neighbours by session number, so the footer can walk the curriculum.
  const ordered = [...(curriculum.sessions ?? [])].sort((a, b) => a.number - b.number);
  const here = ordered.findIndex((s2) => s2.number === session.number);
  const previousSession = here > 0 ? ordered[here - 1] : null;
  const nextSession = here >= 0 && here < ordered.length - 1 ? ordered[here + 1] : null;

  return (
    <Box
      data-curriculum-session={`${slug}/${session.number}/${active}`}
      sx={{
        minHeight: "100dvh",
        color: INK,
        bgcolor: "#f4f0fa",
        backgroundImage:
          "radial-gradient(circle at 12% 55%,rgba(136,94,193,.08),transparent 32%),radial-gradient(circle at 88% 70%,rgba(136,94,193,.07),transparent 30%)",
      }}
    >
      {/* Says whose curriculum this is when it was opened from a group, so the
          reader is never unsure which group they are recording against. */}
      {/* Group only. Read from Mission the page keeps the site header, with its
          pillar navigation; read as a group's own curriculum it gets a header
          carrying just the brand, the dashboard and the language. */}
      {groupId && <CurriculumHeader />}

      {groupId && (
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            py: 1, px: { xs: 1.5, md: 2.5 },
            bgcolor: accent, color: "white",
          }}
        >
          {/* A real button rather than a clickable strip: this is the way out
              of the curriculum, so it has to look like something you press. */}
          <Box
            component="button"
            type="button"
            onClick={() => navigate("/groups")}
            sx={{
              appearance: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 0.75,
              px: 1.5, py: 0.6, borderRadius: 99,
              border: "1px solid rgba(255,255,255,.55)",
              bgcolor: "rgba(255,255,255,.12)", color: "inherit",
              fontSize: 12.5, fontWeight: 700, fontFamily: "inherit",
              flexShrink: 0,
              "&:hover": { bgcolor: "rgba(255,255,255,.24)" },
            }}
          >
            <ArrowBackRoundedIcon sx={{ fontSize: 17 }} />
            {lang === "es" ? "Volver a grupos" : "Back to groups"}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
            <GroupsRoundedIcon sx={{ fontSize: 18, opacity: 0.9, flexShrink: 0 }} />
            <Box
              component="span"
              sx={{ fontSize: 13.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {group?.name?.[lang] ||
                group?.name?.en ||
                group?.name?.es ||
                (lang === "es" ? "Grupo" : "Group")}
            </Box>
          </Box>
        </Box>
      )}

      <Box
        component="header"
        sx={{
          position: "relative", overflow: "hidden", color: "white", textAlign: "center",
          background: headerBackground,
          pb: { xs: 9, md: 10.5 },
          "&::after": {
            content: '""', position: "absolute", left: "-5%", right: "-5%", bottom: -45,
            height: 80, bgcolor: "#f4f0fa", borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          },
        }}
      >
        <Container maxWidth="xl" sx={{ pt: 2.25, position: "relative", zIndex: 1 }}>
          <Box sx={{ maxWidth: 780, mx: "auto", pt: { xs: 6, md: 4.5 } }}>
            <Box sx={{ display: "inline-block", bgcolor: accent, px: 3.2, py: 0.8, borderRadius: 99, fontSize: 15, fontWeight: 800, letterSpacing: 1.2 }}>
              {sessionLabel}
            </Box>
            <Typography component="h1" sx={{ fontFamily: TITLE_FONT, fontSize: { xs: 46, sm: 61, md: 68 }, fontWeight: 500, lineHeight: 0.98, mt: 2.25 }}>
              {pick(session.title)}
            </Typography>
            <Box sx={{ width: 42, borderTop: "1px solid rgba(255,255,255,.9)", mx: "auto", my: 2.5 }} />
            {topics && (
              <>
                <Typography sx={{ fontSize: 11, letterSpacing: 1.3, color: "#c9b8e6" }}>
                  {lang === "es" ? "TEMA PRINCIPAL" : "MAIN TOPIC"}
                </Typography>
                <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 18, md: 21 }, mt: 0.8 }}>{topics}</Typography>
              </>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: { xs: -3, md: -4 }, pb: 4, position: "relative", zIndex: 2 }}>
        <Box
          component="nav"
          ref={tabsRef}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(4,1fr)", md: "repeat(7,1fr)" },
            overflow: "hidden", bgcolor: "#fff", borderRadius: 3, boxShadow: "0 8px 22px rgba(55,35,115,.08)", mb: 1.5,
          }}
        >
          {TABS.map(({ id, icon: Icon, en, es }) => {
            const selected = id === active;
            return (
              <Box
                key={id}
                component="button"
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => navigate(`${base}/session/${session.number}/${id}`)}
                sx={{
                  appearance: "none", border: 0,
                  borderBottom: selected ? `4px solid ${accent}` : "4px solid transparent",
                  bgcolor: "transparent", color: selected ? accent : "#211866",
                  textAlign: "center", py: 1.5, px: 0.5, cursor: "pointer",
                  "&:hover": { color: accent },
                }}
              >
                <Icon sx={{ fontSize: 29 }} />
                <Typography sx={{ fontSize: 10, fontWeight: 800, mt: 0.35 }}>
                  {(lang === "es" ? es : en).toUpperCase()}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ bgcolor: "#fff", borderRadius: 3, py: 1.25, px: 2, mb: 2.5, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 1, boxShadow: "0 8px 22px rgba(55,35,115,.06)" }}>
          {/* Opposite Continue. The way out lives at the top of the session
              rail, not here — two of them a few pixels apart read as one
              control repeated. */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifySelf: "start", minWidth: 0 }}>
            {step > 1 && (
              <Box
                component="button"
                type="button"
                onClick={() => navigate(`${base}/session/${session.number}/${TABS[step - 2].id}`)}
                sx={{
                  // Mirrors Continue on the other side of the row.
                  appearance: "none", border: 0, cursor: "pointer",
                  bgcolor: accent, color: "white", borderRadius: 99, px: 2.5, py: 1,
                  fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 0.75,
                  "&:hover": { filter: "brightness(1.1)" },
                }}
              >
                <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
                {lang === "es" ? "Anterior" : "Previous"}
              </Box>
            )}
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: 1.1 }}>
              {(lang === "es" ? `PASO ${step} DE 7` : `STEP ${step} OF 7`)}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
              {lang === "es" ? TABS[step - 1].es : TABS[step - 1].en}
            </Typography>
          </Box>
          <Box sx={{ justifySelf: "end" }}>
            {step < TABS.length && (
              <Box
                component="button"
                type="button"
                onClick={() => navigate(`${base}/session/${session.number}/${TABS[step].id}`)}
                sx={{
                  appearance: "none", border: 0, cursor: "pointer",
                  bgcolor: accent, color: "white", borderRadius: 99, px: 2.5, py: 1,
                  fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 0.75,
                  "&:hover": { filter: "brightness(1.1)" },
                }}
              >
                {lang === "es" ? "Continuar" : "Continue"}
                <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "275px minmax(0,1fr)", lg: "505px minmax(0,1fr)" }, gap: 2, alignItems: "stretch" }}>
          {/* The session rail and the session card share one grid column, so
              they sit side by side on a wide screen and stack on a narrow one
              without the main panel ever wrapping under them. */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 2, alignItems: "stretch" }}>
            <Box
              component="nav"
              aria-label={lang === "es" ? "Sesiones del currículo" : "Curriculum sessions"}
              sx={{
                width: { xs: "100%", lg: 214 }, flexShrink: 0,
                bgcolor: "#fff", borderRadius: 3, p: 1.25,
                boxShadow: "0 8px 22px rgba(55,35,115,.07)",
                alignSelf: "flex-start",
                // Follows the reader down a long session.
                position: { lg: "sticky" }, top: { lg: 16 },
              }}
            >
              {/* The rail is where a reader already looks to move around, so
                  the way out belongs at the top of it. */}
              <Box
                component="button"
                type="button"
                onClick={() => navigate(groupId ? "/groups" : "/mission")}
                sx={{
                  appearance: "none", border: 0, cursor: "pointer", width: "100%",
                  display: "flex", alignItems: "center", gap: 0.75,
                  px: 1.25, py: 1, mb: 0.5, borderRadius: 2.5,
                  bgcolor: "transparent", color: accent,
                  fontSize: 12.5, fontWeight: 700, fontFamily: "inherit",
                  "&:hover": { bgcolor: `color-mix(in srgb, ${accent} 6%, #fff)` },
                }}
              >
                <ArrowBackRoundedIcon sx={{ fontSize: 17 }} />
                {groupId
                  ? lang === "es"
                    ? "Volver a grupos"
                    : "Back to groups"
                  : lang === "es"
                    ? "Todos los currículos"
                    : "All curriculums"}
              </Box>

              <Box sx={{ borderTop: "1px solid rgba(80,54,150,.12)", mx: 1.25, mb: 0.75 }} />

              <Typography
                sx={{
                  fontSize: 10.5, fontWeight: 800, letterSpacing: 1.1, color: "#7d7899",
                  px: 1.25, pb: 1,
                }}
              >
                {lang === "es" ? "SESIONES" : "SESSIONS"}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {ordered.map((s) => {
                  const current = s.number === session.number;
                  return (
                    <Box
                      key={s.number}
                      component="button"
                      type="button"
                      // Always the introduction. Carrying the current step
                      // across would drop the reader into the middle of a
                      // session they have not started.
                      onClick={() => navigate(`${base}/session/${s.number}/introduction`)}
                      sx={{
                        appearance: "none", border: 0, cursor: "pointer", textAlign: "left",
                        display: "flex", alignItems: "center", gap: 1.25,
                        p: 1, borderRadius: 2.5,
                        bgcolor: current ? `color-mix(in srgb, ${accent} 12%, #fff)` : "transparent",
                        transition: "background-color .15s",
                        "&:hover": { bgcolor: current ? `color-mix(in srgb, ${accent} 12%, #fff)` : `color-mix(in srgb, ${accent} 6%, #fff)` },
                      }}
                    >
                      <Box
                        sx={{
                          width: 28, height: 28, flexShrink: 0, borderRadius: "50%",
                          display: "grid", placeItems: "center",
                          fontFamily: TITLE_FONT, fontSize: 15, fontWeight: 700,
                          bgcolor: current ? accent : `color-mix(in srgb, ${accent} 10%, #fff)`,
                          color: current ? "#fff" : accent,
                        }}
                      >
                        {s.number}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: 12.5, lineHeight: 1.3,
                          fontWeight: current ? 800 : 600,
                          color: current ? INK : "#4a4570",
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {pick(s.title)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Box
              component="aside"
              sx={{
                position: "relative", overflow: "hidden", minHeight: { xs: 390, md: 0 }, height: "100%",
                flex: 1, minWidth: 0,
                borderRadius: 3, p: 3, textAlign: "center",
                backgroundImage: "linear-gradient(rgba(255,246,250,.77),rgba(231,222,248,.72)),url('/pillars/mission-bg.jpg')",
                backgroundSize: "cover", backgroundPosition: "center",
              }}
            >
            <Box sx={{ bgcolor: accent, color: "white", borderRadius: 2, py: 1, fontWeight: 800, fontSize: 20 }}>
              {sessionLabel}
            </Box>
            <Typography sx={{ fontFamily: TITLE_FONT, fontSize: 34, lineHeight: 1.2, mt: 3 }}>{pick(session.title)}</Typography>
            <Box sx={{ borderTop: "1px solid rgba(80,54,150,.2)", my: 3 }} />
            {topics && (
              <>
                <Typography sx={{ color: accent, fontSize: 11, fontWeight: 800 }}>
                  {lang === "es" ? "TEMA PRINCIPAL" : "MAIN TOPIC"}
                </Typography>
                <Typography sx={{ fontWeight: 700, lineHeight: 1.5, mt: 1 }}>{topics}</Typography>
              </>
            )}
            {/* The applications list belongs to the Introduction only — the other
                tabs carry their own content and shouldn't repeat it. */}
            {active === "introduction" && (
              <Box sx={{ bgcolor: "rgba(255,255,255,.66)", borderRadius: 3, p: 2.25, mt: 4, textAlign: "left" }}>
                <Typography sx={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: accent, mb: 1.25 }}>
                  {lang === "es" ? "¿Cómo los aplicaremos?" : "How will we apply them?"}
                </Typography>
                {APPLICATIONS.map(({ icon: Icon, en, es }) => (
                  <Box key={en} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.75 }}>
                    <Icon sx={{ color: accent, fontSize: 22, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 11.5, lineHeight: 1.35 }}>{lang === "es" ? es : en}</Typography>
                  </Box>
                ))}
              </Box>
            )}
            {active === "objectives" ? (
              /* Objectives swaps the standing aside for its own two cards,
                 the way the hardcoded objectives page lays them out. */
              <>
                <Box sx={{ bgcolor: "rgba(255,255,255,.72)", borderRadius: 3, p: 2, mt: 3, textAlign: "left" }}>
                  <TrackChangesOutlinedIcon sx={{ color: accent, fontSize: 31 }} />
                  <Typography sx={{ fontFamily: SERIF, color: accent, fontSize: 19, fontWeight: 600, mt: 0.5 }}>
                    {FIXED.objectivesWhy.title[lang]}
                  </Typography>
                  <Typography sx={{ mt: 0.7, fontSize: 12, lineHeight: 1.5 }}>
                    {FIXED.objectivesWhy.body[lang]}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: `color-mix(in srgb, ${accent} 8%, #fff)`, borderLeft: `4px solid ${accent}`, borderRadius: 3, p: 2, mt: 2, textAlign: "left" }}>
                  <StarBorderRoundedIcon sx={{ color: accent, fontSize: 30 }} />
                  <Typography sx={{ fontFamily: SERIF, color: accent, fontSize: 19, fontWeight: 600 }}>
                    {FIXED.objectivesReminder.title[lang]}
                  </Typography>
                  <Typography sx={{ mt: 0.7, fontSize: 11.5, lineHeight: 1.45 }}>
                    {FIXED.objectivesReminder.body[lang]}
                  </Typography>
                </Box>
              </>
            ) : (
              /* Without the applications box above, this takes over its top margin. */
              <Box sx={{ bgcolor: "rgba(255,255,255,.66)", borderRadius: 3, p: 2.5, mt: active === "introduction" ? 2 : 4 }}>
                <FavoriteBorderRoundedIcon sx={{ color: accent, fontSize: 38 }} />
                <Typography sx={{ fontWeight: 700, lineHeight: 1.55, mt: 1 }}>{FIXED.aside[lang]}</Typography>
              </Box>
            )}
            </Box>
          </Box>

          <Box component="main" sx={{ bgcolor: PAPER, border: "1px solid rgba(69,45,143,.15)", borderRadius: 3, p: { xs: 2.5, md: 4 } }}>
            {body()}
          </Box>
        </Box>
      </Container>

      {/* Session-to-session navigation, styled exactly as Session 1's footer.
          Shown on every step: a session must never be a place you can reach
          and not leave, and every session carries the same furniture. */}
      <Box sx={{ mt: 0.75, py: 2.5, textAlign: "center", bgcolor: "rgba(232,222,247,.8)", borderTop: "1px solid rgba(73,50,139,.08)" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 1.5 }}>
          {previousSession && (
            <Button
              onClick={() => navigate(`${base}/session/${previousSession.number}`)}
              variant="contained"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                minWidth: 300, minHeight: 54, px: 3.5, bgcolor: accent, borderRadius: 99,
                fontSize: 16, fontWeight: 500, boxShadow: "0 5px 12px rgba(57,36,118,.28)",
                "&:hover": { bgcolor: accent, filter: "brightness(.9)" },
              }}
            >
              {lang === "es" ? `VOLVER A SESIÓN ${previousSession.number}` : `BACK TO SESSION ${previousSession.number}`}
            </Button>
          )}
          {/* In a group this leads back to the group. It must not point at
              /groups/:id/c/:slug — that entry redirects to session one, so
              from session three it would quietly send the reader backwards. */}
          <Button
            onClick={() => navigate(groupId ? "/groups" : "/mission")}
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              minWidth: 300, minHeight: 54, px: 3.5, borderWidth: 1.5, color: INK,
              borderColor: accent, borderRadius: 99, fontSize: 16, fontWeight: 500,
            }}
          >
            {groupId
              ? lang === "es"
                ? "VOLVER A GRUPOS"
                : "BACK TO GROUPS"
              : lang === "es"
                ? "VOLVER A CURRÍCULOS"
                : "BACK TO CURRICULUMS"}
          </Button>
          {nextSession && (
            <Button
              onClick={() => navigate(`${base}/session/${nextSession.number}`)}
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                minWidth: 300, minHeight: 54, px: 3.5, bgcolor: accent, borderRadius: 99,
                fontSize: 16, fontWeight: 500, boxShadow: "0 5px 12px rgba(57,36,118,.28)",
                "&:hover": { bgcolor: accent, filter: "brightness(.9)" },
              }}
            >
              {lang === "es" ? `CONTINUAR A SESIÓN ${nextSession.number}` : `CONTINUE TO SESSION ${nextSession.number}`}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CurriculumSessionPage;
