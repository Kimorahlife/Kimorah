import React, { ReactNode } from "react";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import { useNavigate } from "react-router-dom";
import LogoBadge from "../../landing/LogoBadge";

const SERIF = 'Georgia, "Times New Roman", serif';
const INDIGO = "#352374";
const LAVENDER = "#9272c5";
const PAPER = "rgba(255, 248, 248, 0.94)";

const innerTruths = [
  ["Breath", "What new beginning flows with my breath?"],
  ["Acceptance", "What can I embrace as it is?"],
  ["Values", "What principles guide me right now?"],
  ["Stimulation", "What story or insight can I share?"],
  ["Clarity", "How can I bring clarity to my emotions?"],
  ["Expression", "What truth needs to be spoken/expressed?"],
  ["Balance", "Where can I find equilibrium today?"],
  ["Adaptation", "How can I grow through my limits?"],
  ["Humility", "What keeps me grounded in truth?"],
  ["Choice", "Which path will I consciously choose?"],
  ["Completion", "What cycle is ready to be completed?"],
  ["Honor", "How can I recognize what I’ve learned?"],
];

interface Practice {
  title: string;
  description: ReactNode;
  icon: ReactNode;
  color?: string;
}

const practices: Practice[] = [
  {
    title: "Healthy Juices or Snacks",
    description: <>That Boost the<br />Immune System</>,
    icon: (
      <Box sx={{ position: "relative", width: 70, height: 54 }}>
        <LocalDrinkOutlinedIcon sx={{ position: "absolute", left: 4, bottom: 0, color: "#573887", fontSize: "52px !important" }} />
        <Box sx={{ position: "absolute", left: 17, bottom: 7, width: 21, height: 27, borderRadius: "2px 2px 7px 7px", bgcolor: "#bd4aa8", opacity: .9 }} />
        <SpaOutlinedIcon sx={{ position: "absolute", right: 0, top: 1, color: "#4e7739", fontSize: "28px !important", transform: "rotate(-28deg)" }} />
        <Box sx={{ position: "absolute", right: 5, bottom: 3, display: "flex" }}>
          {[0, 1].map((fruit) => <Box key={fruit} sx={{ width: 17, height: 17, ml: fruit ? -0.5 : 0, border: "2px solid #b77024", borderRadius: "50%", bgcolor: "#efa64a" }} />)}
        </Box>
      </Box>
    ),
  },
  { title: "Detox", description: <>Release what<br />no longer serves</>, icon: <WaterDropOutlinedIcon /> },
  { title: "Energy Vent", description: <>Clear stress.<br />Breathe deeper.</>, icon: <AirRoundedIcon /> },
  { title: "Let Go Interventions", description: <>Release. Reset.<br />Move forward.</>, icon: <FavoriteBorderRoundedIcon /> },
  { title: "Somatic Methods", description: <>Reconnect.<br />Recover. Restore.</>, icon: <SelfImprovementRoundedIcon /> },
  { title: "Sleep Hygiene", description: <>Rest deeply.<br />Rise renewed.</>, icon: <BedtimeOutlinedIcon /> },
];

const PracticeCard: React.FC<{ practice: Practice }> = ({ practice }) => (
  <Box sx={{ minHeight: 205, p: 2.1, border: "1px solid rgba(91,64,133,.2)", borderRadius: 3.5, bgcolor: PAPER, boxShadow: "0 8px 18px rgba(51,32,86,.14)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
    <Box sx={{ height: 54, color: practice.color || INDIGO, display: "grid", placeItems: "center", "& svg": { fontSize: 48, strokeWidth: .7 } }}>{practice.icon}</Box>
    <Typography component="h3" sx={{ mt: .5, fontFamily: SERIF, color: INDIGO, fontWeight: 700, fontSize: 19, lineHeight: 1.2 }}>{practice.title}</Typography>
    <Typography sx={{ mt: .7, color: INDIGO, fontSize: 15.5, lineHeight: 1.35 }}>{practice.description}</Typography>
    <Button endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: "auto", px: 1.8, py: .25, minWidth: 0, border: "1px solid #c3a9df", borderRadius: 99, color: INDIGO, fontFamily: SERIF, fontSize: 15, lineHeight: 1.4, textTransform: "none", bgcolor: "rgba(237,221,242,.55)" }}>Journal</Button>
  </Box>
);

const RevitalizationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box component="main" sx={{ position: "relative", minHeight: "100dvh", backgroundImage: "linear-gradient(rgba(255,255,255,.38), rgba(255,255,255,.38)), url('/pillars/revitalization-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: { md: "fixed" }, overflow: "hidden" }}>
      <IconButton aria-label="Back to home" onClick={() => navigate("/")} sx={{ position: "fixed", top: { xs: 14, sm: 28 }, left: { xs: 14, sm: 28 }, zIndex: 5, width: { xs: 54, sm: 76 }, height: { xs: 54, sm: 76 }, color: INDIGO, bgcolor: "rgba(171,143,209,.78)", backdropFilter: "blur(5px)", "&:hover": { bgcolor: "rgba(158,126,201,.94)" } }}>
        <ArrowBackRoundedIcon sx={{ fontSize: { xs: 30, sm: 41 } }} />
      </IconButton>

      <Container maxWidth="md" sx={{ position: "relative", py: { xs: 3, sm: 3.5 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <LogoBadge size={{ xs: 104, sm: 132 }} />
          <Typography component="h1" sx={{ mt: .2, fontFamily: SERIF, color: INDIGO, fontWeight: 500, fontSize: { xs: 43, sm: 66 }, lineHeight: 1.05 }}>Revitalization</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: 245, sm: 325 }, my: 1.4 }}><Box sx={{ flex: 1, height: 1.5, bgcolor: LAVENDER }} /><SpaOutlinedIcon sx={{ color: "#7652b1", fontSize: 36 }} /><Box sx={{ flex: 1, height: 1.5, bgcolor: LAVENDER }} /></Box>
          <Typography sx={{ color: INDIGO, fontFamily: SERIF, fontSize: { xs: 17, sm: 21 }, lineHeight: 1.3 }}>Renew your energy. Reclaim your truth.<br />Rise into your fullest self.</Typography>
          <Box sx={{ display: "flex", gap: 2.6, my: 2 }}>
            {[false, true, false].map((active, index) => <Box key={index} sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: active ? "#573699" : "#cdb7dc" }} />)}
          </Box>
        </Box>

        <Box sx={{ position: "relative", ml: { xs: 1.7, sm: 3.5 }, px: { xs: 2.4, sm: 4.5 }, pt: 2, pb: 1.7, border: "2px solid rgba(92,61,126,.38)", borderRadius: 3.5, bgcolor: PAPER, boxShadow: "0 9px 20px rgba(48,30,78,.2), inset 0 0 18px rgba(181,139,180,.12)" }}>
          <Box sx={{ position: "absolute", left: { xs: -22, sm: -26 }, top: 20, bottom: 20, width: 42, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {Array.from({ length: 11 }).map((_, i) => <Box key={i} sx={{ width: 38, height: 9, border: "3px solid #7759a3", borderRadius: 99, bgcolor: "rgba(217,192,220,.8)", boxShadow: "0 1px 2px rgba(50,25,80,.25)" }} />)}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.3 }}><SpaOutlinedIcon sx={{ color: LAVENDER }} /><Typography component="h2" sx={{ fontFamily: SERIF, color: INDIGO, fontWeight: 700, fontSize: { xs: 22, sm: 28 } }}>The 12 Laws of Inner Truths</Typography><SpaOutlinedIcon sx={{ color: LAVENDER }} /></Box>
          <Typography sx={{ color: INDIGO, fontFamily: SERIF, fontSize: 18, textAlign: "center", mb: .7 }}>Reflective Cycle</Typography>
          {innerTruths.map(([title, prompt], index) => (
            <Box key={title} sx={{ display: "flex", alignItems: "center", minHeight: 31, borderTop: "1px solid rgba(109,79,142,.16)", color: INDIGO }}>
              <Box sx={{ mr: 1.5, width: 24, height: 24, flexShrink: 0, borderRadius: "50%", bgcolor: "#9b7ac7", color: "#fff", display: "grid", placeItems: "center", fontFamily: SERIF, fontSize: 14 }}>{index + 1}</Box>
              <Typography sx={{ fontSize: { xs: 13.5, sm: 15.5 }, lineHeight: 1.25 }}><Box component="strong" sx={{ fontFamily: SERIF }}>{title}:</Box> {prompt}</Typography>
            </Box>
          ))}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.3, mt: 1.2, color: "#7756ae" }}><Box sx={{ flex: 1, height: 1, bgcolor: "#c4abd5" }} /><SpaOutlinedIcon /><Typography sx={{ whiteSpace: "nowrap", fontFamily: SERIF, fontSize: 16 }}>Write. Reflect. Realign.</Typography><Box sx={{ flex: 1, height: 1, bgcolor: "#c4abd5" }} /></Box>
        </Box>

        <Box sx={{ mt: 2.5, display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" }, gap: 1.7 }}>
          {practices.slice(0, 4).map((practice) => <PracticeCard key={practice.title} practice={practice} />)}
          {practices.slice(4).map((practice) => <PracticeCard key={practice.title} practice={practice} />)}
          <Box sx={{ gridColumn: { xs: "1 / -1", sm: "span 2" }, minHeight: 205, p: 2.4, border: "1px solid rgba(91,64,133,.2)", borderRadius: 3.5, bgcolor: PAPER, boxShadow: "0 8px 18px rgba(51,32,86,.14)" }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, color: "#8060b2" }}><SpaOutlinedIcon /><Typography component="h3" sx={{ fontFamily: SERIF, fontSize: 21 }}>Daily Reflections</Typography></Box>
            {[0, 1, 2, 3].map((line) => <Box key={line} sx={{ mt: 2.3, borderBottom: "1px solid rgba(119,86,164,.3)" }} />)}
          </Box>
        </Box>

        <Box sx={{ mx: "auto", mt: 2.8, mb: 1, maxWidth: 650, px: 3, py: 1.35, border: "1px solid rgba(255,255,255,.75)", borderRadius: 99, bgcolor: "rgba(100,67,150,.78)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 2.2, boxShadow: "0 8px 20px rgba(48,28,80,.2)", backdropFilter: "blur(7px)" }}>
          <FavoriteBorderRoundedIcon sx={{ fontSize: 37, flexShrink: 0 }} /><Typography sx={{ fontFamily: SERIF, fontSize: { xs: 15, sm: 19 }, textAlign: "center" }}>Every step you take today builds a stronger tomorrow.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default RevitalizationPage;
