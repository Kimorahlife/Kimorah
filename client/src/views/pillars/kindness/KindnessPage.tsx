import React, { ReactNode, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { kindnessData } from "./kindness-data";
import { api } from "../../../api";
import CoquiShell from "./CoquiShell";
import {
  DonutChart,
  HBarChart,
  INK,
  LegendList,
  MUTED,
  NoData,
  Panel,
  SectionLabel,
  StatCard,
  SUB,
  VBarChart,
  WordCloud,
} from "./components";

const GLANCE_ICONS: Record<string, ReactNode> = {
  person: <PersonRoundedIcon />,
  globe: <PublicRoundedIcon />,
  calendar: <CalendarMonthRoundedIcon />,
  heart: <FavoriteRoundedIcon />,
};

/** Coquí Research Data dashboard (under Mission → Review Data). */
const KindnessPage: React.FC = () => {
  const d = kindnessData;
  const [agg, setAgg] = useState<any>(null);
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    api.get("/api/research/coqui/aggregates").then((r) => setAgg(r.data)).catch(() => setOffline(true));
  }, []);

  // Everything on this dashboard is driven by the survey responses (the
  // `coqui_responses` collection) via GET /api/research/coqui/aggregates.
  // When the API is unreachable or there's no data, we show honest zeros and
  // empty states — never fabricated sample numbers.
  const glance = [
    { icon: "person", value: String(agg?.totalParticipants ?? 0), label: "Total Participants" },
    { icon: "globe", value: String(agg?.countriesRepresented ?? 0), label: "Countries Represented" },
    { icon: "calendar", value: String(agg?.avgTimeSinceYears ?? 0), unit: "yrs", label: "Avg. Time Since Last Exposure to Coquí" },
    { icon: "heart", value: String(agg?.avgActivation ?? 0), unit: "/ 10", label: "Avg. Emotional Activation (0–10)" },
  ];

  const IMPRINT_COLORS = d.imprinting.distribution.map((s) => s.color);
  const TOD_COLORS = d.timeOfExposure.map((s) => s.color);
  const withColors = (segs: any[], colors: string[]) => segs.map((s, i) => ({ ...s, color: colors[i] ?? colors[colors.length - 1] }));

  const activation = agg?.activationBands?.length ? withColors(agg.activationBands, IMPRINT_COLORS) : [];
  const timeSince = agg?.timeSinceBuckets?.length ? agg.timeSinceBuckets : [];
  const inside = agg?.insideDistribution?.length ? withColors(agg.insideDistribution, TOD_COLORS) : [];
  const emotional = agg?.topFeelings ?? [];
  const somatic = agg?.topBodyResponses ?? [];
  const originalLoc = agg?.originalLocations ?? [];
  const currentLoc = agg?.currentLocations ?? [];
  const quotes: string[] = agg?.quotes ?? [];

  // Word clouds: turn the top feeling / body tallies into weighted words.
  const toWords = (items: any[] | undefined) =>
    items?.length ? items.map((x) => ({ word: String(x.label).toLowerCase(), weight: Math.max(0.35, x.value / (items[0].value || 1)) })) : [];
  const emotionalThemes = toWords(agg?.topFeelings);
  const somaticThemes = toWords(agg?.topBodyResponses);

  // Key findings — yes-rates from single-choice questions (0 until there's data).
  const findings = [
    { pct: agg?.associateRate ?? 0, label: "Associate it with specific memories, people, or places" },
    { pct: agg?.identityBelongingRate ?? 0, label: "Feel it's part of their identity & cultural belonging" },
    { pct: agg?.shiftRate ?? 0, label: "Felt an emotional or physical shift while listening" },
    { pct: agg?.imagesRate ?? 0, label: "Had images, memories, or sensations arise" },
    { pct: agg?.agreeRate ?? 0, label: "Agree hearing it again helps them feel better" },
  ];
  const soundFelt = agg?.soundFelt?.length ? agg.soundFelt : [];
  const demographics = [
    { icon: <PersonRoundedIcon />, value: String(agg?.avgAge ?? 0), unit: "yrs", label: "Average age" },
    { icon: <CalendarMonthRoundedIcon />, value: String(agg?.avgYearsLived ?? 0), unit: "yrs", label: "Avg. years lived where they heard it" },
  ];

  const tsMax = Math.max(10, ...timeSince.map((t: any) => t.value));
  const aboutText =
    agg && agg.totalParticipants > 0
      ? `This data represents ${agg.totalParticipants} participant${agg.totalParticipants === 1 ? "" : "s"} who lived where the Coquí call was part of their environment and no longer do — ${agg.researchSubmissions} from the research study and ${agg.surveyResponses} from the live survey. Collected via survey.`
      : "No survey responses to display yet. As responses come in, this dashboard fills in automatically.";

  return (
    <CoquiShell activeId="data" heroTitle={d.header.title}>
      <Box sx={{ p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5 } }}>
        {offline && (
          <Box
            sx={{
              bgcolor: "rgba(201, 162, 74, 0.14)",
              border: "1px solid rgba(201, 162, 74, 0.4)",
              borderRadius: 3,
              px: 2,
              py: 1.25,
              color: "#e6cf95",
              fontSize: 13,
            }}
          >
            Live data unavailable — the dashboard shows zeros until the API server is reachable. Start it to load the real survey responses.
          </Box>
        )}
        {/* At a glance */}
        <Panel id="k-overview">
          <SectionLabel>AT A GLANCE</SectionLabel>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: { xs: 1.5, sm: 2 } }}>
            {glance.map((g, i) => (
              <StatCard key={i} icon={GLANCE_ICONS[g.icon]} value={g.value} unit={g.unit} label={g.label} />
            ))}
          </Box>
        </Panel>

        {/* Key findings — yes-rates */}
        <Panel id="k-findings">
          <SectionLabel>KEY FINDINGS <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(Share of Participants)</Box></SectionLabel>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(5, 1fr)" }, gap: { xs: 1.5, sm: 2 } }}>
            {findings.map((f, i) => (
              <Box key={i} sx={{ bgcolor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 3, p: 2, display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Typography sx={{ color: INK, fontSize: { xs: 26, sm: 30 }, fontWeight: 700, lineHeight: 1 }}>{f.pct}%</Typography>
                <Typography sx={{ color: MUTED, fontSize: 12, lineHeight: 1.35 }}>{f.label}</Typography>
              </Box>
            ))}
          </Box>
        </Panel>

        {/* Imprinting + Time since exposure */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 2, sm: 2.5 } }}>
          <Panel id="k-key-findings">
            <SectionLabel>EMOTIONAL ACTIVATION LEVEL</SectionLabel>
            {activation.length ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexWrap: "wrap", justifyContent: "center" }}>
                <DonutChart segments={activation}>
                  <Typography sx={{ color: INK, fontSize: 30, fontWeight: 700, lineHeight: 1 }}>{agg?.avgActivation ?? 0}</Typography>
                  <Typography sx={{ color: MUTED, fontSize: 11 }}>Avg. Activation</Typography>
                  <Typography sx={{ color: MUTED, fontSize: 10 }}>(out of 10)</Typography>
                </DonutChart>
                <Box sx={{ flexGrow: 1, minWidth: 180 }}>
                  <LegendList segments={activation} />
                </Box>
              </Box>
            ) : (
              <NoData />
            )}
          </Panel>

          <Panel id="k-time">
            <SectionLabel>TIME SINCE LAST EXPOSURE</SectionLabel>
            {timeSince.length ? <VBarChart items={timeSince} gradient={["#6fae5a", "#4a86c4"]} max={tsMax} /> : <NoData />}
          </Panel>
        </Box>

        {/* Emotional + Somatic + Time of exposure */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: { xs: 2, sm: 2.5 } }}>
          <Panel id="k-emotional">
            <SectionLabel>EMOTIONAL RESPONSES <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(Top Mentions)</Box></SectionLabel>
            {emotional.length ? <HBarChart items={emotional} gradient={["#7fc07a", "#4f9e63"]} max={100} labelWidth={92} /> : <NoData />}
          </Panel>
          <Panel id="k-somatic">
            <SectionLabel>SOMATIC RESPONSES <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(Top Mentions)</Box></SectionLabel>
            {somatic.length ? <HBarChart items={somatic} gradient={["#a99ee8", "#7a6cc8"]} max={100} labelWidth={108} /> : <NoData />}
          </Panel>
          <Panel>
            <SectionLabel>DOES THE SOUND LIVE INSIDE YOU?</SectionLabel>
            {inside.length ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                <DonutChart segments={inside} size={140} thickness={22}>
                  <FavoriteRoundedIcon sx={{ color: SUB, fontSize: 30 }} />
                </DonutChart>
                <Box sx={{ flexGrow: 1, minWidth: 130 }}>
                  <LegendList segments={inside} />
                </Box>
              </Box>
            ) : (
              <NoData />
            )}
          </Panel>
        </Box>

        {/* How the sound felt + Demographics */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: { xs: 2, sm: 2.5 } }}>
          <Panel id="k-sound-felt">
            <SectionLabel>HOW THE SOUND FELT <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(Top Mentions)</Box></SectionLabel>
            {soundFelt.length ? <HBarChart items={soundFelt} gradient={["#7fa8e0", "#4f7fc4"]} max={100} labelWidth={150} /> : <NoData />}
          </Panel>
          <Panel id="k-who">
            <SectionLabel>WHO PARTICIPATED</SectionLabel>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: { xs: 1.5, sm: 2 } }}>
              {demographics.map((s, i) => (
                <StatCard key={i} icon={s.icon} value={s.value} unit={s.unit} label={s.label} />
              ))}
            </Box>
          </Panel>
        </Box>

        {/* Qualitative insights */}
        <Panel id="k-demographics">
          <SectionLabel>QUALITATIVE INSIGHTS</SectionLabel>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: { xs: 2, sm: 2.5 } }}>
            <Box>
              <Typography sx={{ color: SUB, fontSize: 12, fontWeight: 600, mb: 1 }}>EMOTIONAL THEMES <Box component="span" sx={{ color: MUTED }}>(Word Cloud)</Box></Typography>
              {emotionalThemes.length ? <WordCloud words={emotionalThemes} /> : <NoData />}
            </Box>
            <Box>
              <Typography sx={{ color: SUB, fontSize: 12, fontWeight: 600, mb: 1 }}>SOMATIC THEMES <Box component="span" sx={{ color: MUTED }}>(Word Cloud)</Box></Typography>
              {somaticThemes.length ? <WordCloud words={somaticThemes} /> : <NoData />}
            </Box>
            <Box>
              <Typography sx={{ color: SUB, fontSize: 12, fontWeight: 600, mb: 1 }}>WHAT THE COQUÍ CALL MEANS TO PARTICIPANTS</Typography>
              {quotes.length ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {quotes.map((q: string, i: number) => (
                    <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "flex-start", bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2, p: 1.25 }}>
                      <FormatQuoteRoundedIcon sx={{ color: "#9a8be6", fontSize: 18, flexShrink: 0, transform: "scaleX(-1)" }} />
                      <Typography sx={{ color: SUB, fontSize: 13, fontStyle: "italic" }}>{q}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <NoData />
              )}
            </Box>
          </Box>
        </Panel>

        {/* Locations + about */}
        <Box id="k-location" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: { xs: 2, sm: 2.5 } }}>
          <Panel>
            <SectionLabel>ORIGINAL LOCATION <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(Top 5)</Box></SectionLabel>
            {originalLoc.length ? <HBarChart items={originalLoc} gradient={["#7fc07a", "#4f9e63"]} max={100} labelWidth={120} /> : <NoData />}
          </Panel>
          <Panel>
            <SectionLabel>CURRENT LOCATION <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(Top 5)</Box></SectionLabel>
            {currentLoc.length ? <HBarChart items={currentLoc} gradient={["#7fa8e0", "#4f7fc4"]} max={100} labelWidth={92} /> : <NoData />}
          </Panel>
          <Panel id="k-about">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <EnergySavingsLeafRoundedIcon sx={{ color: "#9fd3a8", fontSize: 20 }} />
              </Box>
              <Typography sx={{ color: SUB, fontWeight: 700, letterSpacing: 0.8, fontSize: 13 }}>ABOUT THIS DATA</Typography>
            </Box>
            <Typography sx={{ color: MUTED, fontSize: 12.5, lineHeight: 1.5 }}>{aboutText}</Typography>
            <Button
              variant="contained"
              endIcon={<ChevronRightRoundedIcon />}
              sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.12)", color: "#fff", textTransform: "none", borderRadius: 999, boxShadow: "none", "&:hover": { bgcolor: "rgba(255,255,255,0.2)", boxShadow: "none" } }}
            >
              {d.about.buttonLabel}
            </Button>
          </Panel>
        </Box>

        <Typography sx={{ textAlign: "center", color: "#9a93c4", fontStyle: "italic", fontSize: { xs: 13, sm: 15 }, py: 2 }}>
          {d.footerQuote}
        </Typography>
      </Box>
    </CoquiShell>
  );
};

export default KindnessPage;
