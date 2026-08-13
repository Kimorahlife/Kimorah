import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import SessionOneTabs from "./SessionOneTabs";
import CurriculumStepNavigation from "./CurriculumStepNavigation";

const SERIF = '"Inter", "Segoe UI", Arial, sans-serif';
const TITLE_FONT = '"Playfair Display", Georgia, "Times New Roman", serif';
const INK = "#211866";
const PURPLE = "#7650b3";
type Lang = "en" | "es";
const copy = (lang: Lang, en: string, es: string) => lang === "es" ? es : en;

const MissionClosingPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";

  const closing = copy(
    lang,
    "Being vulnerable does not mean being weak; it means recognizing that we are living through a difficult experience and allowing ourselves to receive support when we need it. Although we cannot change what happened, there are always small actions over which we have influence. Learning to recognize that difference can help us regain a sense of stability, strengthen our ability to cope, and remind us that we do not have to go through this process alone.",
    "Ser vulnerable no significa ser débil; significa reconocer que estamos viviendo una experiencia difícil y permitirnos recibir apoyo cuando lo necesitamos. Aunque no podamos cambiar lo ocurrido, siempre existen pequeñas acciones sobre las cuales sí tenemos influencia. Aprender a reconocer esa diferencia puede ayudarnos a recuperar una sensación de estabilidad, fortalecer nuestra capacidad de afrontamiento y recordarnos que no tenemos que atravesar este proceso en soledad."
  );

  return <Box data-language-switcher sx={{ minHeight: "100dvh", color: INK, bgcolor: "#f4f0fa" }}>
    <Box component="header" sx={{ position: "relative", overflow: "hidden", color: "white", textAlign: "center", background: "radial-gradient(circle at 50% 44%,#292455 0%,#17173d 48%,#10122f 100%)", pb: { xs: 9, md: 10.5 }, "&::after": { content: '""', position: "absolute", left: "-5%", right: "-5%", bottom: -45, height: 80, bgcolor: "#f4f0fa", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" } }}>
      <Container maxWidth="xl" sx={{ pt: 2.25, position: "relative", zIndex: 1 }}>
        <Box sx={{ maxWidth: 820, mx: "auto", pt: { xs: 6, md: 4.5 } }}>
          <Button onClick={() => navigate("/mission/sessions/1")} sx={{ color: "#c9b8e6", fontSize: 11, fontWeight: 700, mb: 1.5 }}>{copy(lang, "‹ Back to Session 1", "‹ Volver a Sesión 1")}</Button>
          <Box sx={{ display: "inline-block", bgcolor: PURPLE, px: 3.2, py: .8, borderRadius: 99, fontSize: 15, fontWeight: 800 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box>
          <Typography component="h1" sx={{ fontFamily: TITLE_FONT, fontSize: { xs: 44, sm: 58, md: 66 }, fontWeight: 500, lineHeight: 1, mt: 2.25 }}>{copy(lang, "Closing", "Cierre")}</Typography>
          <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 18, md: 21 }, mt: 1.6 }}>{copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}</Typography>
        </Box>
      </Container>
    </Box>

    <Container maxWidth="xl" sx={{ mt: { xs: -3, md: -4 }, pb: 2, position: "relative", zIndex: 2 }}>
      <Box sx={{ mb: 2.5 }}><SessionOneTabs active="closing" /><CurriculumStepNavigation session={1} active="closing" /></Box>
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

        <Box component="main" sx={{ display: "grid", gap: 2, minWidth: 0 }}>
          <Box sx={{ bgcolor: "rgba(255,255,255,.76)", border: "1px solid rgba(69,45,143,.15)", borderRadius: 3, p: { xs: 2.5, md: 4 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}><FavoriteBorderRoundedIcon sx={{ color: PURPLE, fontSize: 42 }} /><Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: 25, md: 29 }, lineHeight: 1.1, color: INK }}>{copy(lang, "Psychoeducational closing", "Cierre psicoeducativo")}</Typography></Box>
            <Typography sx={{ mt: 2.5, fontSize: { xs: 15, md: 17 }, lineHeight: 1.75 }}>{closing}</Typography>
          </Box>

          <Box sx={{ bgcolor: "rgba(255,255,255,.76)", border: "1px solid rgba(69,45,143,.15)", borderRadius: 3, p: { xs: 2.5, md: 4 } }}>
            <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 25, md: 29 }, lineHeight: 1.1, color: INK, mb: 2.5 }}>{copy(lang, "Feedback and closing on a positive note", "Feedback y cierre en una nota positiva")}</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2 }}>
              {[copy(lang, "One word you are leaving with today.", "Una palabra con la que te vas hoy."), copy(lang, "What learning or reflection are you taking from this first session? (Optional)", "¿Qué aprendizaje o reflexión te llevas de esta primera sesión? (Opcional)")].map((text) => <Box key={text} sx={{ minHeight: 115, display: "flex", alignItems: "center", gap: 1.5, bgcolor: "#f1ebf8", borderRadius: 3, p: 2.5 }}><FormatQuoteRoundedIcon sx={{ color: PURPLE }} /><Typography sx={{ fontFamily: SERIF, fontSize: { xs: 19, md: 22 }, lineHeight: 1.35 }}>{text}</Typography></Box>)}
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: ".85fr 1.15fr" }, gap: 2 }}>
            <Box sx={{ bgcolor: "rgba(255,255,255,.76)", border: "1px solid rgba(69,45,143,.15)", borderRadius: 3, p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}><SpaOutlinedIcon sx={{ color: PURPLE, fontSize: 36 }} /><Typography sx={{ fontFamily: SERIF, fontSize: 26 }}>{copy(lang, "Therapeutic approach", "Enfoque terapéutico")}</Typography></Box>
              <Typography sx={{ mt: 1.5, lineHeight: 1.65, fontStyle: "italic" }}>{copy(lang, "Trauma-Informed Care, Mindfulness, and Acceptance and Commitment Therapy (ACT).", "Atención Informada por Trauma (Trauma-Informed Care), Mindfulness y Terapia de Aceptación y Compromiso (ACT).")}</Typography>
            </Box>
            <Box sx={{ bgcolor: "rgba(255,255,255,.76)", border: "1px solid rgba(69,45,143,.15)", borderRadius: 3, p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}><MenuBookOutlinedIcon sx={{ color: PURPLE, fontSize: 36 }} /><Typography sx={{ fontFamily: SERIF, fontSize: 26 }}>{copy(lang, "Clinical reference", "Referencia clínica")}</Typography></Box>
              <Typography sx={{ mt: 1.5, lineHeight: 1.65, fontStyle: "italic" }}>{copy(lang, "This session uses Trauma-Informed Care principles to establish psychological safety, together with ACT and mindfulness strategies to help participants distinguish what they can control from what they need to accept, promoting presence in the current moment.", "Esta sesión utiliza principios de la Atención Informada por Trauma para establecer seguridad psicológica, junto con estrategias de ACT y mindfulness para ayudar a los participantes a diferenciar aquello que pueden controlar de aquello que necesitan aceptar, promoviendo la presencia en el momento actual.")}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>

    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 1.5, bgcolor: "rgba(232,224,247,.82)", py: 2.5 }}>
      <Button onClick={() => navigate("/mission")} variant="outlined" startIcon={<AppsRoundedIcon />} sx={{ minWidth: 300, minHeight: 54, px: 3.5, borderWidth: 1.5, borderColor: PURPLE, color: INK, borderRadius: 99, fontSize: 16, fontWeight: 500 }}>{copy(lang, "CURRICULUM INDEX", "IR AL ÍNDICE DEL CURRÍCULO")}</Button>
      <Button onClick={() => navigate("/mission/c/when-the-earth-changes/session/2")} variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{ minWidth: 300, minHeight: 54, px: 3.5, bgcolor: PURPLE, borderRadius: 99, fontSize: 16, fontWeight: 500, boxShadow: "0 5px 12px rgba(57,36,118,.28)", "&:hover": { bgcolor: "#6742a7" } }}>{copy(lang, "CONTINUE TO SESSION 2", "CONTINUAR A SESIÓN 2")}</Button>
    </Box>
  </Box>;
};

export default MissionClosingPage;
