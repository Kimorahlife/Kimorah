import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import LogoBadge from "../../landing/LogoBadge";
import SessionOneTabs, { SessionOneTab } from "./SessionOneTabs";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const PURPLE = "#7650b3";
const INK = "#211866";

const sectionCopy: Record<string, { en: string; es: string }> = {
  objectives: { en: "Objectives", es: "Objetivos" },
  psychoeducation: { en: "Psychoeducation", es: "Psicoeducación" },
  intervention: { en: "Intervention", es: "Intervención" },
  processing: { en: "Processing", es: "Procesamiento" },
  closing: { en: "Closing", es: "Cierre" },
};

const SessionOneComingSoonPage: React.FC = () => {
  const navigate = useNavigate();
  const { section = "objectives" } = useParams();
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language).startsWith("es");
  const active = (section in sectionCopy ? section : "objectives") as SessionOneTab;
  const title = sectionCopy[active][spanish ? "es" : "en"];

  return <Box data-language-switcher sx={{ minHeight: "100dvh", color: INK, bgcolor: "#f4f0fa" }}>
    <Box component="header" sx={{ position: "relative", overflow: "hidden", color: "white", textAlign: "center", background: "radial-gradient(circle at 50% 44%,#292455 0%,#17173d 48%,#10122f 100%)", pb: { xs: 9, md: 10.5 }, "&::after": { content: '""', position: "absolute", left: "-5%", right: "-5%", bottom: -45, height: 80, bgcolor: "#f4f0fa", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" } }}>
      <Container maxWidth="xl" sx={{ pt: 2.25, position: "relative", zIndex: 1 }}>
        <Box component="nav" sx={{ display: "flex", alignItems: "center" }}><Box onClick={() => navigate("/")} sx={{ display: "flex", alignItems: "center", cursor: "pointer", textAlign: "left" }}><LogoBadge size={{ xs: 50, md: 62 }} /><Box sx={{ ml: 1.25 }}><Typography sx={{ fontFamily: SERIF, fontSize: 17, letterSpacing: 4 }}>KIMORAH</Typography><Typography sx={{ fontSize: 9 }}>{spanish ? "CURRÍCULO PSICOEDUCATIVO" : "PSYCHOEDUCATIONAL CURRICULUM"}</Typography></Box></Box></Box>
        <Box sx={{ maxWidth: 780, mx: "auto", pt: { xs: 6, md: 4.5 } }}><Box sx={{ display: "inline-block", bgcolor: PURPLE, px: 3.2, py: .8, borderRadius: 99, fontSize: 15, fontWeight: 800 }}>{spanish ? "SESIÓN 1" : "SESSION 1"}</Box><Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: 46, sm: 61, md: 68 }, fontWeight: 500, lineHeight: .98, mt: 2.25, whiteSpace: "pre-line" }}>{spanish ? "Creando seguridad\ny conexión" : "Creating safety\nand connection"}</Typography><Box sx={{ width: 42, borderTop: "1px solid white", mx: "auto", my: 2.5 }} /><Typography sx={{ fontSize: 11, letterSpacing: 1.3, color: "#c9b8e6" }}>{spanish ? "TEMA PRINCIPAL" : "MAIN TOPIC"}</Typography><Typography sx={{ fontFamily: SERIF, fontSize: { xs: 18, md: 21 }, mt: .8 }}>{spanish ? "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”" : "Vulnerability · Vicarious trauma · “What now?”"}</Typography><Typography sx={{ maxWidth: 680, mx: "auto", mt: 2.25, fontSize: { xs: 15, md: 17 }, lineHeight: 1.6, color: "rgba(255,255,255,.92)" }}>{spanish ? "Esta sesión está diseñada para establecer un espacio de confianza, validar lo que estás viviendo y comenzar a construir conexión con otros que comprenden." : "This session is designed to establish a space of trust, validate what you are experiencing, and begin building connection with others who understand."}</Typography></Box>
      </Container>
    </Box>
    <Container maxWidth="lg" sx={{ mt: { xs: -3, md: -4 }, position: "relative", zIndex: 2, pb: 8 }}>
      <SessionOneTabs active={active} />
      <Box sx={{ mt: 3, minHeight: 340, display: "grid", placeItems: "center", textAlign: "center", bgcolor: "rgba(255,255,255,.7)", border: "1px solid rgba(83,56,151,.16)", borderRadius: 3, p: 4 }}><Box><Box sx={{ width: 64, height: 64, mx: "auto", display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "rgba(118,80,179,.1)", color: PURPLE }}><HourglassEmptyRoundedIcon sx={{ fontSize: 34 }} /></Box><Typography sx={{ fontFamily: SERIF, fontSize: { xs: 35, md: 48 }, mt: 2 }}>{title}</Typography><Typography sx={{ color: PURPLE, fontWeight: 800, letterSpacing: 1.5, mt: 1 }}>{spanish ? "PRÓXIMAMENTE" : "COMING SOON"}</Typography><Typography sx={{ maxWidth: 500, mt: 1.5 }}>{spanish ? "Estamos preparando el contenido de esta sección. Puedes continuar explorando las otras partes de la sesión." : "We are preparing the content for this section. You can continue exploring the other parts of the session."}</Typography></Box></Box>
    </Container>
  </Box>;
};

export default SessionOneComingSoonPage;
