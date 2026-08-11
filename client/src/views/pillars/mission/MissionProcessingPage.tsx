import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import SessionOneTabs from "./SessionOneTabs";
import CurriculumStepNavigation from "./CurriculumStepNavigation";

const SERIF = '"Inter", "Segoe UI", Arial, sans-serif';
const TITLE_FONT = '"Playfair Display", Georgia, "Times New Roman", serif';
const INK = "#151c5c";
const PURPLE = "#6540b2";
const PINK = "#a64b9d";
type Lang = "en" | "es";
const copy = (lang: Lang, en: string, es: string) => lang === "es" ? es : en;

const questionCopy = {
  es: [
    "¿Qué descubriste de ti durante esta actividad?",
    "¿Qué significa para ti permitirte ser vulnerable?",
    "¿Qué emoción apareció primero?",
    "¿Qué fue lo más difícil de reconocer?",
    "¿Qué puedes controlar hoy?",
    "¿Qué apoyo necesitas en este momento?",
    "¿Qué estrategia te gustaría practicar esta semana cuando aparezca la incertidumbre?",
  ],
  en: [
    "What did you discover about yourself during this activity?",
    "What does allowing yourself to be vulnerable mean to you?",
    "What emotion appeared first?",
    "What was the most difficult thing to recognize?",
    "What can you control today?",
    "What support do you need right now?",
    "What strategy would you like to practice this week when uncertainty appears?",
  ],
};

const MissionProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";
  const questions = questionCopy[lang];
  const [crossedOut, setCrossedOut] = React.useState<Set<number>>(() => new Set());

  const toggleQuestion = (index: number) => {
    setCrossedOut((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return <Box data-language-switcher sx={{ minHeight: "100dvh", color: INK, bgcolor: "#f4f0fa" }}>
    <Box component="header" sx={{ position: "relative", overflow: "hidden", color: "white", textAlign: "center", background: "radial-gradient(circle at 50% 44%,#292455 0%,#17173d 48%,#10122f 100%)", pb: { xs: 9, md: 10.5 }, "&::after": { content: '""', position: "absolute", left: "-5%", right: "-5%", bottom: -45, height: 80, bgcolor: "#f4f0fa", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" } }}>
      <Container maxWidth="xl" sx={{ pt: 2.25, position: "relative", zIndex: 1 }}>
        <Box sx={{ maxWidth: 820, mx: "auto", pt: { xs: 6, md: 4.5 } }}>
          <Button onClick={() => navigate("/mission/sessions/1")} sx={{ color: "#c9b8e6", fontSize: 11, fontWeight: 700, mb: 1.5 }}>{copy(lang, "‹ Back to Session 1", "‹ Volver a Sesión 1")}</Button>
          <Box sx={{ display: "inline-block", bgcolor: PURPLE, px: 3.2, py: .8, borderRadius: 99, fontSize: 15, fontWeight: 800 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box>
          <Typography component="h1" sx={{ fontFamily: TITLE_FONT, fontSize: { xs: 44, sm: 58, md: 66 }, fontWeight: 500, lineHeight: 1, mt: 2.25 }}>{copy(lang, "Processing", "Procesamiento")}</Typography>
          <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 18, md: 21 }, mt: 1.6 }}>{copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}</Typography>
          <Typography sx={{ maxWidth: 680, mx: "auto", mt: 2.25, fontSize: { xs: 15, md: 17 }, color: "rgba(255,255,255,.92)" }}>{copy(lang, "A space to reflect, share, and find meaning in the experience.", "Un espacio para reflexionar, compartir y encontrar significado en la experiencia.")}</Typography>
        </Box>
      </Container>
    </Box>

    <Container maxWidth="xl" sx={{ mt: { xs: -3, md: -4 }, pb: 2, position: "relative", zIndex: 2 }}>
      <Box sx={{ mb: 2.5 }}><SessionOneTabs active="processing" /><CurriculumStepNavigation session={1} active="processing" /></Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "275px minmax(0,1fr)" }, gap: 2, alignItems: "stretch" }}>
        <Box component="aside" sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 390, md: 0 }, height: "100%", borderRadius: 3, p: 3, textAlign: "center", backgroundImage: "linear-gradient(rgba(255,246,250,.77),rgba(231,222,248,.72)),url('/pillars/mission-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
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
          <Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: 25, md: 29 }, lineHeight: 1.1, color: INK }}>{copy(lang, "Processing", "Procesamiento")}</Typography>
          <Typography sx={{ mt: .5 }}>{copy(lang, "A space to reflect, share, and find meaning in the experience.", "Espacio para reflexionar, compartir y encontrar significado en la experiencia.")}</Typography>
          <Box sx={{ bgcolor: "#e9ddf8", borderRadius: 99, py: 1.2, px: 2, my: 3, textAlign: "center" }}>
            <Typography sx={{ fontFamily: SERIF, fontSize: 20, fontWeight: 400 }}>{copy(lang, "Suggested questions", "Preguntas sugeridas")}</Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2,minmax(0,1fr))" }, gap: 2 }}>
            {questions.map((question, index) => <Box component="button" type="button" aria-pressed={crossedOut.has(index)} onClick={() => toggleQuestion(index)} key={question} sx={{ width: "100%", minHeight: 105, alignSelf: "start", display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, px: 2.5, py: 1.75, textAlign: "center", font: "inherit", cursor: "pointer", bgcolor: index % 2 ? "rgba(253,242,249,.9)" : "rgba(246,241,253,.94)", border: `1px solid ${index % 2 ? "rgba(166,75,157,.2)" : "rgba(101,64,178,.18)"}`, borderRadius: 3, transition: "opacity .2s ease, transform .2s ease", "&:hover": { transform: "translateY(-1px)" }, "&:focus-visible": { outline: `3px solid ${PURPLE}`, outlineOffset: 2 }, opacity: crossedOut.has(index) ? .62 : 1 }}>
              <FormatQuoteRoundedIcon sx={{ alignSelf: "flex-start", color: index % 2 ? PINK : PURPLE, opacity: .8 }} />
              <Typography sx={{ fontFamily: SERIF, color: index % 2 ? PINK : INK, fontSize: 16, lineHeight: 1.45, fontWeight: 700, textDecoration: crossedOut.has(index) ? "line-through" : "none", textDecorationThickness: "2px" }}>{question}</Typography>
            </Box>)}
            <Box sx={{ gridColumn: "1 / -1", width: "100%", p: 2.5, border: "1px solid rgba(101,64,178,.18)", borderRadius: 3, bgcolor: "#f0e9fa", boxShadow: "0 8px 22px rgba(67,45,126,.06)", "& .MuiTypography-root": { fontWeight: 700 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ width: 52, height: 52, flexShrink: 0, borderRadius: "50%", bgcolor: "#eee7fa", color: PURPLE, display: "grid", placeItems: "center" }}><LightbulbOutlinedIcon sx={{ fontSize: 31 }} /></Box>
                <Box><Typography sx={{ color: PURPLE, fontSize: 12, fontWeight: 800, letterSpacing: .6 }}>{copy(lang, "QUICK TIP", "CONSEJO RÁPIDO")}</Typography><Typography sx={{ color: PURPLE, fontSize: 20, fontWeight: 800 }}>{copy(lang, "GROUP COHESION", "COHESIÓN GRUPAL")}</Typography></Box>
              </Box>
              <Typography sx={{ mt: 1.5, fontSize: 13, lineHeight: 1.55 }}>{copy(lang, "Inspired by Irvin Yalom’s Theory of Group Psychotherapy.", "Inspirado en la Teoría de Psicoterapia de Grupo de Irvin Yalom.")}</Typography>
              <Box sx={{ display: "flex", gap: 1.25, mt: 2, pt: 2, borderTop: "1px solid rgba(101,64,178,.16)" }}><GroupsOutlinedIcon sx={{ color: PURPLE, flexShrink: 0 }} /><Typography sx={{ fontSize: 13, lineHeight: 1.55 }}>{copy(lang, "Cohesion grows when members feel belonging, acceptance, trust, and connection. Yalom viewed this connection as a key therapeutic factor supporting participation, mutual support, and deeper healing.", "La cohesión crece cuando los miembros sienten pertenencia, aceptación, confianza y conexión. Yalom consideraba esta conexión un factor terapéutico clave que favorece la participación, el apoyo mutuo y una sanación más profunda.")}</Typography></Box>
              <Box sx={{ display: "flex", gap: 1.25, mt: 2, p: 1.75, bgcolor: "rgba(238,231,250,.72)", borderRadius: 2 }}><SpaOutlinedIcon sx={{ color: PURPLE, flexShrink: 0 }} /><Typography sx={{ fontSize: 13, lineHeight: 1.55 }}><Box component="strong" sx={{ color: PURPLE }}>{copy(lang, "Facilitator reminder: ", "Recordatorio para quien facilita: ")}</Box>{copy(lang, "You are not just guiding the process—you are cultivating connection. Create moments for everyone to feel seen, heard, and valued.", "No solo está guiando el proceso; está cultivando la conexión. Cree momentos para que todas las personas se sientan vistas, escuchadas y valoradas.")}</Typography></Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>

  </Box>;
};

export default MissionProcessingPage;
