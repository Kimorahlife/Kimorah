import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";

export type SessionTwoTab = "introduction" | "concepts" | "objectives" | "psychoeducation" | "intervention" | "processing" | "closing";
const tabs = [
  ["introduction", SpaOutlinedIcon, "Introduction", "Introducción"],
  ["concepts", LightbulbOutlinedIcon, "Concepts", "Conceptos"],
  ["objectives", TrackChangesOutlinedIcon, "Objectives", "Objetivos"],
  ["psychoeducation", MenuBookOutlinedIcon, "Psychoeducation", "Psicoeducación"],
  ["intervention", SpaOutlinedIcon, "Intervention", "Intervención"],
  ["processing", ForumOutlinedIcon, "Processing", "Procesamiento"],
  ["closing", FavoriteBorderRoundedIcon, "Closing", "Cierre"],
] as const;

const SessionTwoTabs: React.FC<{ active: SessionTwoTab }> = ({ active }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const es = (i18n.resolvedLanguage || i18n.language).startsWith("es");
  return <Box component="nav" sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(4,1fr)", md: "repeat(7,1fr)" }, overflow: "hidden", bgcolor: "white", borderRadius: 3, boxShadow: "0 8px 22px rgba(55,35,115,.08)" }}>
    {tabs.map(([id, Icon, en, spanish]) => <Box component="button" type="button" key={id} onClick={() => navigate(id === "introduction" ? "/mission/sessions/2" : `/mission/sessions/2/${id}`)} sx={{ border: 0, borderBottom: id === active ? "4px solid #7650b3" : "4px solid transparent", bgcolor: "transparent", color: id === active ? "#7650b3" : "#211866", py: 1.5, cursor: "pointer" }}><Icon sx={{ fontSize: 29 }} /><Typography sx={{ fontSize: 10, fontWeight: 800 }}>{(es ? spanish : en).toUpperCase()}</Typography></Box>)}
  </Box>;
};
export default SessionTwoTabs;
