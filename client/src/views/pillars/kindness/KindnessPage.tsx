import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography } from "@mui/material";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { kindnessData } from "./kindness-data";
import { AppDispatch, getCoqui } from "../../../store/store";
import { loadCoquiAggregates } from "../../../store/slices/coqui";
import CoquiShell from "./CoquiShell";
import GeoMap from "./GeoMap";
import { VENEZUELA_SHAPES, VENEZUELA_VIEWBOX, WORLD_SHAPES, WORLD_VIEWBOX } from "./map-paths";
import {
  AFTER,
  BEFORE,
  BORDER,
  DonutChart,
  FindingCard,
  HBarChart,
  INK,
  LegendList,
  MUTED,
  NeedsSource,
  NoData,
  PAGE,
  Panel,
  SectionHeading,
  SectionLabel,
  StatCard,
  SUB,
  TILE,
  VBarChart,
  WARNING,
  WordCloud,
} from "./components";

/**
 * A tile in the overview / key-findings grid whose number has no question
 * behind it. Same footprint as <StatCard>/<FindingCard>, so an unsourced tile
 * holds the grid instead of collapsing it.
 */
const UnlinkedStat: React.FC<{ label: string; needs: string; icon?: ReactNode }> = ({ label, needs, icon }) => (
  <Box sx={{ bgcolor: TILE, border: `1px solid ${BORDER}`, borderRadius: 2, px: 1.75, py: 1.5, display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
    {icon && <Box sx={{ color: BEFORE, display: "flex", flexShrink: 0, opacity: 0.45, "& svg": { fontSize: 30 } }}>{icon}</Box>}
    <Box sx={{ minWidth: 0, flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.75, alignItems: "flex-start" }}>
      <NeedsSource needs={needs} compact />
      <Typography sx={{ color: SUB, fontSize: 11.5, lineHeight: 1.35 }}>{label}</Typography>
    </Box>
  </Box>
);

/** Caption for a panel that renders real data but is missing some options. */
const GapNote: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Typography sx={{ color: WARNING, fontSize: 10.5, lineHeight: 1.45, mt: 1.25, opacity: 0.85 }}>
    {children}
  </Typography>
);

/** A stacked list of verbatim survey quotes. */
const Quotes: React.FC<{ items: string[] }> = ({ items }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
    {items.map((q, i) => (
      <Box key={i} sx={{ display: "flex", gap: 0.75, alignItems: "flex-start" }}>
        <FormatQuoteRoundedIcon sx={{ color: BEFORE, fontSize: 15, flexShrink: 0, mt: 0.2, transform: "scaleX(-1)" }} />
        <Typography sx={{ color: SUB, fontSize: 11.5, fontStyle: "italic", lineHeight: 1.5 }}>{q}</Typography>
      </Box>
    ))}
  </Box>
);

/** A sub-panel inside the BEFORE / AFTER groups. */
const SubPanel: React.FC<{ title: string; note?: string; children: ReactNode }> = ({ title, note, children }) => (
  <Box sx={{ bgcolor: TILE, border: `1px solid ${BORDER}`, borderRadius: 2, p: 1.75, minWidth: 0, display: "flex", flexDirection: "column" }}>
    <Typography sx={{ color: INK, fontSize: 12.5, fontWeight: 700, lineHeight: 1.3 }}>{title}</Typography>
    {note && <Typography sx={{ color: MUTED, fontSize: 10, lineHeight: 1.4, mt: 0.5 }}>{note}</Typography>}
    <Box sx={{ mt: 1.5, flexGrow: 1 }}>{children}</Box>
  </Box>
);

const SCALE_NOTE = "How would you rate your current emotional or nervous system state? (0 = very calm, 10 = very activated)";

/** Coquí Research Data dashboard (under Mission → Review Data). */
const KindnessPage: React.FC = () => {
  const d = kindnessData;
  const dispatch = useDispatch<AppDispatch>();
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || "en").startsWith("es") ? "es" : "en";
  const { data: agg, loaded, error } = useSelector(getCoqui);

  // Fetch aggregates into the Redux store on mount (and whenever the UI
  // language changes). Because the data lives in the store (not component-local
  // state), a StrictMode remount or client-side navigation never drops it, and
  // the persisted slice rehydrates the last numbers instantly on a full page
  // refresh. Passing `lang` lets the server order survey quotes so the current
  // language's responses come first.
  useEffect(() => {
    dispatch(loadCoquiAggregates(lang));
  }, [dispatch, lang]);

  // "Offline" = we've finished a fetch attempt that failed, and have nothing
  // cached to fall back on. While loading, or with persisted data present, we
  // show the numbers rather than an error banner.
  const offline = !!error && !agg;
  const status = error || (loaded ? "live" : "loading");

  const activationBuckets = agg?.activationBuckets ?? [];
  const timeSince = agg?.timeSinceBuckets ?? [];
  const emotionalBefore = agg?.topFeelings ?? [];
  const somaticAfter = agg?.topBodyResponses ?? [];
  const soundFelt = agg?.soundFelt ?? [];
  const originalLoc = agg?.originalLocations ?? [];
  const currentLoc = agg?.currentLocations ?? [];
  const quotes: string[] = agg?.quotes ?? [];
  const insideQuotes: string[] = agg?.insideQuotes ?? [];
  const agreeHow: string[] = agg?.agreeHow ?? [];
  const wishHearNotes: string[] = agg?.wishHearNotes ?? [];

  // Donut segments. Colour follows the entity, and every legend row carries a
  // written label, so identity never rests on hue.
  const shiftPct = agg?.shiftRate ?? 0;
  const shiftSegments = [
    { label: "Yes", value: shiftPct, color: AFTER },
    { label: "No", value: 100 - shiftPct, color: BEFORE },
  ];
  const inside = (agg?.insideDistribution ?? []).map((s: any, i: number) => ({
    ...s,
    color: [AFTER, BEFORE, "#5b5f8f"][i] ?? "#5b5f8f",
  }));
  const agreeDist = (agg?.agreeDistribution ?? []).map((s: any, i: number) => ({
    ...s,
    color: [AFTER, BEFORE, "#5b5f8f"][i] ?? "#5b5f8f",
  }));

  // Open-ended themes come from the five free-text questions, weighted by how
  // often each word appears across them.
  const cloud = agg?.openEndedWordCloud ?? [];
  const themeWords = cloud.length
    ? cloud.map((x: any) => ({ word: String(x.label), weight: Math.max(0.35, x.value / (cloud[0].value || 1)) }))
    : [];

  // The design's five headline findings, in its order. `associate` also exists
  // and is close in meaning to "recall memories" — it is surfaced further down
  // rather than here, so this row stays the five tiles the design calls for.
  const findings = [
    { pct: agg?.identityBelongingRate ?? 0, label: "Feel a part of their identity & cultural belonging" },
    { pct: agg?.shiftRate ?? 0, label: "Feel an emotional or physical link while listening" },
    { pct: agg?.imagesRate ?? 0, label: "Recall memories, emotions, or sensations" },
  ];

  const tsMax = Math.max(10, ...timeSince.map((t: any) => t.value));
  const actMax = Math.max(10, ...activationBuckets.map((t: any) => t.value));
  const aboutText =
    agg && agg.totalParticipants > 0
      ? `This dashboard represents ${agg.totalParticipants} participant${agg.totalParticipants === 1 ? "" : "s"} with a personal connection to the Coquí — ${agg.researchSubmissions} from the research study and ${agg.surveyResponses} from the live survey. Their responses reflect emotional and physiological connections to this sound.`
      : "No survey responses to display yet. As responses come in, this dashboard fills in automatically.";

  return (
    <CoquiShell activeId="data" heroTitle={d.header.title}>
      <Box sx={{ bgcolor: PAGE, p: { xs: 1.5, sm: 2.5 }, display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
        {offline && (
          <Box sx={{ bgcolor: `${WARNING}1f`, border: `1px solid ${WARNING}66`, borderRadius: 2, px: 2, py: 1.25, color: WARNING, fontSize: 13 }}>
            Live data unavailable — {status}. The dashboard shows zeros until the API responds; start the server and reload.
          </Box>
        )}

        {/* ── General overview ─────────────────────────────────────────── */}
        <Panel id="k-overview">
          <SectionLabel>General Overview</SectionLabel>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(5, 1fr)" }, gap: 1.5 }}>
            <StatCard icon={<GroupsRoundedIcon />} value={String(agg?.totalParticipants ?? 0)} label="Total Participants" />
            <StatCard icon={<PublicRoundedIcon />} value={String(agg?.countriesRepresented ?? 0)} label="Countries Represented" />
            <StatCard icon={<CalendarMonthRoundedIcon />} value={String(agg?.avgYearsLived ?? 0)} unit="years" label="Average Years of Exposure to the Coquí" />
            <UnlinkedStat
              icon={<GraphicEqRoundedIcon />}
              label="Coquí Imprinting Index Score"
              needs="No question captures this and no formula is defined. Needs a scored question, or a documented composite of identity / inside / years_lived / time_since."
            />
            <UnlinkedStat
              icon={<FavoriteRoundedIcon />}
              label="Average Desire to Hear Coquí Regularly Again"
              needs="Needs a 0–10 scale question. `wish_hear` is free text, so there is no number to average."
            />
          </Box>
        </Panel>

        {/* ── Key findings + time since exposure ───────────────────────── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            // Key Findings sits beside Time Since only once there is room for
            // all five tiles in one row; below that it takes the full width and
            // Time Since drops underneath.
            "@media (min-width:1500px)": { gridTemplateColumns: "1.9fr 1fr" },
            gap: { xs: 1.5, sm: 2 },
            alignItems: "start",
          }}
        >
          <Panel id="k-findings">
            <SectionLabel>
              Key Findings <Box component="span" sx={{ color: MUTED, fontWeight: 400, textTransform: "none" }}>(Share of Participants)</Box>
            </SectionLabel>
            <Box sx={{ overflowX: "auto", mx: -0.5, px: 0.5, pb: 0.5 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(132px, 1fr))", gap: 1.5, alignItems: "stretch" }}>
                <UnlinkedStat
                  label="Heard a coquí (sounds, landscapes, recordings)"
                  needs="Needs a Yes/No screening question — nothing records whether a participant heard the sound."
                />
                {findings.map((f, i) => (
                  <FindingCard key={i} pct={f.pct} label={f.label} />
                ))}
                <UnlinkedStat
                  label="Wish to hear the sound again more often"
                  needs="Needs `wish_hear` to become Yes/No, keeping the current textarea as its describe field."
                />
              </Box>
            </Box>
          </Panel>

          <Panel id="k-time">
            <SectionLabel>Time Since Last Exposure</SectionLabel>
            <Typography sx={{ color: INK, fontSize: 22, fontWeight: 700, lineHeight: 1, mb: 1.5 }}>
              {agg?.avgTimeSinceYears ?? 0}
              <Box component="span" sx={{ color: MUTED, fontSize: 12, fontWeight: 500 }}> years on average</Box>
            </Typography>
            {timeSince.length ? <VBarChart items={timeSince} color={AFTER} max={tsMax} /> : <NoData />}
          </Panel>
        </Box>

        {/* ── Before / after ─────────────────────────────────────────────
            Side by side only above 1900px. Each section holds three sub-panels
            with their own bar charts; splitting the row any earlier squeezes
            those bars down to a few pixels. */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", "@media (min-width:1900px)": { gridTemplateColumns: "1fr 1fr" }, gap: { xs: 1.5, sm: 2 }, alignItems: "start" }}>
          <Panel id="k-before">
            <SectionHeading title="BEFORE HEARING THE SOUND" subtitle="How Participants Felt Before Hearing the Coquí" color={BEFORE} />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr .85fr" }, gap: 1.5 }}>
              <SubPanel title="Emotional State Before" note="(Top Responses)">
                {emotionalBefore.length ? <HBarChart items={emotionalBefore} color={BEFORE} labelWidth={84} /> : <NoData />}
                <GapNote>Design also lists “Tired / Exhausted” and “Stressed” — neither is an option on `feel_now` yet.</GapNote>
              </SubPanel>

              <SubPanel title="Nervous System Rate Before" note={SCALE_NOTE}>
                {activationBuckets.length ? (
                  <>
                    <Typography sx={{ color: MUTED, fontSize: 11 }}>Average</Typography>
                    <Typography sx={{ color: BEFORE, fontSize: 32, fontWeight: 700, lineHeight: 1.1 }}>
                      {agg?.avgActivation ?? 0}
                      <Box component="span" sx={{ color: MUTED, fontSize: 14, fontWeight: 500 }}> /10</Box>
                    </Typography>
                    <Box sx={{ mt: 1.25 }}>
                      <VBarChart items={activationBuckets} color={BEFORE} max={actMax} height={92} endLabels={["Very calm", "Very activated"]} />
                    </Box>
                  </>
                ) : (
                  <NoData />
                )}
              </SubPanel>

              <SubPanel title="Did Anything Shift Emotionally or Physically During or After Listening?">
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                  <DonutChart segments={shiftSegments} size={116} thickness={22} />
                  <Box sx={{ width: "100%" }}>
                    <LegendList segments={shiftSegments} />
                  </Box>
                </Box>
              </SubPanel>
            </Box>
          </Panel>

          <Panel id="k-after">
            <SectionHeading title="AFTER HEARING THE SOUND" subtitle="How Participants Felt After Hearing the Coquí" color={AFTER} />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1.1fr" }, gap: 1.5 }}>
              <SubPanel title="Emotional State After" note="(Top Responses)">
                <NeedsSource
                  minHeight={130}
                  needs="`feel_now` is asked once, before listening. Needs a `feel_after` question including Nostalgic / Connected / Moved / Relieved / Peaceful, which are not options anywhere today."
                />
              </SubPanel>

              <SubPanel title="Nervous System Rate After" note={SCALE_NOTE}>
                <NeedsSource
                  minHeight={130}
                  needs="`activation` is asked once, before listening. Needs an `activation_after` 0–10 scale worded identically so the two are comparable."
                />
              </SubPanel>

              <SubPanel title="Emotional & Somatic Responses After Hearing the Sound" note="(Top Responses)">
                {somaticAfter.length ? <HBarChart items={somaticAfter} color={AFTER} labelWidth={96} /> : <NoData />}
                <GapNote>
                  Only “Tears / emotional release” maps cleanly. Goosebumps, Smiling / joy, Chest tightness, Warmth / comfort and Body tingling are not options on `body_during` yet.
                </GapNote>
              </SubPanel>
            </Box>
          </Panel>
        </Box>

        {/* ── Inside / reasons / wish / agree ──────────────────────────── */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", xl: "1fr 1.15fr 1fr 1.4fr" }, gap: { xs: 1.5, sm: 2 }, alignItems: "start" }}>
          <Panel id="k-inside">
            <Typography sx={{ color: BEFORE, fontSize: 13.5, fontWeight: 700, lineHeight: 1.35, mb: 1.5 }}>
              Do you feel this sound lives “inside you” in some way?
            </Typography>
            {inside.length ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <DonutChart segments={inside} size={116} thickness={22} />
                <Box sx={{ flexGrow: 1, minWidth: 110 }}>
                  <LegendList segments={inside} />
                </Box>
              </Box>
            ) : (
              <NoData />
            )}
            <Typography sx={{ color: INK, fontSize: 12, fontWeight: 700, mt: 2, mb: 1 }}>Please describe your experience.</Typography>
            {insideQuotes.length ? <Quotes items={insideQuotes} /> : <NoData minHeight={60} />}
          </Panel>

          <Panel id="k-reasons">
            <Typography sx={{ color: INK, fontSize: 12.5, fontWeight: 700, mb: 1.5 }}>
              Top Reasons (Why Participants Do / Don’t Want to Hear It More)
            </Typography>
            <NeedsSource
              minHeight={100}
              needs="These nine coded reasons have no question behind them. `wish_hear` is unstructured prose — it needs `wish_reasons_yes` (5 options) and `wish_reasons_no` (4 options) as multi-selects, or the free text has to be coded by hand."
            />
            {wishHearNotes.length > 0 && (
              <Box sx={{ mt: 1.75 }}>
                <Typography sx={{ color: INK, fontSize: 11.5, fontWeight: 700, mb: 1 }}>
                  What participants actually wrote <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(uncoded)</Box>
                </Typography>
                <Quotes items={wishHearNotes} />
              </Box>
            )}
          </Panel>

          <Panel id="k-wish">
            <Typography sx={{ color: BEFORE, fontSize: 13.5, fontWeight: 700, lineHeight: 1.35, mb: 1.5 }}>
              Do you wish you could hear this sound more regularly again? Why or why not?
            </Typography>
            <NeedsSource
              minHeight={100}
              needs="The Yes/No split has no source — `wish_hear` is a textarea. Turning it into a Yes/No question (keeping the text as its describe field) fills both this donut and the Key Findings tile."
            />
          </Panel>

          <Panel id="k-agree">
            <Typography sx={{ color: BEFORE, fontSize: 13.5, fontWeight: 700, lineHeight: 1.35, mb: 1.5 }}>
              Do you agree or disagree with this statement:{" "}
              <Box component="span" sx={{ fontStyle: "italic", fontWeight: 500 }}>
                “Can hearing the Coquí frog call again help you feel better emotionally or physically if you hear it often?”
              </Box>
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Box>
                {agreeDist.length ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center" }}>
                    <DonutChart segments={agreeDist} size={116} thickness={22} />
                    <Box sx={{ width: "100%" }}>
                      <LegendList segments={agreeDist} />
                    </Box>
                  </Box>
                ) : (
                  <NoData />
                )}
                <GapNote>
                  The design shows a third slice, “Neither agree nor disagree”. `agree` only offers Agree / Disagree — add the neutral option in Coquí Questions and it appears here automatically.
                </GapNote>
              </Box>
              <Box>
                <Typography sx={{ color: INK, fontSize: 12, fontWeight: 700, mb: 1 }}>If you agree, how?</Typography>
                {agreeHow.length ? <Quotes items={agreeHow} /> : <NoData minHeight={60} />}
              </Box>
            </Box>
          </Panel>
        </Box>

        {/* ── Locations / themes / about ───────────────────────────────── */}
        <Box id="k-location" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", xl: "repeat(4, 1fr)" }, gap: { xs: 1.5, sm: 2 } }}>
          <Panel>
            <Typography sx={{ color: BEFORE, fontSize: 13.5, fontWeight: 700, lineHeight: 1.35, mb: 0.25 }}>
              Where did you used to hear the Coquí frogs regularly?
            </Typography>
            <Typography sx={{ color: MUTED, fontSize: 10.5, mb: 1.5 }}>(Top locations)</Typography>
            {originalLoc.length ? (
              <Box sx={{ display: "grid", gridTemplateColumns: "0.75fr 1fr", gap: 1.25, alignItems: "center" }}>
                <GeoMap shapes={VENEZUELA_SHAPES} viewBox={VENEZUELA_VIEWBOX} items={originalLoc} color={BEFORE} />
                <HBarChart items={originalLoc} color={BEFORE} labelWidth={80} />
              </Box>
            ) : (
              <NoData />
            )}
          </Panel>

          <Panel>
            <SectionLabel>
              Location (Current) <Box component="span" sx={{ color: MUTED, fontWeight: 400, textTransform: "none" }}>(Top Countries)</Box>
            </SectionLabel>
            {currentLoc.length ? (
              <Box sx={{ display: "grid", gridTemplateColumns: "0.85fr 1.3fr", gap: 1.25, alignItems: "center" }}>
                <HBarChart items={currentLoc} color={BEFORE} labelWidth={72} />
                <GeoMap shapes={WORLD_SHAPES} viewBox={WORLD_VIEWBOX} items={currentLoc} color={BEFORE} />
              </Box>
            ) : (
              <NoData />
            )}
          </Panel>

          <Panel>
            <SectionLabel>
              Open-Ended Themes <Box component="span" sx={{ color: MUTED, fontWeight: 400, textTransform: "none" }}>(Word Cloud)</Box>
            </SectionLabel>
            {themeWords.length ? <WordCloud words={themeWords} /> : <NoData />}
          </Panel>

          <Panel id="k-about">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
              <InfoOutlinedIcon sx={{ color: SUB, fontSize: 19 }} />
              <Typography sx={{ color: INK, fontWeight: 700, letterSpacing: 0.8, fontSize: 12.5 }}>ABOUT THE DATA</Typography>
            </Box>
            <Typography sx={{ color: SUB, fontSize: 11.5, lineHeight: 1.6 }}>{aboutText}</Typography>
            {agg?.avgAge ? (
              <Typography sx={{ color: SUB, fontSize: 11.5, lineHeight: 1.6, mt: 1 }}>
                Average participant age: <Box component="span" sx={{ color: INK, fontWeight: 700 }}>{agg.avgAge}</Box>.
              </Typography>
            ) : null}
            <Button
              variant="contained"
              endIcon={<ChevronRightRoundedIcon />}
              sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.1)", color: INK, textTransform: "none", borderRadius: 999, boxShadow: "none", fontSize: 12.5, "&:hover": { bgcolor: "rgba(255,255,255,0.18)", boxShadow: "none" } }}
            >
              {d.about.buttonLabel}
            </Button>
          </Panel>
        </Box>

        {/* ── Supporting detail kept from the fuller dataset ───────────── */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: { xs: 1.5, sm: 2 }, alignItems: "start" }}>
          <Panel id="k-sound-felt">
            <SectionLabel>
              How the Sound Felt <Box component="span" sx={{ color: MUTED, fontWeight: 400, textTransform: "none" }}>(Top Mentions)</Box>
            </SectionLabel>
            {soundFelt.length ? <HBarChart items={soundFelt} color={AFTER} labelWidth={140} /> : <NoData />}
            {/* `associate` asks something very close to the "recall memories"
                headline, so it lives here rather than competing with it above. */}
            <Box sx={{ mt: 2, pt: 1.75, borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography sx={{ color: INK, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{agg?.associateRate ?? 0}%</Typography>
              <Typography sx={{ color: SUB, fontSize: 11.5 }}>
                also associate it with specific memories, people, or environments
              </Typography>
            </Box>
          </Panel>

          <Panel id="k-meaning">
            <SectionLabel>What the Coquí Call Means to Participants</SectionLabel>
            {quotes.length ? <Quotes items={quotes} /> : <NoData />}
          </Panel>
        </Box>

        <Typography sx={{ textAlign: "center", color: MUTED, fontStyle: "italic", fontSize: 11.5, pt: 1.5, pb: 2 }}>
          *This dashboard is a visual guide. The data does not replace medical or psychological advice.
        </Typography>
      </Box>
    </CoquiShell>
  );
};

export default KindnessPage;
