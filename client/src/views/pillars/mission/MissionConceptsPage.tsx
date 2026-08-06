import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
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

const conceptCopy = {
  es: [
    { title: "1. Vulnerabilidad", lead: "La vulnerabilidad es una fortaleza, no una debilidad.", body: "Ser vulnerable significa permitirnos sentir y mostrarnos tal como somos. En contextos de crisis, reconocer nuestra vulnerabilidad nos ayuda a pedir apoyo, conectar con otros y recuperar nuestra humanidad.", prompts: ["¿Qué me hace sentir vulnerable en este momento?", "¿Cómo puede mi vulnerabilidad abrirme a la conexión y al apoyo?"] },
    { title: "2. Trauma vicario", lead: "Personas afectadas directa e indirectamente por el terremoto.", body: "El trauma vicario ocurre cuando el dolor de otros nos impacta profundamente. Ver, escuchar o acompañar el sufrimiento de familiares, amigos o comunidades puede generar síntomas emocionales y físicos. Lo que sientes es real y válido.", prompts: ["¿De qué maneras me ha impactado lo que vivieron otras personas?", "¿Qué señales en mi cuerpo o emociones me indican que necesito cuidarme?"] },
    { title: "3. ¿Y ahora qué?", lead: "La incertidumbre es natural, pero podemos tomar pequeños pasos.", body: "Después de un evento tan impactante, es común sentir confusión, tristeza, enojo, culpa o vacío. No hay una forma “correcta” de sentir. La pregunta “¿Y ahora qué?” nos invita a enfocarnos en lo que sí está en nuestras manos: cuidarnos, pedir apoyo y avanzar un paso a la vez.", prompts: ["¿Qué necesito hoy para sentirme un poco más en calma?", "¿Cuál es un pequeño paso que puedo dar por mí mismo(a) esta semana?"] },
  ],
  en: [
    { title: "1. Vulnerability", lead: "Vulnerability is a strength, not a weakness.", body: "Being vulnerable means allowing ourselves to feel and show ourselves as we are. In a crisis, recognizing vulnerability helps us ask for support, connect with others, and recover our humanity.", prompts: ["What makes me feel vulnerable right now?", "How can my vulnerability open me to connection and support?"] },
    { title: "2. Vicarious trauma", lead: "People directly and indirectly affected by the earthquake.", body: "Vicarious trauma occurs when the pain of others affects us deeply. Seeing, hearing, or accompanying the suffering of family, friends, or communities can cause emotional and physical symptoms. What you feel is real and valid.", prompts: ["How has what other people experienced affected me?", "What signals in my body or emotions tell me I need care?"] },
    { title: "3. What now?", lead: "Uncertainty is natural, but we can take small steps.", body: "After such an impactful event, confusion, sadness, anger, guilt, or emptiness are common. There is no correct way to feel. “What now?” invites us to focus on what is in our hands: caring for ourselves, asking for support, and moving forward one step at a time.", prompts: ["What do I need today to feel a little calmer?", "What small step can I take for myself this week?"] },
  ],
};

const MissionConceptsPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";
  const concepts = conceptCopy[lang];
  const reminders = lang === "es"
    ? ["No estás solo(a). Muchas personas sienten lo mismo que tú.", "Tus emociones tienen sentido. Son respuestas humanas ante situaciones extraordinarias.", "Pedir ayuda es un acto de valentía, no de debilidad.", "La conexión con otros puede ser una fuente de sanación.", "Pequeñas acciones diarias pueden marcar una gran diferencia."]
    : ["You are not alone. Many people feel the same way.", "Your emotions make sense. They are human responses to extraordinary situations.", "Asking for help is an act of courage, not weakness.", "Connection with others can be a source of healing.", "Small daily actions can make a big difference."];
  const conceptItems = [
    {
      icon: FavoriteBorderRoundedIcon,
      text: copy(lang, "Vulnerability is a strength, not a weakness.", "La vulnerabilidad es una fortaleza, no una debilidad."),
    },
    {
      icon: ForumOutlinedIcon,
      text: copy(lang, "What now?", "¿Y ahora qué?"),
    },
    {
      icon: GroupsOutlinedIcon,
      text: copy(lang, "People indirectly affected by the earthquake; vicarious trauma.", "Afectados indirectos por el terremoto; trauma vicario."),
    },
  ];

  return <Box data-language-switcher sx={{ minHeight: "100dvh", color: INK, bgcolor: "#f4f0fa", backgroundImage: "radial-gradient(circle at 12% 55%,rgba(136,94,193,.08),transparent 32%),radial-gradient(circle at 88% 70%,rgba(136,94,193,.07),transparent 30%)" }}>
    <Box component="header" sx={{ position: "relative", overflow: "hidden", color: "white", textAlign: "center", background: "radial-gradient(circle at 50% 44%,#292455 0%,#17173d 48%,#10122f 100%)", pb: { xs: 9, md: 10.5 }, "&::after": { content: '""', position: "absolute", left: "-5%", right: "-5%", bottom: -45, height: 80, bgcolor: "#f4f0fa", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" } }}>
      <Container maxWidth="xl" sx={{ pt: 2.25, position: "relative", zIndex: 1 }}>
        <Box sx={{ maxWidth: 780, mx: "auto", pt: { xs: 6, md: 4.5 } }}><Box sx={{ display: "inline-block", bgcolor: PURPLE, px: 3.2, py: .8, borderRadius: 99, fontSize: 15, fontWeight: 800, letterSpacing: 1.2 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box><Typography component="h1" sx={{ fontFamily: TITLE_FONT, fontSize: { xs: 46, sm: 61, md: 68 }, fontWeight: 500, lineHeight: .98, mt: 2.25, whiteSpace: { md: "pre-line" } }}>{copy(lang, "Creating safety\nand connection", "Creando seguridad\ny conexión")}</Typography><Box sx={{ width: 42, borderTop: "1px solid rgba(255,255,255,.9)", mx: "auto", my: 2.5 }} /><Typography sx={{ fontSize: 11, letterSpacing: 1.3, color: "#c9b8e6" }}>{copy(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}</Typography><Typography sx={{ fontFamily: SERIF, fontSize: { xs: 18, md: 21 }, mt: .8 }}>{copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}</Typography></Box>
      </Container>
    </Box>

    <Container maxWidth="xl" sx={{ mt: { xs: -3, md: -4 }, pb: 2, position: "relative", zIndex: 2 }}>
      <Box sx={{ mb: 2.5 }}><SessionOneTabs active="concepts" /><CurriculumStepNavigation session={1} active="concepts" /></Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "275px minmax(0,1fr)" }, gap: 2, alignItems: "stretch" }}>
        <Box component="aside" sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 390, md: 760 }, borderRadius: 3, p: 3, textAlign: "center", backgroundImage: "linear-gradient(rgba(255,246,250,.77),rgba(231,222,248,.72)),url('/pillars/mission-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <Box sx={{ bgcolor: PURPLE, color: "white", borderRadius: 2, py: 1, fontWeight: 800, fontSize: 20 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box>
          <Typography sx={{ fontFamily: TITLE_FONT, fontSize: 34, lineHeight: 1.2, mt: 3 }}>{copy(lang, "Creating safety and connection", "Creando seguridad y conexión")}</Typography>
          <Box sx={{ borderTop: "1px solid rgba(80,54,150,.2)", my: 3 }} />
          <Typography sx={{ color: PURPLE, fontSize: 11, fontWeight: 800 }}>{copy(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}</Typography>
          <Typography sx={{ fontWeight: 700, lineHeight: 1.5, mt: 1 }}>{copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}</Typography>
          <Box sx={{ position: { md: "absolute" }, bottom: 40, left: 28, right: 28, bgcolor: "rgba(255,255,255,.66)", borderRadius: 3, p: 2.5, mt: 5 }}>
            <FavoriteBorderRoundedIcon sx={{ color: PURPLE, fontSize: 38 }} />
            <Typography sx={{ fontWeight: 700, lineHeight: 1.55, mt: 1 }}>{copy(lang, "This is a space to accompany one another with respect, compassion, and humanity.", "Este es un espacio para acompañarnos con respeto, compasión y humanidad.")}</Typography>
          </Box>
        </Box>

        <Box component="main" sx={{ bgcolor: CARD, border: "1px solid rgba(69,45,143,.15)", borderRadius: 3, p: { xs: 2.5, md: 4 } }}>
          <Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: 34, md: 40 }, color: INK }}>{copy(lang, "Concepts", "Conceptos")}</Typography>
          <Typography sx={{ mt: .5, mb: 4 }}>{copy(lang, "Key ideas for understanding safety, connection, and vicarious trauma.", "Ideas clave para comprender la seguridad, la conexión y el trauma vicario.")}</Typography>
          <Box sx={{ display: "grid", gap: 2 }}>
            {conceptItems.map(({ icon: Icon, text }) => (
              <Box key={text} sx={{ minHeight: 112, display: "flex", alignItems: "center", gap: 2.5, p: 2.5, bgcolor: "rgba(255,255,255,.82)", border: "1px solid rgba(69,45,143,.14)", borderRadius: 3, boxShadow: "0 8px 22px rgba(67,45,126,.03)" }}>
                <Box sx={{ width: 64, height: 64, flexShrink: 0, borderRadius: "50%", bgcolor: "#eee7fa", color: PURPLE, display: "grid", placeItems: "center" }}><Icon sx={{ fontSize: 34 }} /></Box>
                <Typography sx={{ fontSize: { xs: 17, md: 20 }, fontWeight: 700 }}>{text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>

    <Box sx={{ textAlign: "center", bgcolor: "rgba(232,224,247,.82)", py: 1.25 }}><Typography sx={{ fontSize: 12, fontWeight: 800 }}>{copy(lang, "READY TO CONTINUE?", "¿LISTO PARA CONTINUAR?")}</Typography><Typography sx={{ fontSize: 12 }}>{copy(lang, "Each session is one more step toward your well-being and that of those around you.", "Cada sesión es un paso más hacia tu bienestar y el de quienes te rodean.")}</Typography><Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1.5, mt: 1 }}><Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{ bgcolor: PURPLE, borderRadius: 99, px: 3, fontSize: 11 }}>{copy(lang, "CONTINUE TO PSYCHOEDUCATION", "CONTINUAR A PSICOEDUCACIÓN")}</Button><Button onClick={() => navigate("/mission")} variant="outlined" startIcon={<AppsRoundedIcon />} sx={{ borderColor: PURPLE, color: INK, borderRadius: 99, px: 3, fontSize: 11 }}>{copy(lang, "CURRICULUM INDEX", "IR AL ÍNDICE DEL CURRÍCULO")}</Button></Box></Box>
    <Box component="footer" sx={{ bgcolor: "white", display: "flex", justifyContent: "center", alignItems: "center", gap: 1, py: .7 }}><InfoOutlinedIcon sx={{ fontSize: 17 }} /><Typography sx={{ fontSize: 11 }}>{copy(lang, "Therapeutic approach: Trauma-Informed Care (TIC), Mindfulness and ACT", "Enfoque terapéutico: Atención Informada por Trauma (TIC), Mindfulness y ACT")}</Typography></Box>
  </Box>;
};

export default MissionConceptsPage;
