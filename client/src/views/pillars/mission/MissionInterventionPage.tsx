import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SessionOneTabs from "./SessionOneTabs";

const SERIF = '"Inter", "Segoe UI", Arial, sans-serif';
const TITLE_FONT = '"Playfair Display", Georgia, "Times New Roman", serif';
const INK = "#151c5c";
const PURPLE = "#6540b2";
type Lang = "en" | "es";
const copy = (lang: Lang, en: string, es: string) => lang === "es" ? es : en;

const interventionCopy = {
  es: [
    "Identificar aquello que puedo controlar y aquello que no puedo controlar.",
    "Practicar la presencia radical.",
    "Aceptar la vulnerabilidad como parte de la experiencia humana.",
    "Utilizar técnicas basadas en evidencia para la regulación emocional, como respiración consciente, grounding mediante los cinco sentidos u otros ejercicios de estabilización.",
  ],
  en: [
    "Identify what I can control and what I cannot control.",
    "Practice radical presence.",
    "Accept vulnerability as part of the human experience.",
    "Use evidence-based emotional regulation techniques, such as mindful breathing, five-senses grounding, or other stabilization exercises.",
  ],
};

const MissionInterventionPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";
  const items = interventionCopy[lang];

  return <Box data-language-switcher sx={{ minHeight: "100dvh", color: INK, bgcolor: "#f4f0fa" }}>
    <Box component="header" sx={{ position: "relative", overflow: "hidden", color: "white", textAlign: "center", background: "radial-gradient(circle at 50% 44%,#292455 0%,#17173d 48%,#10122f 100%)", pb: { xs: 9, md: 10.5 }, "&::after": { content: '""', position: "absolute", left: "-5%", right: "-5%", bottom: -45, height: 80, bgcolor: "#f4f0fa", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" } }}>
      <Container maxWidth="xl" sx={{ pt: 2.25, position: "relative", zIndex: 1 }}>
        <Box sx={{ maxWidth: 820, mx: "auto", pt: { xs: 6, md: 4.5 } }}>
          <Button onClick={() => navigate("/mission/sessions/1")} sx={{ color: "#c9b8e6", fontSize: 11, fontWeight: 700, mb: 1.5 }}>{copy(lang, "‹ Back to Session 1", "‹ Volver a Sesión 1")}</Button>
          <Box sx={{ display: "inline-block", bgcolor: PURPLE, px: 3.2, py: .8, borderRadius: 99, fontSize: 15, fontWeight: 800 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box>
          <Typography component="h1" sx={{ fontFamily: TITLE_FONT, fontSize: { xs: 44, sm: 58, md: 66 }, fontWeight: 500, lineHeight: 1, mt: 2.25 }}>{copy(lang, "Intervention", "Intervención")}</Typography>
          <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 18, md: 21 }, mt: 1.6 }}>{copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}</Typography>
          <Typography sx={{ maxWidth: 680, mx: "auto", mt: 2.25, fontSize: { xs: 15, md: 17 }, color: "rgba(255,255,255,.92)" }}>{copy(lang, "Practical activities for processing the experience through care and connection.", "Actividades prácticas para procesar la experiencia desde el cuidado y la conexión.")}</Typography>
        </Box>
      </Container>
    </Box>

    <Container maxWidth="xl" sx={{ mt: { xs: -3, md: -4 }, pb: 2, position: "relative", zIndex: 2 }}>
      <Box sx={{ mb: 2.5 }}><SessionOneTabs active="intervention" /></Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "275px minmax(0,1fr)" }, gap: 2, alignItems: "stretch" }}>
        <Box component="aside" sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 390, md: 760 }, borderRadius: 3, p: 3, textAlign: "center", backgroundImage: "linear-gradient(rgba(255,246,250,.77),rgba(231,222,248,.72)),url('/pillars/mission-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <Box sx={{ bgcolor: PURPLE, color: "white", borderRadius: 2, py: 1, fontWeight: 800, fontSize: 20 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box>
          <Typography sx={{ fontFamily: TITLE_FONT, fontSize: 34, lineHeight: 1.2, mt: 3 }}>{copy(lang, "Creating safety and connection", "Creando seguridad y conexión")}</Typography>
          <Box sx={{ borderTop: "1px solid rgba(80,54,150,.2)", my: 3 }} />
          <Typography sx={{ color: PURPLE, fontSize: 11, fontWeight: 800 }}>{copy(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}</Typography>
          <Typography sx={{ fontWeight: 700, lineHeight: 1.5, mt: 1 }}>{copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}</Typography>
          <Box sx={{ position: { md: "absolute" }, bottom: 38, left: 28, right: 28, bgcolor: "rgba(255,255,255,.7)", borderRadius: 3, p: 2.5, mt: 5 }}>
            <FavoriteBorderRoundedIcon sx={{ color: PURPLE, fontSize: 38 }} />
            <Typography sx={{ fontWeight: 700, lineHeight: 1.55, mt: 1 }}>{copy(lang, "This is a space to accompany one another with respect, compassion, and humanity.", "Este es un espacio para acompañarnos con respeto, compasión y humanidad.")}</Typography>
          </Box>
        </Box>

        <Box component="main" sx={{ bgcolor: "rgba(255,255,255,.72)", border: "1px solid rgba(69,45,143,.15)", borderRadius: 3, p: { xs: 2.5, md: 4 }, minWidth: 0 }}>
          <Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: 34, md: 40 } }}>{copy(lang, "Intervention", "Intervención")}</Typography>
          <Typography sx={{ mt: .5, mb: 3, fontSize: 18, fontWeight: 700, color: PURPLE }}>{copy(lang, "Focused on:", "Enfocada en:")}</Typography>
          <Box sx={{ display: "grid", gap: 1.8 }}>
            {items.map((text, index) => <Box key={text} sx={{ minHeight: 112, display: "flex", alignItems: "center", gap: 2.5, p: 2.5, bgcolor: "rgba(255,255,255,.88)", border: "1px solid rgba(69,45,143,.14)", borderRadius: 3 }}>
              <Box sx={{ width: 58, height: 58, flexShrink: 0, borderRadius: "50%", bgcolor: "#eee7fa", color: PURPLE, display: "grid", placeItems: "center", fontFamily: SERIF, fontSize: 26 }}>{index + 1}</Box>
              <Typography sx={{ fontSize: { xs: 15, md: 17 }, lineHeight: 1.55, fontWeight: 600 }}>{text}</Typography>
            </Box>)}
          </Box>
        </Box>
      </Box>
    </Container>

    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1.5, bgcolor: "rgba(232,224,247,.82)", py: 2 }}>
      <Button onClick={() => navigate("/mission/sessions/1/processing")} variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{ bgcolor: PURPLE, borderRadius: 99, px: 3 }}>{copy(lang, "CONTINUE TO PROCESSING", "CONTINUAR A PROCESAMIENTO")}</Button>
      <Button onClick={() => navigate("/mission")} variant="outlined" startIcon={<AppsRoundedIcon />} sx={{ borderColor: PURPLE, color: INK, borderRadius: 99, px: 3 }}>{copy(lang, "CURRICULUM INDEX", "IR AL ÍNDICE DEL CURRÍCULO")}</Button>
    </Box>
    <Box component="footer" sx={{ bgcolor: "white", display: "flex", justifyContent: "center", alignItems: "center", gap: 1, py: .7 }}><InfoOutlinedIcon sx={{ fontSize: 17 }} /><Typography sx={{ fontSize: 11 }}>{copy(lang, "Therapeutic approach: Trauma-Informed Care (TIC), Mindfulness and ACT", "Enfoque terapéutico: Atención Informada por Trauma (TIC), Mindfulness y ACT")}</Typography></Box>
  </Box>;
};

export default MissionInterventionPage;
