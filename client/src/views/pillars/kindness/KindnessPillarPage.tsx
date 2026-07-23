import React, { ReactNode } from "react";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import { useNavigate } from "react-router-dom";
import LogoBadge from "../../landing/LogoBadge";
import HelpingHandsIcon from "./HelpingHandsIcon";

const INDIGO = "#30216d";
const GREEN = "#145f46";
const SERIF = 'Georgia, "Times New Roman", serif';
const PAPER = "rgba(255,250,250,.91)";

interface KindnessCardData {
  title: ReactNode;
  description: ReactNode;
  icon: ReactNode;
  green?: boolean;
  featured?: boolean;
  path?: string;
}

const acts: KindnessCardData[] = [
  { title: "Kind Words", description: <>Share a compliment<br />or a note of<br />appreciation.</>, icon: <VolunteerActivismOutlinedIcon />, path: "/kindness/words" },
  { title: "Lend a Hand", description: <>Offer help to<br />someone who<br />needs it.</>, icon: <HelpingHandsIcon />, green: true, path: "/kindness/lend-a-hand" },
  { title: "Small Donations", description: <>Save the world<br />one donation<br />at a time.</>, icon: <LocalCafeOutlinedIcon /> },
  { title: "Be Present", description: <>Listen deeply.<br />Your presence<br />is powerful.</>, icon: <GroupsOutlinedIcon />, green: true },
];

const selfCare: KindnessCardData[] = [
  { title: "Pause & Breathe", description: <>Take a moment<br />to center<br />and reset.</>, icon: <SelfImprovementRoundedIcon /> },
  { title: "Nourish Your Body", description: <>Eat well, hydrate,<br />rest, and move<br />with love.</>, icon: <RestaurantOutlinedIcon />, green: true, featured: true },
  { title: "Speak Kindly", description: <>Be gentle with<br />yourself. You are<br />enough.</>, icon: <AutoAwesomeOutlinedIcon /> },
  { title: "Honor Your Heart", description: <>Journal, reflect,<br />and celebrate<br />your growth.</>, icon: <MenuBookOutlinedIcon />, green: true },
];

const support: KindnessCardData[] = [
  { title: <>Environmental<br />Foundations</>, description: <>Support causes<br />that protect<br />our planet.</>, icon: <SpaOutlinedIcon />, green: true },
  { title: <>Children & Education<br />Foundations</>, description: <>Help create brighter<br />futures through<br />education.</>, icon: <SchoolOutlinedIcon /> },
  { title: <>Health & Wellness<br />Foundations</>, description: <>Support physical<br />and mental health<br />initiatives.</>, icon: <HealthAndSafetyOutlinedIcon />, green: true },
  { title: <>Animal Welfare<br />Foundations</>, description: <>Advocate and<br />support our<br />animal friends.</>, icon: <PetsOutlinedIcon /> },
];

const meditations = [
  { title: <>Loving-Kindness<br />Meditation</>, description: <>Cultivate compassion<br />for yourself and others.</>, green: false },
  { title: <>Gratitude<br />Meditation</>, description: <>Focus on the good<br />and light within.</>, green: true },
  { title: <>Compassion<br />Meditation</>, description: <>Open your heart.<br />Send kindness out<br />into the world.</>, green: false },
];

const SectionTitle: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Box sx={{ my: { xs: 2, sm: 2.8 }, display: "flex", alignItems: "center", justifyContent: "center", gap: 1.3, color: INDIGO }}>
    <SpaOutlinedIcon sx={{ color: "#a78dcc", transform: "rotate(-25deg)" }} />
    <Typography component="h2" sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: { xs: 25, sm: 30 }, textAlign: "center" }}>{children}</Typography>
    <SpaOutlinedIcon sx={{ color: "#a78dcc", transform: "rotate(25deg)" }} />
  </Box>
);

const KindnessCard: React.FC<{ item: KindnessCardData }> = ({ item }) => {
  const navigate = useNavigate();
  const openCard = () => item.path && navigate(item.path);

  return <Box onClick={openCard} onKeyDown={(event) => { if (item.path && (event.key === "Enter" || event.key === " ")) openCard(); }} role={item.path ? "link" : undefined} tabIndex={item.path ? 0 : undefined} sx={{ position: "relative", minHeight: 245, px: 1.7, py: 2, border: item.featured ? `2px solid ${GREEN}` : "1px solid rgba(91,64,133,.2)", borderRadius: 3.2, bgcolor: PAPER, color: INDIGO, boxShadow: "0 8px 18px rgba(51,32,86,.14)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", overflow: "hidden", cursor: item.path ? "pointer" : "default", transition: "transform .2s ease, box-shadow .2s ease, background-color .22s ease, color .22s ease, border-color .22s ease", "&:hover": item.path ? { transform: "translateY(-4px)", boxShadow: "0 14px 28px rgba(51,32,86,.28)", bgcolor: INDIGO, color: "#fff", borderColor: "#fff", "& .kindness-card-icon": { color: "#fff" } } : undefined, "&:focus-visible": item.path ? { outline: "3px solid #8f72bd", outlineOffset: 3 } : undefined }}>
    {item.featured && <Box sx={{ position: "absolute", top: 11, left: -30, width: 105, py: .35, bgcolor: "#5c9a70", color: "#fff", fontSize: 13, transform: "rotate(-45deg)" }}>NEW</Box>}
    <Box className="kindness-card-icon" sx={{ height: 77, color: item.green ? GREEN : INDIGO, display: "grid", placeItems: "center", transition: "color .22s ease", "& svg": { fontSize: 68, strokeWidth: .6 } }}>{item.icon}</Box>
    <Typography component="h3" sx={{ mt: .5, fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>{item.title}</Typography>
    <Typography sx={{ mt: .8, fontSize: 14.5, lineHeight: 1.5 }}>{item.description}</Typography>
    {item.featured && <Button endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: "auto", px: 1.4, py: .35, border: "1px solid #9a74c6", borderRadius: 99, color: INDIGO, bgcolor: "rgba(220,201,238,.6)", textTransform: "none" }}>Healthy Recipes</Button>}
  </Box>;
};

const CardGrid: React.FC<{ items: KindnessCardData[] }> = ({ items }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: { xs: 1.2, sm: 1.7 } }}>
    {items.map((item, index) => <KindnessCard key={index} item={item} />)}
  </Box>
);

const KindnessPillarPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box component="main" sx={{ minHeight: "100dvh", width: "100%", backgroundImage: "linear-gradient(rgba(255,255,255,.68), rgba(255,255,255,.57)), url('/pillars/kindness-page-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: { md: "fixed" } }}>

      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 3.5 }, px: { xs: 1.5, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", color: INDIGO }}>
          <LogoBadge size={{ xs: 110, sm: 148 }} />
          <Typography component="h1" sx={{ mt: .3, fontFamily: SERIF, fontWeight: 500, fontSize: { xs: 50, sm: 70 }, lineHeight: 1.05 }}>Kindness</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: 240, sm: 310 }, my: 1.5 }}><Box sx={{ flex: 1, height: 1, bgcolor: "#aa91ca" }} /><FavoriteBorderRoundedIcon sx={{ color: "#8e6bb8", fontSize: 34 }} /><Box sx={{ flex: 1, height: 1, bgcolor: "#aa91ca" }} /></Box>
          <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 17, sm: 21 }, lineHeight: 1.35 }}>Small acts. Big impact.<br />Kindness begins with you.</Typography>
          <Box sx={{ display: "flex", gap: 2.5, my: 2 }}>{[false, true, false].map((active, i) => <Box key={i} sx={{ width: 13, height: 13, borderRadius: "50%", bgcolor: active ? INDIGO : "#d2bfdc" }} />)}</Box>
        </Box>

        <SectionTitle>Acts of Kindness</SectionTitle><CardGrid items={acts} />
        <SectionTitle>Self-Care &amp; Self-Love</SectionTitle><CardGrid items={selfCare} />
        <SectionTitle>Support &amp; Give Back</SectionTitle><CardGrid items={support} />

        <SectionTitle>Kindness Meditations</SectionTitle>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 1.7 }}>
          {meditations.map((item, index) => <Box key={index} sx={{ minHeight: 235, p: 2, border: "1px solid rgba(91,64,133,.2)", borderRadius: 3.2, bgcolor: PAPER, color: INDIGO, boxShadow: "0 8px 18px rgba(51,32,86,.14)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}><Box sx={{ position: "relative", width: 110, height: 90, display: "grid", placeItems: "center" }}><SpaOutlinedIcon sx={{ color: item.green ? GREEN : "#6e47a4", fontSize: 105 }} /><IconButton aria-label={`Play meditation ${index + 1}`} sx={{ position: "absolute", bgcolor: "#fff", color: INDIGO, boxShadow: "0 4px 12px rgba(35,20,75,.2)", "&:hover": { bgcolor: "#f4eaf8" } }}><PlayArrowRoundedIcon /></IconButton></Box><Typography component="h3" sx={{ mt: .7, fontWeight: 700, fontSize: 18, lineHeight: 1.25 }}>{item.title}</Typography><Typography sx={{ mt: .8, fontSize: 14.5, lineHeight: 1.45 }}>{item.description}</Typography></Box>)}
        </Box>

        <Box sx={{ mx: "auto", mt: 2.4, maxWidth: 580, px: 3, py: 1.25, border: "1px solid rgba(255,255,255,.85)", borderRadius: 99, bgcolor: "rgba(104,76,157,.78)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 1.8, boxShadow: "0 8px 20px rgba(48,28,80,.18)", backdropFilter: "blur(7px)" }}><FavoriteBorderRoundedIcon sx={{ fontSize: 35 }} /><Typography sx={{ fontFamily: SERIF, fontSize: { xs: 15, sm: 18 }, textAlign: "center" }}>Every choice is a step toward your well-being.</Typography></Box>
      </Container>
    </Box>
  );
};

export default KindnessPillarPage;
