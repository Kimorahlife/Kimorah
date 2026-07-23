import React, { ReactNode } from "react";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ParkOutlinedIcon from "@mui/icons-material/ParkOutlined";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import { useNavigate } from "react-router-dom";
import LogoBadge from "../../landing/LogoBadge";

const INDIGO = "#352374";
const SERIF = 'Georgia, "Times New Roman", serif';
const PAPER = "rgba(255,248,250,.91)";

interface HarmonyPractice {
  title: ReactNode;
  description: ReactNode;
  icon: ReactNode;
}

const practices: HarmonyPractice[] = [
  { title: <>Vagus Nerve<br />Coping Skills</>, description: <>Activate your body’s natural<br />calming response and<br />support nervous system<br />regulation.</>, icon: <HubOutlinedIcon /> },
  { title: <>Progressive<br />Muscle Relaxation</>, description: <>Release tension from<br />head to toe and invite<br />deep relaxation.</>, icon: <SelfImprovementRoundedIcon /> },
  { title: <>Guided Meditation<br />for Grounding</>, description: <>Soothing meditations to<br />help you feel present,<br />centered, and safe.</>, icon: <SpaOutlinedIcon /> },
  { title: <>Grounding<br />Techniques</>, description: <>Simple practices to help<br />you feel connected,<br />steady, and supported.</>, icon: <ParkOutlinedIcon /> },
  { title: <>Lyrical Dance /<br />Somatics</>, description: <>Move, express, and release<br />through the wisdom of<br />your body.</>, icon: <DirectionsRunOutlinedIcon /> },
  { title: <>Breathing<br />Techniques</>, description: <>Breath practices to calm<br />your mind, regulate your<br />emotions, and restore ease.</>, icon: <AirRoundedIcon /> },
  { title: <>Gratitude<br />Journal</>, description: <>Cultivate appreciation, shift<br />your mindset, and invite<br />more joy into your life.</>, icon: <MenuBookOutlinedIcon /> },
  { title: <>EFT (Emotional<br />Freedom Technique)</>, description: <>Tap, release, and reset.<br />Ease stress, overwhelm,<br />and emotional blocks.</>, icon: <Box sx={{ position: "relative", width: 76, height: 76 }}><FavoriteBorderRoundedIcon sx={{ position: "absolute", top: 0, left: 5 }} /><TouchAppOutlinedIcon sx={{ position: "absolute", right: 0, bottom: -3, fontSize: "55px !important" }} /></Box> },
];

const PracticeCard: React.FC<{ practice: HarmonyPractice }> = ({ practice }) => (
  <Box sx={{ minHeight: 280, px: 2, py: 2.2, border: "1px solid rgba(255,255,255,.7)", borderRadius: 3.5, bgcolor: PAPER, color: INDIGO, boxShadow: "0 9px 22px rgba(39,24,85,.18)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
    <Box sx={{ height: 80, display: "grid", placeItems: "center", "& svg": { fontSize: 70, strokeWidth: .6 } }}>{practice.icon}</Box>
    <Typography component="h2" sx={{ mt: .4, fontFamily: SERIF, fontWeight: 700, fontSize: 19, lineHeight: 1.2 }}>{practice.title}</Typography>
    <Typography sx={{ mt: .8, fontSize: 13.5, lineHeight: 1.45 }}>{practice.description}</Typography>
    <Button endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: "auto", px: 2.6, py: .4, minWidth: 124, border: "1px solid #bea4dc", borderRadius: 99, color: INDIGO, bgcolor: "rgba(211,189,231,.63)", textTransform: "none", fontSize: 14.5, lineHeight: 1.35, "&:hover": { bgcolor: "rgba(195,163,221,.78)" } }}>Explore</Button>
  </Box>
);

const HarmonyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box component="main" sx={{ minHeight: "100dvh", width: "100%", backgroundImage: "linear-gradient(rgba(255,255,255,.18), rgba(255,255,255,.1)), url('/pillars/harmony-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: { md: "fixed" }, overflow: "hidden" }}>

      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 3.5 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", color: "#fff" }}>
          <LogoBadge size={{ xs: 104, sm: 130 }} />
          <Typography component="h1" sx={{ mt: .25, fontFamily: SERIF, fontWeight: 500, fontSize: { xs: 50, sm: 70 }, lineHeight: 1.05, textShadow: "0 3px 14px rgba(19,8,66,.72)" }}>Harmony</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: 245, sm: 315 }, my: 1.4 }}><Box sx={{ flex: 1, height: 1, bgcolor: "rgba(255,255,255,.78)" }} /><SpaOutlinedIcon sx={{ color: "#fff", fontSize: 36 }} /><Box sx={{ flex: 1, height: 1, bgcolor: "rgba(255,255,255,.78)" }} /></Box>
          <Typography sx={{ fontSize: { xs: 16.5, sm: 19.5 }, lineHeight: 1.4, textShadow: "0 2px 9px rgba(19,8,66,.8)" }}>Find balance within. Calm your body,<br />quiet your mind, and come home to yourself.</Typography>
          <Box sx={{ display: "flex", gap: 2.5, my: 2 }}>{[false, true, false].map((active, index) => <Box key={index} sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: active ? INDIGO : "#9b7ac7" }} />)}</Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: { xs: 1.4, sm: 1.8 } }}>
          {practices.map((practice, index) => <PracticeCard key={index} practice={practice} />)}
        </Box>

        <Box sx={{ mt: 2.3, color: "#ead6f0", textAlign: "center", textShadow: "0 2px 8px rgba(22,10,65,.7)" }}>
          <Typography sx={{ fontFamily: SERIF, fontStyle: "italic", fontSize: { xs: 17, sm: 20 } }}>✦ &nbsp; In harmony, we heal. In balance, we thrive. &nbsp; ✦</Typography>
          <Box sx={{ mx: "auto", mt: .9, maxWidth: 260, display: "flex", alignItems: "center", gap: 1.4 }}><Box sx={{ flex: 1, height: 1, bgcolor: "#dcc2e9" }} /><Box sx={{ width: 16, height: 16, transform: "rotate(45deg)", border: "2px solid #e5cdec", borderRadius: "50% 50% 50% 0" }} /><Box sx={{ flex: 1, height: 1, bgcolor: "#dcc2e9" }} /></Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HarmonyPage;
