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

export type SessionOneTab = "presentation" | "concepts" | "objectives" | "psychoeducation" | "intervention" | "processing" | "closing";
const PURPLE = "#7650b3";
const INK = "#211866";

const tabs = [
  { id: "presentation", icon: SpaOutlinedIcon, en: "Introduction", es: "Introducción", path: "/mission/sessions/1" },
  { id: "concepts", icon: LightbulbOutlinedIcon, en: "Concepts", es: "Conceptos", path: "/mission/sessions/1/concepts" },
  { id: "objectives", icon: TrackChangesOutlinedIcon, en: "Objectives", es: "Objetivos", path: "/mission/sessions/1/objectives" },
  { id: "psychoeducation", icon: MenuBookOutlinedIcon, en: "Psychoeducation", es: "Psicoeducación", path: "/mission/sessions/1/psychoeducation" },
  { id: "intervention", icon: SpaOutlinedIcon, en: "Intervention", es: "Intervención", path: "/mission/sessions/1/intervention" },
  { id: "processing", icon: ForumOutlinedIcon, en: "Processing", es: "Procesamiento", path: "/mission/sessions/1/processing" },
  { id: "closing", icon: FavoriteBorderRoundedIcon, en: "Closing", es: "Cierre", path: "/mission/sessions/1/closing" },
] as const;

const SessionOneTabs: React.FC<{ active: SessionOneTab }> = ({ active }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language).startsWith("es");
  return <Box component="nav" aria-label={spanish ? "Secciones de la sesión" : "Session sections"} sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(4,1fr)", md: "repeat(7,1fr)" }, overflow: "hidden", bgcolor: "#fff", borderRadius: 3, boxShadow: "0 8px 22px rgba(55,35,115,.08)" }}>
    {tabs.map(({ id, icon: Icon, en, es, path }) => { const selected = id === active; return <Box component="button" type="button" key={id} aria-current={selected ? "page" : undefined} onClick={() => navigate(path)} sx={{ appearance: "none", border: 0, borderBottom: selected ? `4px solid ${PURPLE}` : "4px solid transparent", bgcolor: "transparent", color: selected ? PURPLE : INK, textAlign: "center", py: 1.5, px: .5, cursor: "pointer", transition: "color .2s ease, border-color .2s ease", "&:hover": { color: PURPLE }, "&:focus-visible": { outline: `2px solid ${PURPLE}`, outlineOffset: -2 } }}><Icon sx={{ fontSize: 29 }} /><Typography sx={{ fontSize: 10, fontWeight: 800, mt: .35 }}>{(spanish ? es : en).toUpperCase()}</Typography></Box>; })}
  </Box>;
};

export default SessionOneTabs;
