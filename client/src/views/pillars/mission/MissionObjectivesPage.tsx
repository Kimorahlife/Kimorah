import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import HearingOutlinedIcon from "@mui/icons-material/HearingOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import LogoBadge from "../../landing/LogoBadge";
import SessionOneTabs from "./SessionOneTabs";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
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

const applyCopy = {
  es: [
    { icon: SpaOutlinedIcon, text: "Creando un espacio seguro y de respeto." },
    { icon: HearingOutlinedIcon, text: "Escuchando activamente y sin juicios." },
    { icon: FavoriteBorderRoundedIcon, text: "Validando nuestras emociones y las de los demás." },
    { icon: TrackChangesOutlinedIcon, text: "Abriendo la puerta a la reflexión, el aprendizaje y la sanación." },
  ],
  en: [
    { icon: SpaOutlinedIcon, text: "Creating a safe and respectful space." },
    { icon: HearingOutlinedIcon, text: "Listening actively and without judgment." },
    { icon: FavoriteBorderRoundedIcon, text: "Validating our emotions and those of others." },
    { icon: TrackChangesOutlinedIcon, text: "Opening the door to reflection, learning, and healing." },
  ],
};

const MissionObjectivesPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";
  const objectives = objectiveCopy[lang];
  const apply = applyCopy[lang];

  return <Box data-language-switcher sx={{ minHeight: "100dvh", color: INK, bgcolor: "#f4f0fa", backgroundImage: "radial-gradient(circle at 12% 55%,rgba(136,94,193,.08),transparent 32%),radial-gradient(circle at 88% 70%,rgba(136,94,193,.07),transparent 30%)" }}>
    <Box component="header" sx={{ position: "relative", overflow: "hidden", color: "white", textAlign: "center", background: "radial-gradient(circle at 50% 44%,#292455 0%,#17173d 48%,#10122f 100%)", pb: { xs: 9, md: 10.5 }, "&::after": { content: '""', position: "absolute", left: "-5%", right: "-5%", bottom: -45, height: 80, bgcolor: "#f4f0fa", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" } }}>
      <Container maxWidth="xl" sx={{ pt: 2.25, position: "relative", zIndex: 1 }}>
        <Box component="nav" sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          <Box onClick={() => navigate("/")} sx={{ display: "flex", alignItems: "center", cursor: "pointer", textAlign: "left" }}><LogoBadge size={{ xs: 50, md: 62 }} /><Box sx={{ ml: 1.25 }}><Typography sx={{ fontFamily: SERIF, fontSize: 17, letterSpacing: 4, lineHeight: 1 }}>KIMORAH</Typography><Typography sx={{ fontSize: 9, letterSpacing: .55, mt: .7 }}>{copy(lang, "PSYCHOEDUCATIONAL CURRICULUM", "CURRÍCULO PSICOEDUCATIVO")}</Typography></Box></Box>
          <Box sx={{ ml: "auto", display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 4 }}>
            {[[copy(lang, "Home", "Inicio"), "/"], [copy(lang, "Curriculum", "Currículo"), "/mission/sessions"], [copy(lang, "Therapeutic approach", "Enfoque terapéutico"), "/mission/sessions/1"], [copy(lang, "Professional resources", "Recursos profesionales"), "/mission"], [copy(lang, "About the program", "Acerca del programa"), "/mission/sessions"]].map(([label, href]) => <Button key={label} onClick={() => navigate(href)} sx={{ color: "white", fontSize: 10.5, fontWeight: 700, p: 0, minWidth: 0, whiteSpace: "nowrap" }}>{label}</Button>)}
            <Button onClick={() => navigate("/mission")} variant="contained" sx={{ bgcolor: PURPLE, borderRadius: 99, px: 2.25, py: 1.2, fontSize: 10, fontWeight: 800, boxShadow: "none" }}>{copy(lang, "FOR PROFESSIONALS", "PARA PROFESIONALES")}</Button>
          </Box>
        </Box>
        <Box sx={{ maxWidth: 820, mx: "auto", pt: { xs: 6, md: 4.5 } }}><Button onClick={() => navigate("/mission/sessions/1")} sx={{ color: "#c9b8e6", fontSize: 11, fontWeight: 700, mb: 1.5 }}>{copy(lang, "‹ Back to Session 1", "‹ Volver a Sesión 1")}</Button><Box sx={{ display: "inline-block", bgcolor: PURPLE, px: 3.2, py: .8, borderRadius: 99, fontSize: 15, fontWeight: 800, letterSpacing: 1.2 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box><Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: 44, sm: 58, md: 66 }, fontWeight: 500, lineHeight: 1, mt: 2.25 }}>{copy(lang, "Session objectives", "Objetivos de la sesión")}</Typography><Typography sx={{ fontFamily: SERIF, fontSize: { xs: 18, md: 21 }, mt: 1.6 }}>{copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}</Typography><Typography sx={{ maxWidth: 680, mx: "auto", mt: 2.25, fontSize: { xs: 15, md: 17 }, lineHeight: 1.6, color: "rgba(255,255,255,.92)" }}>{copy(lang, "These objectives will guide us to create a safe space, understand what we have experienced, and strengthen connection among everyone.", "Estos objetivos nos guiarán para crear un espacio seguro, comprender lo vivido y fortalecer la conexión entre todos.")}</Typography></Box>
      </Container>
    </Box>

    <Container maxWidth="lg" sx={{ mt: { xs: -3, md: -4 }, pb: 2, position: "relative", zIndex: 2 }}>
      <Box sx={{ mb: 2.5 }}><SessionOneTabs active="objectives" /></Box>

      <Box sx={{ display: "flex", gap: 2, p: { xs: 2, md: 3 }, mb: 1.5, bgcolor: CARD, border: "1px solid rgba(69,45,143,.15)", borderLeft: `4px solid ${PURPLE}`, borderRadius: 3 }}><Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: PURPLE, color: "white", display: "grid", placeItems: "center", flexShrink: 0 }}><TrackChangesOutlinedIcon /></Box><Box><Typography sx={{ fontFamily: SERIF, color: PURPLE, fontSize: 23, fontWeight: 600 }}>{copy(lang, "Why have clear objectives?", "¿Por qué tener objetivos claros?")}</Typography><Typography sx={{ mt: 1, fontSize: 13.5, lineHeight: 1.6 }}>{copy(lang, "Having objectives helps give direction to our group work. It lets us focus on what matters, measure our progress, and ensure that every step we take has a meaningful purpose.", "Tener objetivos nos ayuda a dar dirección a nuestro trabajo grupal. Nos permite enfocarnos en lo que importa, medir nuestro progreso y asegurarnos de que cada paso que demos tenga un propósito significativo.")}</Typography></Box></Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, mt: 3.5, mb: 2 }}><Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: PURPLE, color: "white", display: "grid", placeItems: "center" }}><TrackChangesOutlinedIcon /></Box><Typography component="h2" sx={{ fontFamily: SERIF, fontSize: { xs: 26, md: 30 }, color: PURPLE }}>{copy(lang, "Our objectives", "Nuestros objetivos")}</Typography></Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)" }, gap: 1.5, mb: 1.5 }}>{objectives.map(({ icon: Icon, title, body }) => <Box key={title} sx={{ display: "flex", gap: 2, p: { xs: 2.25, md: 2.75 }, bgcolor: CARD, border: "1px solid rgba(69,45,143,.15)", borderRadius: 3 }}><Box sx={{ width: 52, height: 52, flexShrink: 0, borderRadius: "50%", border: `1px solid rgba(101,64,178,.28)`, color: PURPLE, display: "grid", placeItems: "center" }}><Icon /></Box><Box><Typography sx={{ fontFamily: SERIF, color: PURPLE, fontSize: 18, fontWeight: 600, lineHeight: 1.25 }}>{title}</Typography><Typography sx={{ fontSize: 13, lineHeight: 1.6, mt: 1 }}>{body}</Typography></Box></Box>)}</Box>

      <Box sx={{ bgcolor: CARD, border: "1px solid rgba(69,45,143,.15)", borderRadius: 3, p: { xs: 2.25, md: 3 }, mb: 1.5 }}><Box sx={{ display: "flex", alignItems: "center", gap: 1.4, mb: 2.5 }}><Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: PURPLE, color: "white", display: "grid", placeItems: "center" }}><SpaOutlinedIcon /></Box><Typography sx={{ fontFamily: SERIF, fontSize: 22, color: PURPLE }}>{copy(lang, "How will we apply these objectives?", "¿Cómo aplicaremos estos objetivos?")}</Typography></Box><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(4,1fr)" } }}>{apply.map(({ icon: Icon, text }, index) => <Box key={text} sx={{ textAlign: "center", px: 2, py: 1, borderRight: { md: index < 3 ? "1px solid rgba(69,45,143,.14)" : 0 } }}><Box sx={{ color: PURPLE, mb: 1 }}><Icon sx={{ fontSize: 34 }} /></Box><Typography sx={{ fontSize: 12, lineHeight: 1.5 }}>{text}</Typography></Box>)}</Box></Box>

      <Box sx={{ display: "flex", gap: 2, p: { xs: 2, md: 3 }, bgcolor: CARD, border: "1px solid rgba(69,45,143,.15)", borderLeft: `4px solid ${PURPLE}`, borderRadius: 3 }}><Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: PURPLE, color: "white", display: "grid", placeItems: "center", flexShrink: 0 }}><StarBorderRoundedIcon /></Box><Box><Typography sx={{ fontFamily: SERIF, color: PURPLE, fontSize: 22, fontWeight: 600 }}>{copy(lang, "Important reminder", "Recordatorio importante")}</Typography><Typography sx={{ mt: 1, fontSize: 13.5, lineHeight: 1.6 }}>{copy(lang, "It is not about achieving everything in a single session, but about taking small, conscious steps that bring us closer to our well-being and the group's well-being. Each objective is a guide, not a demand.", "No se trata de lograrlo todo en una sola sesión, sino de dar pequeños pasos conscientes que nos acerquen a nuestro bienestar y al bienestar del grupo. Cada objetivo es una guía, no una exigencia.")}</Typography></Box></Box>
    </Container>

    <Box sx={{ textAlign: "center", bgcolor: "rgba(232,224,247,.82)", py: 1.25 }}><Typography sx={{ fontSize: 12, fontWeight: 800 }}>{copy(lang, "READY TO CONTINUE?", "¿LISTO PARA CONTINUAR?")}</Typography><Typography sx={{ fontSize: 12 }}>{copy(lang, "Each session is one more step toward your well-being and that of those around you.", "Cada sesión es un paso más hacia tu bienestar y el de quienes te rodean.")}</Typography><Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1.5, mt: 1 }}><Button onClick={() => navigate("/mission/sessions/1/psychoeducation")} variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{ bgcolor: PURPLE, borderRadius: 99, px: 3, fontSize: 11 }}>{copy(lang, "CONTINUE TO PSYCHOEDUCATION", "CONTINUAR A PSICOEDUCACIÓN")}</Button><Button onClick={() => navigate("/mission/sessions")} variant="outlined" startIcon={<AppsRoundedIcon />} sx={{ borderColor: PURPLE, color: INK, borderRadius: 99, px: 3, fontSize: 11 }}>{copy(lang, "CURRICULUM INDEX", "IR AL ÍNDICE DEL CURRÍCULO")}</Button></Box></Box>
    <Box component="footer" sx={{ bgcolor: "white", display: "flex", justifyContent: "center", alignItems: "center", gap: 1, py: .7 }}><InfoOutlinedIcon sx={{ fontSize: 17 }} /><Typography sx={{ fontSize: 11 }}>{copy(lang, "Therapeutic approach: Trauma-Informed Care (TIC), Mindfulness and ACT", "Enfoque terapéutico: Atención Informada por Trauma (TIC), Mindfulness y ACT")}</Typography></Box>
  </Box>;
};

export default MissionObjectivesPage;
