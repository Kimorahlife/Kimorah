import React, { ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useNavigate } from "react-router-dom";
import { kindnessData } from "./kindness-data";
import Sidebar from "./Sidebar";
import {
  DonutChart,
  HBarChart,
  INK,
  LegendList,
  MUTED,
  Panel,
  SectionLabel,
  StatCard,
  SUB,
  VBarChart,
  WordCloud,
} from "./components";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const GOLD = "#d8b25a";

const GLANCE_ICONS: Record<string, ReactNode> = {
  person: <PersonRoundedIcon />,
  globe: <PublicRoundedIcon />,
  calendar: <CalendarMonthRoundedIcon />,
  heart: <FavoriteRoundedIcon />,
};

const KindnessPage: React.FC = () => {
  const navigate = useNavigate();
  const d = kindnessData;

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "#221d45", color: INK, display: "flex" }}>
      <Sidebar nav={d.nav} quote={d.sidebarQuote} />

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        {/* Mobile back button */}
        <Button
          onClick={() => navigate("/mission")}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            display: { xs: "inline-flex", md: "none" },
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 20,
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            borderRadius: 999,
            bgcolor: "rgba(0,0,0,0.5)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
          }}
        >
          Back
        </Button>

        {/* Hero */}
        <Box
          sx={{
            position: "relative",
            px: { xs: 2, sm: 4 },
            py: { xs: 5, sm: 5 },
            backgroundImage: "url('/pillars/kindness-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(34,29,69,0.5) 0%, rgba(34,29,69,0.82) 100%)" }} />
          <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ color: GOLD, fontWeight: 700, letterSpacing: 2, fontSize: { xs: 12, sm: 14 } }}>
                {d.header.eyebrow}
              </Typography>
              <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: "#fff", fontSize: { xs: 32, sm: 52 }, lineHeight: 1.05, mt: 0.5 }}>
                {d.header.title}
              </Typography>
              <Typography sx={{ color: "#d9d5f0", fontSize: { xs: 14, sm: 17 }, mt: 1, maxWidth: 560 }}>
                {d.header.subtitle}
              </Typography>
            </Box>
            <Box
              component="img"
              src={d.header.frogImage}
              alt="Coquí"
              sx={{ width: { xs: 84, sm: 118 }, height: { xs: 84, sm: 118 }, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.35)", flexShrink: 0 }}
            />
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5 } }}>
          {/* At a glance */}
          <Panel id="k-overview">
            <SectionLabel>AT A GLANCE</SectionLabel>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: { xs: 1.5, sm: 2 } }}>
              {d.glance.map((g, i) => (
                <StatCard key={i} icon={GLANCE_ICONS[g.icon]} value={g.value} unit={g.unit} label={g.label} />
              ))}
            </Box>
          </Panel>

          {/* Imprinting + Time since exposure */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 2, sm: 2.5 } }}>
            <Panel id="k-key-findings">
              <SectionLabel>IMPRINTING SCORE DISTRIBUTION</SectionLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexWrap: "wrap", justifyContent: "center" }}>
                <DonutChart segments={d.imprinting.distribution}>
                  <Typography sx={{ color: INK, fontSize: 30, fontWeight: 700, lineHeight: 1 }}>{d.imprinting.average}</Typography>
                  <Typography sx={{ color: MUTED, fontSize: 11 }}>Average Score</Typography>
                  <Typography sx={{ color: MUTED, fontSize: 10 }}>({d.imprinting.outOf})</Typography>
                </DonutChart>
                <Box sx={{ flexGrow: 1, minWidth: 180 }}>
                  <LegendList segments={d.imprinting.distribution} />
                </Box>
              </Box>
            </Panel>

            <Panel id="k-time">
              <SectionLabel>TIME SINCE LAST EXPOSURE</SectionLabel>
              <VBarChart items={d.timeSinceExposure} gradient={["#6fae5a", "#4a86c4"]} max={40} />
            </Panel>
          </Box>

          {/* Emotional + Somatic + Time of exposure */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: { xs: 2, sm: 2.5 } }}>
            <Panel id="k-emotional">
              <SectionLabel>EMOTIONAL RESPONSES <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(Top Mentions)</Box></SectionLabel>
              <HBarChart items={d.emotionalResponses} gradient={["#7fc07a", "#4f9e63"]} max={80} labelWidth={92} />
            </Panel>
            <Panel id="k-somatic">
              <SectionLabel>SOMATIC RESPONSES <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(Top Mentions)</Box></SectionLabel>
              <HBarChart items={d.somaticResponses} gradient={["#a99ee8", "#7a6cc8"]} max={80} labelWidth={108} />
            </Panel>
            <Panel>
              <SectionLabel>TIME OF EXPOSURE <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(Most Impactful)</Box></SectionLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                <DonutChart segments={d.timeOfExposure} size={140} thickness={22}>
                  <DarkModeRoundedIcon sx={{ color: SUB, fontSize: 30 }} />
                </DonutChart>
                <Box sx={{ flexGrow: 1, minWidth: 130 }}>
                  <LegendList segments={d.timeOfExposure} />
                </Box>
              </Box>
            </Panel>
          </Box>

          {/* Qualitative insights */}
          <Panel id="k-demographics">
            <SectionLabel>QUALITATIVE INSIGHTS</SectionLabel>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: { xs: 2, sm: 2.5 } }}>
              <Box>
                <Typography sx={{ color: SUB, fontSize: 12, fontWeight: 600, mb: 1 }}>EMOTIONAL THEMES <Box component="span" sx={{ color: MUTED }}>(Word Cloud)</Box></Typography>
                <WordCloud words={d.emotionalThemes} />
              </Box>
              <Box>
                <Typography sx={{ color: SUB, fontSize: 12, fontWeight: 600, mb: 1 }}>SOMATIC THEMES <Box component="span" sx={{ color: MUTED }}>(Word Cloud)</Box></Typography>
                <WordCloud words={d.somaticThemes} />
              </Box>
              <Box>
                <Typography sx={{ color: SUB, fontSize: 12, fontWeight: 600, mb: 1 }}>WHAT THE COQUÍ CALL MEANS TO PARTICIPANTS</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {d.participantQuotes.map((q, i) => (
                    <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "flex-start", bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2, p: 1.25 }}>
                      <FormatQuoteRoundedIcon sx={{ color: "#9a8be6", fontSize: 18, flexShrink: 0, transform: "scaleX(-1)" }} />
                      <Typography sx={{ color: SUB, fontSize: 13, fontStyle: "italic" }}>{q}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Panel>

          {/* Locations + about */}
          <Box id="k-location" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: { xs: 2, sm: 2.5 } }}>
            <Panel>
              <SectionLabel>ORIGINAL LOCATION <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(Top 5)</Box></SectionLabel>
              <HBarChart items={d.originalLocation} gradient={["#7fc07a", "#4f9e63"]} max={50} labelWidth={120} />
            </Panel>
            <Panel>
              <SectionLabel>CURRENT LOCATION <Box component="span" sx={{ color: MUTED, fontWeight: 400 }}>(Top 5)</Box></SectionLabel>
              <HBarChart items={d.currentLocation} gradient={["#7fa8e0", "#4f7fc4"]} max={50} labelWidth={92} />
            </Panel>
            <Panel id="k-about">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <EnergySavingsLeafRoundedIcon sx={{ color: "#9fd3a8", fontSize: 20 }} />
                </Box>
                <Typography sx={{ color: SUB, fontWeight: 700, letterSpacing: 0.8, fontSize: 13 }}>ABOUT THIS DATA</Typography>
              </Box>
              <Typography sx={{ color: MUTED, fontSize: 12.5, lineHeight: 1.5 }}>{d.about.text}</Typography>
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
      </Box>
    </Box>
  );
};

export default KindnessPage;
