import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import LogoBadge from "../../landing/LogoBadge";
import SessionOneTabs from "./SessionOneTabs";
import CurriculumStepNavigation from "./CurriculumStepNavigation";

const SERIF = '"Inter", "Segoe UI", Arial, sans-serif';
const TITLE_FONT = '"Playfair Display", Georgia, "Times New Roman", serif';
const INK = "#151c5c";
const PURPLE = "#6540b2";
const CARD = "rgba(255,255,255,.72)";
type Lang = "en" | "es";
const copy = (lang: Lang, en: string, es: string) => lang === "es" ? es : en;

const objectiveCopy = {
  es: [
    { icon: ShieldOutlinedIcon, title: "1. Crear seguridad psicológica.", body: "Establecer un espacio de confianza donde cada persona pueda sentirse escuchada, respetada y acompañada." },
    { icon: PeopleOutlineRoundedIcon, title: "2. Favorecer la conexión entre los participantes.", body: "Promover la empatía, el respeto y el apoyo mutuo para fortalecer el sentido de pertenencia y comunidad." },
    { icon: FavoriteBorderRoundedIcon, title: "3. Validar el impacto del trauma vicario.", body: "Reconocer y normalizar las reacciones emocionales y físicas que pueden surgir al acompañar el sufrimiento de otros." },
    { icon: ChatBubbleOutlineRoundedIcon, title: "4. Diferenciar entre estar informado y estar emocionalmente sobreexpuesto.", body: "Comprender la diferencia entre informarse para ayudar y absorber el dolor de los demás sin límites sanos." },
    { icon: PsychologyOutlinedIcon, title: "5. Normalizar las respuestas iniciales ante una crisis.", body: "Entender que las reacciones que experimentamos ante situaciones difíciles son humanas y esperables." },
    { icon: VolunteerActivismOutlinedIcon, title: "6. Promover la vulnerabilidad como una herramienta para el procesamiento emocional y la conexión humana.", body: "Invitar a abrirnos desde un lugar seguro para sanar, comprendernos y conectar auténticamente." },
  ],
  en: [
    { icon: ShieldOutlinedIcon, title: "1. Create psychological safety.", body: "Establish a space of trust where each person can feel heard, respected, and accompanied." },
    { icon: PeopleOutlineRoundedIcon, title: "2. Foster connection among participants.", body: "Promote empathy, respect, and mutual support to strengthen a sense of belonging and community." },
    { icon: FavoriteBorderRoundedIcon, title: "3. Validate the impact of vicarious trauma.", body: "Recognize and normalize the emotional and physical reactions that can arise when accompanying the suffering of others." },
    { icon: ChatBubbleOutlineRoundedIcon, title: "4. Distinguish between being informed and being emotionally overexposed.", body: "Understand the difference between informing ourselves to help and absorbing others' pain without healthy limits." },
    { icon: PsychologyOutlinedIcon, title: "5. Normalize the initial responses to a crisis.", body: "Understand that the reactions we experience in difficult situations are human and expected." },
    { icon: VolunteerActivismOutlinedIcon, title: "6. Promote vulnerability as a tool for emotional processing and human connection.", body: "Invite us to open up from a safe place to heal, understand ourselves, and connect authentically." },
  ],
};

const MissionObjectivesPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";
  const objectives = objectiveCopy[lang];

  return <Box data-language-switcher sx={{ minHeight: "100dvh", color: INK, bgcolor: "#f4f0fa", backgroundImage: "radial-gradient(circle at 12% 55%,rgba(136,94,193,.08),transparent 32%),radial-gradient(circle at 88% 70%,rgba(136,94,193,.07),transparent 30%)" }}>
    <Box component="header" sx={{ position: "relative", overflow: "hidden", color: "white", textAlign: "center", background: "radial-gradient(circle at 50% 44%,#292455 0%,#17173d 48%,#10122f 100%)", pb: { xs: 9, md: 10.5 }, "&::after": { content: '""', position: "absolute", left: "-5%", right: "-5%", bottom: -45, height: 80, bgcolor: "#f4f0fa", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" } }}>
      <Container maxWidth="xl" sx={{ pt: 2.25, position: "relative", zIndex: 1 }}>
        <Box sx={{ maxWidth: 820, mx: "auto", pt: { xs: 6, md: 4.5 } }}><Button onClick={() => navigate("/mission/sessions/1")} sx={{ color: "#c9b8e6", fontSize: 11, fontWeight: 700, mb: 1.5 }}>{copy(lang, "‹ Back to Session 1", "‹ Volver a Sesión 1")}</Button><Box sx={{ display: "inline-block", bgcolor: PURPLE, px: 3.2, py: .8, borderRadius: 99, fontSize: 15, fontWeight: 800, letterSpacing: 1.2 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box><Typography component="h1" sx={{ fontFamily: TITLE_FONT, fontSize: { xs: 44, sm: 58, md: 66 }, fontWeight: 500, lineHeight: 1, mt: 2.25 }}>{copy(lang, "Session objectives", "Objetivos de la sesión")}</Typography><Typography sx={{ fontFamily: SERIF, fontSize: { xs: 18, md: 21 }, mt: 1.6 }}>{copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}</Typography><Typography sx={{ maxWidth: 680, mx: "auto", mt: 2.25, fontSize: { xs: 15, md: 17 }, lineHeight: 1.6, color: "rgba(255,255,255,.92)" }}>{copy(lang, "These objectives will guide us to create a safe space, understand what we have experienced, and strengthen connection among everyone.", "Estos objetivos nos guiarán para crear un espacio seguro, comprender lo vivido y fortalecer la conexión entre todos.")}</Typography></Box>
      </Container>
    </Box>

    <Container maxWidth="xl" sx={{ mt: { xs: -3, md: -4 }, pb: 2, position: "relative", zIndex: 2 }}>
      <Box sx={{ mb: 2.5 }}><SessionOneTabs active="objectives" /><CurriculumStepNavigation session={1} active="objectives" /></Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "275px minmax(0,1fr)" }, gap: 2, alignItems: "stretch" }}>
        <Box component="aside" sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 390, md: 0 }, height: "100%", borderRadius: 3, p: 3, textAlign: "center", backgroundImage: "linear-gradient(rgba(255,246,250,.77),rgba(231,222,248,.72)),url('/pillars/mission-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <Box sx={{ bgcolor: PURPLE, color: "white", borderRadius: 2, py: 1, fontWeight: 800, fontSize: 20 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box>
          <Typography sx={{ fontFamily: TITLE_FONT, fontSize: 34, lineHeight: 1.2, mt: 3 }}>{copy(lang, "Creating safety and connection", "Creando seguridad y conexión")}</Typography>
          <Box sx={{ borderTop: "1px solid rgba(80,54,150,.2)", my: 3 }} />
          <Typography sx={{ color: PURPLE, fontSize: 11, fontWeight: 800 }}>{copy(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}</Typography>
          <Typography sx={{ fontWeight: 700, lineHeight: 1.5, mt: 1 }}>{copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}</Typography>
          <Box sx={{ bgcolor: "rgba(255,255,255,.72)", borderRadius: 3, p: 2, mt: 3, textAlign: "left" }}>
            <TrackChangesOutlinedIcon sx={{ color: PURPLE, fontSize: 31 }} />
            <Typography sx={{ fontFamily: SERIF, color: PURPLE, fontSize: 19, fontWeight: 600, mt: .5 }}>{copy(lang, "Why have clear objectives?", "¿Por qué tener objetivos claros?")}</Typography>
            <Typography sx={{ mt: .7, fontSize: 12, lineHeight: 1.5 }}>{copy(lang, "They give direction to our group work, help us focus on what matters, and give each step a meaningful purpose.", "Dan dirección al trabajo grupal, nos ayudan a enfocarnos en lo importante y dan a cada paso un propósito significativo.")}</Typography>
          </Box>
          <Box sx={{ bgcolor: "rgba(244,239,251,.9)", borderLeft: `4px solid ${PURPLE}`, borderRadius: 3, p: 2, mt: 2, textAlign: "left" }}>
            <StarBorderRoundedIcon sx={{ color: PURPLE, fontSize: 30 }} />
            <Typography sx={{ fontFamily: SERIF, color: PURPLE, fontSize: 19, fontWeight: 600 }}>{copy(lang, "Important reminder", "Recordatorio importante")}</Typography>
            <Typography sx={{ mt: .7, fontSize: 11.5, lineHeight: 1.45 }}>{copy(lang, "Each objective is a guide, not a demand. Small, conscious steps support individual and group well-being.", "Cada objetivo es una guía, no una exigencia. Los pequeños pasos conscientes apoyan el bienestar individual y grupal.")}</Typography>
          </Box>
        </Box>

        <Box component="main" sx={{ bgcolor: CARD, border: "1px solid rgba(69,45,143,.15)", borderRadius: 3, p: { xs: 2.5, md: 4 }, minWidth: 0 }}>
          <Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: 25, md: 29 }, lineHeight: 1.1, color: INK }}>{copy(lang, "Objectives", "Objetivos")}</Typography>
          <Typography sx={{ mt: .5, mb: 3 }}>{copy(lang, "What we hope to accomplish in this session.", "Lo que buscamos lograr en esta sesión.")}</Typography>

          <Box sx={{ display: "grid", gap: 1.5 }}>
            {objectives.map(({ title, body }, index) => <Box key={title} sx={{ minHeight: 105, display: "flex", alignItems: "center", gap: 2.5, p: 2.25, bgcolor: "rgba(255,255,255,.86)", border: "1px solid rgba(69,45,143,.14)", borderRadius: 3 }}><Box sx={{ width: 56, height: 56, flexShrink: 0, borderRadius: "50%", bgcolor: "#eee7fa", color: PURPLE, display: "grid", placeItems: "center", fontFamily: SERIF, fontSize: 25 }}>{index + 1}</Box><Box><Typography sx={{ fontFamily: SERIF, color: PURPLE, fontSize: 18, fontWeight: 600, lineHeight: 1.25 }}>{title.replace(/^\d+\.\s*/, "")}</Typography><Typography sx={{ fontSize: 13, lineHeight: 1.55, mt: .5 }}>{body}</Typography></Box></Box>)}
          </Box>

        </Box>
      </Box>
    </Container>

  </Box>;
};

export default MissionObjectivesPage;
