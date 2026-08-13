import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HearingOutlinedIcon from "@mui/icons-material/HearingOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import LogoBadge from "../../landing/LogoBadge";
import SessionOneTabs from "./SessionOneTabs";
import CurriculumStepNavigation from "./CurriculumStepNavigation";

const SERIF = '"Inter", "Segoe UI", Arial, sans-serif';
const TITLE_FONT = '"Playfair Display", Georgia, "Times New Roman", serif';
const INK = "#211866";
const PURPLE = "#7650b3";
const PAPER = "rgba(255,255,255,.72)";

type Lang = "en" | "es";

const copy = (lang: Lang, en: string, es: string) => (lang === "es" ? es : en);

const sectionCard = {
  border: "1px solid rgba(73,50,139,.16)",
  borderRadius: { xs: 2.5, md: 3 },
  bgcolor: PAPER,
  boxShadow: "0 12px 30px rgba(67,45,126,.025)",
};

const Section: React.FC<{
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ id, icon, title, subtitle, children }) => (
  <Box id={id} component="section" sx={{ ...sectionCard, scrollMarginTop: 24, p: { xs: 2.25, md: 3 }, mb: 1.75 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: subtitle ? 0.25 : 2 }}>
      <Box sx={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(145deg,#7f5bc1,#4c2b9c)", color: "white", display: "grid", placeItems: "center", flexShrink: 0 }}>
        {icon}
      </Box>
      <Typography component="h2" sx={{ fontFamily: SERIF, fontSize: { xs: 25, md: 29 }, lineHeight: 1.1, color: INK }}>
        {title}
      </Typography>
    </Box>
    {subtitle && <Typography sx={{ ml: { xs: 0, sm: 8.25 }, mb: 2.25, fontSize: 13 }}>{subtitle}</Typography>}
    {children}
  </Box>
);

const MissionSessionOnePage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";


  const objectives = lang === "es"
    ? ["Crear seguridad psicológica.", "Favorecer la conexión entre los participantes.", "Validar el impacto del trauma vicario.", "Diferenciar entre estar informado y estar emocionalmente sobreexpuesto.", "Normalizar las respuestas iniciales ante una crisis.", "Promover la vulnerabilidad como una herramienta para el procesamiento emocional y la conexión humana."]
    : ["Create psychological safety.", "Encourage connection among participants.", "Validate the impact of vicarious trauma.", "Differentiate between being informed and being emotionally overexposed.", "Normalize initial responses to a crisis.", "Promote vulnerability as a tool for emotional processing and human connection."];

  const education = [
    { icon: PsychologyOutlinedIcon, text: copy(lang, "Difference between concern and action", "Diferencia entre preocupación y acción") },
    { icon: PsychologyOutlinedIcon, text: copy(lang, "How the brain seeks to regain control", "Cómo el cerebro busca recuperar el control") },
    { icon: SpaOutlinedIcon, text: copy(lang, "The importance of returning to the present", "La importancia de regresar al momento presente") },
    { icon: FavoriteBorderRoundedIcon, text: copy(lang, "Vulnerability as a natural human response", "La vulnerabilidad como respuesta humana natural") },
    { icon: VolunteerActivismOutlinedIcon, text: copy(lang, "Expressing emotions and asking for help is strength", "Expresar emociones y pedir ayuda es fortaleza") },
  ];

  const applications = [
    { icon: SpaOutlinedIcon, text: copy(lang, "Creating a safe and respectful space.", "Creando un espacio seguro y de respeto.") },
    { icon: HearingOutlinedIcon, text: copy(lang, "Listening actively and without judgment.", "Escuchando activamente y sin juicios.") },
    { icon: FavoriteBorderRoundedIcon, text: copy(lang, "Validating our emotions and those of others.", "Validando nuestras emociones y las de los demás.") },
    { icon: TrackChangesOutlinedIcon, text: copy(lang, "Opening the door to reflection, learning, and healing.", "Abriendo la puerta a la reflexión, el aprendizaje y la sanación.") },
  ];

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <Box data-language-switcher sx={{ minHeight: "100dvh", color: INK, bgcolor: "#f4f0fa", backgroundImage: "radial-gradient(circle at 12% 45%,rgba(136,94,193,.08),transparent 32%),radial-gradient(circle at 88% 60%,rgba(136,94,193,.07),transparent 30%)" }}>
      <Box component="header" sx={{ position: "relative", overflow: "hidden", color: "white", textAlign: "center", background: "radial-gradient(circle at 50% 44%,#292455 0%,#17173d 48%,#10122f 100%)", pb: { xs: 9, md: 10.5 }, "&::after": { content: '""', position: "absolute", left: "-5%", right: "-5%", bottom: -45, height: 80, bgcolor: "#f4f0fa", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" } }}>
        <Container maxWidth="xl" sx={{ pt: 2.25, position: "relative", zIndex: 1 }}>

          <Box sx={{ maxWidth: 780, mx: "auto", pt: { xs: 6, md: 4.5 } }}>
            <Box sx={{ display: "inline-block", bgcolor: PURPLE, px: 3.2, py: .8, borderRadius: 99, fontSize: 15, fontWeight: 800, letterSpacing: 1.2 }}>{copy(lang, "SESSION 1", "SESIÓN 1")}</Box>
            <Typography component="h1" sx={{ fontFamily: TITLE_FONT, fontSize: { xs: 46, sm: 61, md: 68 }, fontWeight: 500, lineHeight: .98, mt: 2.25, whiteSpace: { md: "pre-line" } }}>
              {copy(lang, "Creating safety\nand connection", "Creando seguridad\ny conexión")}
            </Typography>
            <Box sx={{ width: 42, borderTop: "1px solid rgba(255,255,255,.9)", mx: "auto", my: 2.5 }} />
            <Typography sx={{ fontSize: 11, letterSpacing: 1.3, color: "#c9b8e6" }}>{copy(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}</Typography>
            <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 18, md: 21 }, mt: .8 }}>{copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}</Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: { xs: -3, md: -4 }, pb: 0, position: "relative", zIndex: 2 }}>
        <Box sx={{ mb: 1.75 }}><SessionOneTabs active="presentation" /><CurriculumStepNavigation session={1} active="presentation" /></Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "275px minmax(0,1fr)" }, gap: 2, alignItems: "stretch" }}>
          <Box
            component="aside"
            sx={{
              position: "relative",
              overflow: "hidden",
              minHeight: { xs: 390, md: 0 },
              height: "100%",
              borderRadius: 3,
              p: 3,
              textAlign: "center",
              backgroundImage: "linear-gradient(rgba(255,246,250,.77),rgba(231,222,248,.72)),url('/pillars/mission-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Box sx={{ bgcolor: PURPLE, color: "white", borderRadius: 2, py: 1, fontWeight: 800, fontSize: 20 }}>
              {copy(lang, "SESSION 1", "SESIÓN 1")}
            </Box>
            <Typography sx={{ fontFamily: TITLE_FONT, fontSize: 34, lineHeight: 1.2, mt: 3 }}>
              {copy(lang, "Creating safety and connection", "Creando seguridad y conexión")}
            </Typography>
            <Box sx={{ borderTop: "1px solid rgba(80,54,150,.2)", my: 3 }} />
            <Typography sx={{ color: PURPLE, fontSize: 11, fontWeight: 800 }}>
              {copy(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}
            </Typography>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.5, mt: 1 }}>
              {copy(lang, "Vulnerability · Vicarious trauma · “What now?”", "Vulnerabilidad · Trauma vicario · “¿Y ahora qué?”")}
            </Typography>
            <Box sx={{ bgcolor: "rgba(255,255,255,.72)", borderRadius: 3, p: 2, mt: 3, textAlign: "left" }}>
              <Typography sx={{ fontFamily: SERIF, color: PURPLE, fontSize: 19, fontWeight: 600, mb: 1.25 }}>
                {copy(lang, "How will we apply them?", "¿Cómo los aplicaremos?")}
              </Typography>
              {applications.map(({ icon: Icon, text }) => (
                <Box key={text} sx={{ display: "flex", alignItems: "center", gap: 1, py: .75 }}>
                  <Icon sx={{ color: PURPLE, fontSize: 22, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 11.5, lineHeight: 1.35 }}>{text}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ position: { md: "absolute" }, bottom: 40, left: 28, right: 28, bgcolor: "rgba(255,255,255,.66)", borderRadius: 3, p: 2.5, mt: 5 }}>
              <FavoriteBorderRoundedIcon sx={{ color: PURPLE, fontSize: 38 }} />
              <Typography sx={{ fontWeight: 700, lineHeight: 1.55, mt: 1 }}>
                {copy(lang, "This is a space to accompany one another with respect, compassion, and humanity.", "Este es un espacio para acompañarnos con respeto, compasión y humanidad.")}
              </Typography>
            </Box>
          </Box>

          <Box component="main" sx={{ ...sectionCard, p: { xs: 1.25, md: 2 }, minWidth: 0 }}>
        <Section id="presentation" icon={<GroupsOutlinedIcon />} title={copy(lang, "Participant introductions", "Presentación de los participantes")}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr .85fr" }, gap: { xs: 2.5, md: 4 }, ml: { md: 8.25 } }}>
            <Box>
              <Typography sx={{ lineHeight: 1.65, fontSize: 14 }}>{copy(lang, "Each participant will have the opportunity to introduce themselves, sharing only what feels comfortable. This is a space where vulnerability is welcome and sharing is an invitation, not an obligation.", "Cada participante tendrá la oportunidad de presentarse compartiendo únicamente aquello con lo que se sienta cómodo(a). Se enfatizará que este es un espacio donde la vulnerabilidad es bienvenida y que compartir es una invitación, no una obligación.")}</Typography>
              <Box sx={{ mt: 3, p: 1.7, bgcolor: "#eee9f8", border: "1px solid rgba(118,80,179,.14)", borderRadius: 2, display: "flex", gap: 1.4, alignItems: "center" }}><ShieldOutlinedIcon sx={{ color: PURPLE }} /><Typography sx={{ fontSize: 12.5 }}><b>{copy(lang, "Reminder:", "Recordatorio:")}</b> {copy(lang, "Everyone has the right to say “Pass” if they prefer not to answer a question.", "Todas las personas tienen el derecho de decir “Paso” si prefieren no responder alguna pregunta.")}</Typography></Box>
            </Box>
            <Box sx={{ bgcolor: "#f0ebf7", borderRadius: 2.5, p: 2.25, mt: { md: -8.25 }, alignSelf: "start" }}>
              <Typography sx={{ fontFamily: SERIF, fontSize: 20, mb: 1.75 }}>{copy(lang, "Suggested group questions", "Preguntas sugeridas para el grupo")}</Typography>
              {[copy(lang, "How would you like us to address you during the group?", "¿Cómo te gustaría que te llamáramos durante el grupo?"), copy(lang, "Is there anything you want the group to know to better support you? (Optional)", "¿Hay algo que quisieras que el grupo supiera sobre ti para apoyarte mejor? (Opcional)")].map((question) => <Box key={question} sx={{ display: "flex", gap: 1, bgcolor: "rgba(255,255,255,.78)", borderRadius: 2, p: 1.75, mb: 1.1 }}><Typography sx={{ color: PURPLE, fontFamily: SERIF, fontWeight: 800, fontSize: 30, lineHeight: .8 }}>“</Typography><Typography sx={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.45 }}>{question}</Typography></Box>)}
            </Box>
          </Box>
        </Section>

        <Section id="objectives" icon={<TrackChangesOutlinedIcon />} title={copy(lang, "Session objectives", "Objetivos de la sesión")}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, columnGap: 7, rowGap: 1.7, ml: { md: 7.25 }, "& > div:nth-of-type(n+4)": { pl: { md: 4 }, borderLeft: { md: "1px solid rgba(73,50,139,.15)" } } }}>
            {objectives.map((item) => <Box key={item} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}><CheckCircleOutlineRoundedIcon sx={{ color: PURPLE, fontSize: 18, mt: .2, flexShrink: 0 }} /><Typography sx={{ fontSize: 13.5 }}>{item}</Typography></Box>)}
          </Box>
        </Section>

        <Section id="psychoeducation" icon={<MenuBookOutlinedIcon />} title={copy(lang, "Psychoeducation", "Psicoeducación")} subtitle={copy(lang, "What I can and cannot control after a disaster.", "Lo que puedo controlar y lo que no puedo controlar después de un desastre.")}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(5,1fr)" }, ml: { md: 2.5 } }}>
            {education.map(({ icon: Icon, text }, index) => <Box key={text} sx={{ textAlign: "center", px: 2, py: 1, borderRight: { md: index < education.length - 1 ? "1px solid rgba(73,50,139,.14)" : 0 } }}><Icon sx={{ color: PURPLE, fontSize: 42, strokeWidth: .75 }} /><Typography sx={{ fontSize: 12, mt: 1, lineHeight: 1.4 }}>{text}</Typography></Box>)}
          </Box>
        </Section>
          </Box>
        </Box>
      </Container>

      <Box id="session-actions" sx={{ mt: .75, py: 2.5, textAlign: "center", bgcolor: "rgba(232,222,247,.8)", borderTop: "1px solid rgba(73,50,139,.08)" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 1.5 }}>
          <Button onClick={() => navigate("/mission/c/when-the-earth-changes/session/2")} variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{ minWidth: 300, minHeight: 54, px: 3.5, bgcolor: PURPLE, borderRadius: 99, fontSize: 16, fontWeight: 500, boxShadow: "0 5px 12px rgba(57,36,118,.28)", "&:hover": { bgcolor: "#6742a7" } }}>{copy(lang, "CONTINUE TO SESSION 2", "CONTINUAR A SESIÓN 2")}</Button>
          <Button onClick={() => navigate("/mission")} variant="outlined" startIcon={<AppsRoundedIcon />} sx={{ minWidth: 300, minHeight: 54, px: 3.5, borderWidth: 1.5, color: INK, borderColor: PURPLE, borderRadius: 99, fontSize: 16, fontWeight: 500 }}>{copy(lang, "CURRICULUM INDEX", "IR AL ÍNDICE DEL CURRÍCULO")}</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MissionSessionOnePage;
