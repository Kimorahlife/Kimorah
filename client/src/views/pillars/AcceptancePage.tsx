import React, { ReactNode } from "react";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import { useNavigate } from "react-router-dom";
import LogoBadge from "../landing/LogoBadge";

const INDIGO = "#352374";
const PURPLE = "#8552c1";
const SERIF = 'Georgia, "Times New Roman", serif';
const PAPER = "rgba(255,247,250,.9)";

interface Service {
  title: ReactNode;
  description: ReactNode;
  icon: ReactNode;
}

const services: Service[] = [
  { title: <>Bereavement<br />Counseling</>, description: <>Compassionate, personalized<br />support for your<br />grief journey.</>, icon: <VolunteerActivismOutlinedIcon /> },
  { title: <>Planning for<br />End of Life</>, description: <>Make empowered decisions<br />and create a plan that<br />honors your wishes.</>, icon: <AssignmentOutlinedIcon /> },
  { title: <>Death Doula<br />Services</>, description: <>Gentle guidance and<br />presence for you and<br />your loved ones.</>, icon: <SpaOutlinedIcon /> },
  { title: <>Legal Advice for<br />End of Life</>, description: <>Understand your rights and<br />options with end-of-life<br />legal guidance.</>, icon: <BalanceOutlinedIcon /> },
  { title: <>Help with Belongings</>, description: <>Compassionate assistance<br />in sorting and organizing<br />a recently deceased<br />person’s possessions.</>, icon: <Inventory2OutlinedIcon /> },
];

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <Box sx={{ minHeight: { xs: 280, md: 298 }, px: 2, py: 2.2, border: "1px solid rgba(255,255,255,.7)", borderRadius: 3.5, bgcolor: PAPER, color: INDIGO, boxShadow: "0 10px 24px rgba(12,8,55,.24)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
    <Box sx={{ height: 78, display: "grid", placeItems: "center", "& svg": { fontSize: 72, strokeWidth: .6 } }}>{service.icon}</Box>
    <Typography component="h2" sx={{ mt: .4, fontFamily: SERIF, fontWeight: 700, fontSize: 20, lineHeight: 1.25 }}>{service.title}</Typography>
    <Typography sx={{ mt: .8, fontSize: 14.5, lineHeight: 1.45 }}>{service.description}</Typography>
    <Button endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: "auto", px: 2.4, py: .45, border: "1px solid #b998dc", borderRadius: 99, color: INDIGO, bgcolor: "rgba(210,183,231,.55)", fontSize: 15, lineHeight: 1.35, textTransform: "none", "&:hover": { bgcolor: "rgba(195,158,224,.7)" } }}>Learn More</Button>
  </Box>
);

const AcceptancePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box component="main" sx={{ minHeight: "100dvh", width: "100%", backgroundImage: "linear-gradient(rgba(255,255,255,.28), rgba(255,255,255,.28)), url('/pillars/acceptance-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: { md: "fixed" }, overflow: "hidden" }}>

      <Container maxWidth={false} sx={{ maxWidth: 1280, py: { xs: 3, sm: 3.5 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", color: "#f8e7f5" }}>
          <LogoBadge size={{ xs: 104, sm: 132 }} />
          <Typography component="h1" sx={{ mt: .2, fontFamily: SERIF, fontWeight: 500, fontSize: { xs: 50, sm: 72 }, lineHeight: 1.05, textShadow: "0 3px 16px rgba(9,5,45,.65)" }}>Acceptance</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: 245, sm: 315 }, my: 1.3 }}><Box sx={{ flex: 1, height: 1, bgcolor: "#c99ce4" }} /><SpaOutlinedIcon sx={{ color: "#c27ee5", fontSize: 37 }} /><Box sx={{ flex: 1, height: 1, bgcolor: "#c99ce4" }} /></Box>
          <Typography sx={{ fontSize: { xs: 17, sm: 21 }, lineHeight: 1.35, textShadow: "0 2px 8px rgba(8,4,40,.75)" }}>You don’t have to go through<br />this alone. We are here for you.</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.2, my: 2.2 }}>{[false, true, false].map((active, index) => <Box key={index} sx={{ width: active ? 20 : 12, height: 12, borderRadius: 99, bgcolor: active ? "#c08fe1" : "#b981d9" }} />)}</Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(5, minmax(0, 1fr))" }, gap: 1.6 }}>
          {services.map((service, index) => <Box key={index} sx={{ gridColumn: { xs: "auto", sm: index === 4 ? "1 / -1" : "auto", md: "auto" }, width: { sm: index === 4 ? "calc(50% - 7px)" : "auto", md: "auto" }, justifySelf: "center" }}><ServiceCard service={service} /></Box>)}
        </Box>

        <Box sx={{ mx: "auto", mt: 2, maxWidth: 825, px: { xs: 2.5, sm: 4 }, py: 1.7, border: "1px solid rgba(255,255,255,.65)", borderRadius: 3.5, bgcolor: PAPER, color: INDIGO, boxShadow: "0 10px 24px rgba(12,8,55,.24)", display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: { xs: 1.5, sm: 2.5 } }}>
          <Box sx={{ position: "relative", width: 120, height: 74, flexShrink: 0 }}><GroupsOutlinedIcon sx={{ fontSize: 76 }} /><FavoriteBorderRoundedIcon sx={{ position: "absolute", left: 42, bottom: -2, fontSize: 43, bgcolor: "#f9eff4", borderRadius: "50%" }} /></Box>
          <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}><Typography component="h2" sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: 21 }}>Bereavement Support Group</Typography><Typography sx={{ mt: .4, fontSize: 14.5, lineHeight: 1.45 }}>Connect with others who understand.<br />Share, heal, and grow together in a safe space.</Typography></Box>
          <Button endIcon={<ArrowForwardRoundedIcon />} sx={{ px: 3, py: .9, flexShrink: 0, borderRadius: 99, bgcolor: PURPLE, color: "#fff", textTransform: "none", fontSize: 15.5, "&:hover": { bgcolor: "#7040aa" } }}>View Groups</Button>
        </Box>

        <Box sx={{ mt: 1.8, color: "#e9cce8", textAlign: "center" }}><Typography sx={{ fontFamily: SERIF, fontStyle: "italic", fontSize: { xs: 17, sm: 20 }, textShadow: "0 2px 8px rgba(8,4,40,.75)" }}>✦ &nbsp; In acceptance, we create space for healing. &nbsp; ✦</Typography><Box sx={{ mx: "auto", mt: .8, display: "flex", alignItems: "center", gap: 1.2, maxWidth: 220 }}><Box sx={{ flex: 1, height: 1, bgcolor: "#d2a8e5" }} /><FavoriteBorderRoundedIcon sx={{ fontSize: 25, color: "#d797e9" }} /><Box sx={{ flex: 1, height: 1, bgcolor: "#d2a8e5" }} /></Box></Box>
        <Box sx={{ mx: "auto", mt: 1.3, maxWidth: 510, px: 3, py: 1.2, border: "1px solid rgba(255,255,255,.36)", borderRadius: 99, bgcolor: "rgba(91,53,145,.8)", color: "#ead8ef", display: "flex", alignItems: "center", justifyContent: "center", gap: 1.8, backdropFilter: "blur(7px)" }}><FavoriteBorderRoundedIcon sx={{ fontSize: 34 }} /><Typography sx={{ fontSize: { xs: 15, sm: 18 } }}>You are not alone. We walk with you.</Typography></Box>
      </Container>
    </Box>
  );
};

export default AcceptancePage;
