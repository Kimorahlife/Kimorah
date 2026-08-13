import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SelfImprovementOutlinedIcon from "@mui/icons-material/SelfImprovementOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import LogoBadge from "../../landing/LogoBadge";
import SessionOneTabs from "./SessionOneTabs";
import CurriculumStepNavigation from "./CurriculumStepNavigation";

const SERIF = '"Inter", "Segoe UI", Arial, sans-serif';
const TITLE_FONT = '"Playfair Display", Georgia, "Times New Roman", serif';
const INK = "#211866";
const PURPLE = "#7650b3";
const CARD = "rgba(255,255,255,.72)";
type Lang = "en" | "es";
const copy = (lang: Lang, en: string, es: string) => lang === "es" ? es : en;

const explainCopy = {
  es: [
    { icon: BalanceOutlinedIcon, title: "La diferencia entre preocupación y acción.", body: "Preocuparse es pensar en lo que podría pasar. Actuar es enfocarnos en lo que sí podemos hacer ahora." },
    { icon: PsychologyOutlinedIcon, title: "Cómo el cerebro busca recuperar la sensación de control", body: "Después de un evento traumático, nuestro cerebro intenta encontrar seguridad buscando respuestas, planeando o anticipando. Entender esto nos ayuda a ser más compasivos con nosotros mismos." },
    { icon: SelfImprovementOutlinedIcon, title: "La importancia de regresar al momento presente", body: "Cuando sentimos incertidumbre, la mente viaja al pasado o al futuro. Volver al presente nos ayuda a reducir la ansiedad y a reconectarnos con lo que sí es real y seguro ahora." },
    { icon: FavoriteBorderRoundedIcon, title: "La vulnerabilidad como una respuesta humana natural", body: "Frente a la incertidumbre, la pérdida y el sufrimiento, es normal sentirnos vulnerables. Reconocerlo no nos hace débiles, nos hace humanos." },
    { icon: VolunteerActivismOutlinedIcon, title: "Expresar emociones, pedir ayuda y reconocer nuestras necesidades", body: "No son señales de debilidad, sino de fortaleza y autocuidado. Nos permiten sanar, conectar y recibir el apoyo que necesitamos." },
  ],
  en: [
    { icon: BalanceOutlinedIcon, title: "The difference between worry and action.", body: "Worrying is thinking about what could happen. Acting is focusing on what we can do right now." },
    { icon: PsychologyOutlinedIcon, title: "How the brain tries to regain a sense of control", body: "After a traumatic event, our brain tries to find safety by seeking answers, planning, or anticipating. Understanding this helps us be more compassionate with ourselves." },
    { icon: SelfImprovementOutlinedIcon, title: "The importance of returning to the present moment", body: "When we feel uncertainty, the mind travels to the past or the future. Returning to the present helps us reduce anxiety and reconnect with what is real and safe now." },
    { icon: FavoriteBorderRoundedIcon, title: "Vulnerability as a natural human response", body: "In the face of uncertainty, loss, and suffering, it is normal to feel vulnerable. Recognizing it does not make us weak, it makes us human." },
    { icon: VolunteerActivismOutlinedIcon, title: "Expressing emotions, asking for help, and recognizing our needs", body: "These are not signs of weakness, but of strength and self-care. They allow us to heal, connect, and receive the support we need." },
  ],
};

const normalizeCopy = {
  es: [
    { icon: BedtimeOutlinedIcon, text: "Dificultad para dormir." },
    { icon: LoopRoundedIcon, text: "Pensamientos repetitivos." },
    { icon: FavoriteBorderRoundedIcon, text: "Culpa por estar lejos." },
    { icon: PersonOutlineRoundedIcon, text: "Sensación de impotencia." },
    { icon: Diversity3OutlinedIcon, text: "Necesidad de apoyo y conexión con otras personas." },
  ],
  en: [
    { icon: BedtimeOutlinedIcon, text: "Difficulty sleeping." },
    { icon: LoopRoundedIcon, text: "Repetitive thoughts." },
    { icon: FavoriteBorderRoundedIcon, text: "Guilt for being far away." },
    { icon: PersonOutlineRoundedIcon, text: "A sense of helplessness." },
    { icon: Diversity3OutlinedIcon, text: "A need for support and connection with others." },
  ],
};

const MissionPsychoeducationPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";
  const explain = explainCopy[lang];
  const normalize = normalizeCopy[lang];

  return <Box data-language-switcher sx={{ minHeight: "100dvh", color: INK, bgcolor: "#f4f0fa", backgroundImage: "radial-gradient(circle at 12% 55%,rgba(136,94,193,.08),transparent 32%),radial-gradient(circle at 88% 70%,rgba(136,94,193,.07),transparent 30%)" }}>
    <Box component="header" sx={{ position: "relative", overflow: "hidden", color: "white", textAlign: "center", background: "radial-gradient(circle at 50% 44%,#292455 0%,#17173d 48%,#10122f 100%)", pb: { xs: 9, md: 10.5 }, "&::after": { content: '""', position: "absolute", left: "-5%", right: "-5%", bottom: -45, height: 80, bgcolor: "#f4f0fa", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" } }}>
      <Container maxWidth="xl" sx={{ pt: 2.25, position: "relative", zIndex: 1 }}>
        <Box sx={{ maxWidth: 820, mx: "auto", pt: { xs: 6, md: 4.5 } }}><Button onClick={() => navigate("/mission/sessions/1")} sx={{ color: "#c9b8e6", fontSize: 11, fontWeight: 700, mb: 1.5 }}>{copy(lang, "‹ Back to Session 1", "‹ Volver a Sesión 1")}</Button><Box sx={{ display: "inline-block", bgcolor: PURPLE, px: 3.2, py: .8, borderRadius: 99, fontSize: 15, fontWeight: 800, letterSpacing: 1.2 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box><Typography component="h1" sx={{ fontFamily: TITLE_FONT, fontSize: { xs: 44, sm: 58, md: 66 }, fontWeight: 500, lineHeight: 1, mt: 2.25 }}>{copy(lang, "Psychoeducation", "Psicoeducación")}</Typography><Typography sx={{ fontFamily: SERIF, fontSize: { xs: 18, md: 21 }, mt: 1.6 }}>{copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}</Typography><Box sx={{ width: 48, height: 2, bgcolor: "rgba(255,255,255,.4)", mx: "auto", my: 2.25 }} /><Typography sx={{ maxWidth: 680, mx: "auto", fontSize: { xs: 15, md: 17 }, lineHeight: 1.6, color: "rgba(255,255,255,.92)" }}>{copy(lang, "What I can control and what I cannot control after a disaster.", "Lo que puedo controlar y lo que no puedo controlar después de un desastre.")}</Typography></Box>
      </Container>
    </Box>

    <Container maxWidth="xl" sx={{ mt: { xs: -3, md: -4 }, pb: 2, position: "relative", zIndex: 2 }}>
      <Box sx={{ mb: 2.5 }}><SessionOneTabs active="psychoeducation" /><CurriculumStepNavigation session={1} active="psychoeducation" /></Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "275px minmax(0,1fr)" }, gap: 2, alignItems: "stretch" }}>
        <Box component="aside" sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 390, md: 0 }, height: "100%", borderRadius: 3, p: 3, textAlign: "center", backgroundImage: "linear-gradient(rgba(255,246,250,.77),rgba(231,222,248,.72)),url('/pillars/mission-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
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

        <Box component="main" sx={{ bgcolor: CARD, border: "1px solid rgba(69,45,143,.15)", borderRadius: 3, p: { xs: 2.5, md: 4 }, minWidth: 0 }}>
          <Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: 25, md: 29 }, lineHeight: 1.1, color: INK }}>{copy(lang, "Psychoeducation", "Psicoeducación")}</Typography>
          <Typography sx={{ mt: .5, mb: 3 }}>{copy(lang, "What I can and cannot control after a disaster.", "Lo que puedo controlar y lo que no puedo controlar después de un desastre.")}</Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.1fr .9fr" }, gap: 2.5, alignItems: "start" }}>
            <Box sx={{ border: "1px solid rgba(69,45,143,.14)", borderRadius: 3, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}><Box sx={{ width: 42, height: 42, borderRadius: "50%", bgcolor: PURPLE, color: "white", display: "grid", placeItems: "center" }}><LightbulbOutlinedIcon /></Box><Typography sx={{ fontFamily: SERIF, fontSize: 25, color: PURPLE }}>{copy(lang, "Explain:", "Explicar:")}</Typography></Box>
              <Box sx={{ display: "grid", gap: 1.2 }}>
                {explain.map(({ icon: Icon, title, body }) => <Box key={title} sx={{ display: "flex", gap: 1.5, p: 1.7, bgcolor: "rgba(255,255,255,.86)", border: "1px solid rgba(69,45,143,.11)", borderRadius: 2.5 }}><Box sx={{ width: 46, height: 46, flexShrink: 0, borderRadius: "50%", bgcolor: "#eee7fa", color: PURPLE, display: "grid", placeItems: "center" }}><Icon /></Box><Box><Typography sx={{ color: PURPLE, fontSize: 15.5, fontWeight: 800, lineHeight: 1.3 }}>{title}</Typography><Typography sx={{ fontSize: 12.5, lineHeight: 1.5, mt: .45 }}>{body}</Typography></Box></Box>)}
              </Box>
            </Box>

            <Box sx={{ bgcolor: "#f4effb", border: "1px solid rgba(69,45,143,.12)", borderRadius: 3, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}><Diversity3OutlinedIcon sx={{ color: PURPLE, fontSize: 34 }} /><Typography sx={{ fontFamily: SERIF, fontSize: 23, color: PURPLE }}>{copy(lang, "Normalize frequent responses such as:", "Normalizar respuestas frecuentes como:")}</Typography></Box>
              <Box sx={{ display: "grid", gap: 1.2 }}>
                {normalize.map(({ icon: Icon, text }) => <Box key={text} sx={{ minHeight: 68, display: "flex", alignItems: "center", gap: 1.5, bgcolor: "rgba(255,255,255,.9)", borderRadius: 2.5, p: 1.5 }}><Icon sx={{ color: PURPLE }} /><Typography sx={{ fontSize: 14, fontWeight: 700 }}>{text}</Typography></Box>)}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>

  </Box>;
};

export default MissionPsychoeducationPage;
