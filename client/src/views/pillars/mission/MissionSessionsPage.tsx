import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import WbTwilightOutlinedIcon from "@mui/icons-material/WbTwilightOutlined";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const PURPLE = "#7952b5";

type Copy = { en: string; es: string };
const bi = (en: string, es: string): Copy => ({ en, es });

const sessions = [
  { title: bi("Creating Safety and Connection", "Creando seguridad y conexión"), body: bi("Vulnerability, emptying trauma and: What now?", "Vulnerabilidad, vaciar el trauma y: ¿Ahora qué?") },
  { title: bi("Death and Grief", "La muerte y el duelo"), body: bi("The reality of loss and rebuilding the self.", "La realidad de la pérdida y la reconstrucción del yo.") },
  { title: bi("Grief and Stigma", "El duelo y el estigma"), body: bi("Self-compassion, beliefs and roles that shape how we live through pain.", "Autocompasión, creencias y roles que influyen en cómo vivimos el dolor.") },
  { title: bi("Change and Impermanence", "Cambio e impermanencia"), body: bi("Accept, adapt and rebuild a new reality.", "Aceptar, adaptarse y reconstruir una nueva realidad.") },
  { title: bi("Control, Acceptance and the Present", "Control, aceptación y el momento presente"), body: bi("Anxiety, presence and psychological flexibility.", "Ansiedad, presencia y flexibilidad psicológica.") },
  { title: bi("Rebuilding Yourself", "Reconstruyéndome"), body: bi("Self-care, self-esteem and inner strength. Recovering motivation through self-love.", "Autocuidado, autoestima y fortaleza interior. Recuperando la motivación desde el amor propio.") },
  { title: bi("Purpose and Meaning", "Propósito y reconstrucción del significado"), body: bi("Meaning, community and post-traumatic growth.", "Sentido, comunidad y crecimiento postraumático.") },
];

const principles = [
  { icon: ShieldOutlinedIcon, title: bi("Trauma-Informed", "Informado por trauma"), body: bi("Prioritizes safety, choice, collaboration and empowerment.", "Prioriza seguridad, elección, colaboración y empoderamiento.") },
  { icon: PsychologyOutlinedIcon, title: bi("Evidence-Based", "Basado en evidencia"), body: bi("Integrates ACT, mindfulness, CBT, polyvagal theory and more.", "Integra ACT, mindfulness, CBT, teoría polivagal y más.") },
  { icon: GroupsOutlinedIcon, title: bi("Professional-Focused", "Orientado al profesional"), body: bi("Clinical resources, guides and materials ready to apply.", "Recursos clínicos, guías y materiales listos para aplicar.") },
  { icon: SpaOutlinedIcon, title: bi("Culturally Sensitive", "Sensible y cultural"), body: bi("A humane, compassionate and contextualized approach.", "Enfoque humano, compasivo y contextualizado.") },
  { icon: WbTwilightOutlinedIcon, title: bi("Builds Resilience", "Fomenta resiliencia"), body: bi("Strengthens inner resources and support networks.", "Fortalece recursos internos y redes de apoyo.") },
];

const MissionSessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang: "en" | "es" = (i18n.resolvedLanguage || i18n.language).startsWith("es") ? "es" : "en";
  const t = (copy: Copy) => copy[lang];

  return (
    <Box data-language-switcher sx={{ minHeight: "100dvh", bgcolor: "#eee4f5", color: "#21185d" }}>
      <Box sx={{ position: "relative", overflow: "hidden", color: "white", background: "#10132f" }}>
        <Box sx={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(90deg,rgba(12,15,43,.98) 0%,rgba(15,17,47,.86) 42%,rgba(15,17,47,.12) 77%), url('/pillars/priority-program-portal.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <Container maxWidth="lg" sx={{ position: "relative", py: { xs: 3, md: 4 } }}>
          <Box component="nav" sx={{ display: "flex", alignItems: "center", gap: 3, pr: { xs: 0, md: 18 } }}>
            <Button onClick={() => navigate("/mission")} startIcon={<ArrowBackRoundedIcon />} sx={{ color: "white", fontWeight: 700, textTransform: "none" }}>{lang === "es" ? "Misión" : "Mission"}</Button>
            <Typography sx={{ fontWeight: 800, letterSpacing: 4 }}>KIMORAH</Typography>
            <Box sx={{ ml: "auto", display: { xs: "none", md: "flex" }, gap: 3 }}>
              {[bi("Home", "Inicio"), bi("Curriculum", "Currículo"), bi("Therapeutic Approach", "Enfoque terapéutico"), bi("Professional Resources", "Recursos profesionales"), bi("About", "Acerca del programa")].map((x) => <Typography key={x.en} sx={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{t(x)}</Typography>)}
            </Box>
          </Box>

          <Box sx={{ maxWidth: 590, pt: { xs: 8, md: 11 }, pb: { xs: 8, md: 9 } }}>
            <Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: 48, sm: 68, md: 78 }, lineHeight: .98 }}>
              {lang === "es" ? "Cuando la Tierra Cambia," : "When the Earth Changes,"}
              <Box component="span" sx={{ display: "block", color: "#b483df", fontStyle: "italic", mt: 1 }}>{lang === "es" ? "Nosotros También" : "We Change Too"}</Box>
            </Typography>
            <Box sx={{ width: 46, borderTop: "1px solid white", my: 3 }} />
            <Typography sx={{ maxWidth: 510, fontSize: { xs: 15, md: 18 }, lineHeight: 1.55 }}>{lang === "es" ? "Currículo psicoeducativo de apoyo y procesamiento para personas afectadas indirectamente por el terremoto de Venezuela." : "A psychoeducational curriculum offering support and processing for people indirectly affected by the earthquake in Venezuela."}</Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 3, p: 2, maxWidth: 500, border: "1px solid rgba(255,255,255,.5)", borderRadius: 2 }}>
              <GroupsOutlinedIcon sx={{ color: "#c5a1e5", fontSize: 42 }} />
              <Box><Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.25 }}>{lang === "es" ? "DISEÑADO PARA PROFESIONALES DE LA SALUD MENTAL" : "DESIGNED FOR MENTAL HEALTH PROFESSIONALS"}</Typography><Typography sx={{ opacity: .8, fontSize: 13 }}>{lang === "es" ? "Basado en evidencia. Informado por trauma. Enfoques integrativos y culturalmente sensibles." : "Evidence-based. Trauma-informed. Integrative and culturally sensitive approaches."}</Typography></Box>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
              <Button href="#sessions" variant="contained" sx={{ bgcolor: PURPLE, borderRadius: 99, px: 4, py: 1.4, fontWeight: 800, letterSpacing: 1.2, "&:hover": { bgcolor: "#8b65c4" } }}>{lang === "es" ? "EXPLORAR SESIONES" : "EXPLORE SESSIONS"}</Button>
              <Button variant="outlined" startIcon={<PlayArrowRoundedIcon />} sx={{ color: "white", borderColor: "white", borderRadius: 99, px: 3 }}>{lang === "es" ? "VER VIDEO INTRODUCTORIO" : "WATCH INTRODUCTORY VIDEO"}</Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box id="sessions" sx={{ py: { xs: 7, md: 9 }, background: "radial-gradient(circle at 50% 45%,#fff 0%,#f7f3fb 48%,#eee7f6 100%)" }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 3.5 } }}>
            <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 30, md: 43 }, lineHeight: 1.15 }}>{lang === "es" ? "Un marco clínico para acompañar, validar y reconstruir." : "A clinical framework to accompany, validate and rebuild."}</Typography>
            <Typography sx={{ mt: 1.5, mx: "auto", maxWidth: 780, fontSize: { xs: 15, md: 18 }, lineHeight: 1.45 }}>{lang === "es" ? "Siete sesiones estructuradas para facilitar la recuperación emocional, fortalecer recursos internos y promover resiliencia colectiva." : "Seven structured sessions that facilitate emotional recovery, strengthen inner resources and promote collective resilience."}</Typography>
            <Box sx={{ width: 36, borderTop: `2px solid ${PURPLE}`, mx: "auto", mt: 2.25 }} />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(4,1fr)", xl: "repeat(7,1fr)" }, gap: { xs: 1.5, xl: 1.25 } }}>
            {sessions.map((session, index) => (
              <Box
                key={session.title.en}
                role={index === 0 ? "link" : undefined}
                tabIndex={index === 0 ? 0 : undefined}
                onClick={index === 0 ? () => navigate("/mission/sessions/1") : undefined}
                onKeyDown={index === 0 ? (event) => { if (event.key === "Enter" || event.key === " ") navigate("/mission/sessions/1"); } : undefined}
                sx={{
                  border: "1px solid rgba(121,82,181,.22)", borderRadius: 3, p: { xs: 3, md: 2 }, textAlign: "center",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  minHeight: { xs: 310, md: 340 }, color: "#21185d",
                  background: "linear-gradient(180deg,rgba(255,255,255,.78) 0%,rgba(255,255,255,.48) 62%,rgba(226,214,242,.62) 100%)",
                  boxShadow: "0 10px 24px rgba(73,50,139,.08)",
                  transition: "background-color .25s ease, color .25s ease, transform .25s ease, box-shadow .25s ease",
                  ...(index === 0 && {
                    cursor: "pointer",
                    "&:hover, &:focus-visible": { transform: "translateY(-6px)", boxShadow: "0 18px 32px rgba(73,50,139,.18)", borderColor: PURPLE, outline: "none" },
                  }),
                }}
              >
                <Box className="session-number" sx={{ width: 46, height: 46, mb: 3, display: "grid", placeItems: "center", borderRadius: "50%", background: "linear-gradient(145deg,#8b63c8,#6742ad)", color: "white", fontFamily: SERIF, fontSize: 21, fontWeight: 700 }}>{index + 1}</Box>
                <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: { xs: 20, xl: 18 }, lineHeight: 1.25 }}>{t(session.title)}</Typography>
                <Box sx={{ width: 34, borderTop: `1px solid ${PURPLE}`, my: 2.5 }} />
                <Typography sx={{ maxWidth: 180, fontSize: 13, lineHeight: 1.5 }}>{t(session.body)}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ textAlign: "center", mt: 4 }}><Button variant="contained" sx={{ bgcolor: PURPLE, borderRadius: 99, minWidth: { xs: 0, sm: 340 }, px: 5, py: 1.4, fontWeight: 700, letterSpacing: 1.4, boxShadow: "0 5px 10px rgba(73,50,139,.25)", "&:hover": { bgcolor: "#6842a7" } }}>{lang === "es" ? "VER TODAS LAS SESIONES →" : "VIEW ALL SESSIONS →"}</Button></Box>
        </Container>
      </Box>

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          bgcolor: "#11142f",
          color: "white",
          pt: { xs: 7, md: 6 },
          pb: { xs: 8, md: 3 },
          borderRadius: { md: "0 0 22px 22px" },
          "&::before, &::after": {
            content: '\"\"', position: "absolute", bottom: -12, width: { xs: 190, md: 350 }, height: { xs: 130, md: 175 }, opacity: .72,
            backgroundImage: "radial-gradient(circle,#ad568d 0 4px,transparent 5px),radial-gradient(circle,#d284a8 0 3px,transparent 4px),radial-gradient(circle,#775094 0 4px,transparent 5px),linear-gradient(68deg,transparent 48%,#725070 49% 50%,transparent 51%)",
            backgroundSize: "55px 53px,73px 61px,91px 79px,100% 100%",
          },
          "&::before": { left: -18, transform: "rotate(-4deg)" },
          "&::after": { right: -18, transform: "scaleX(-1) rotate(-4deg)" },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography sx={{ textAlign: "center", fontWeight: 700, fontSize: { xs: 13, md: 16 }, letterSpacing: 2.5, mb: { xs: 4, md: 2.5 } }}>
            {lang === "es" ? "UN PROGRAMA INTEGRAL Y FUNDAMENTADO" : "A COMPREHENSIVE, GROUNDED PROGRAM"}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(5,1fr)" } }}>
            {principles.map(({ icon: Icon, ...p }, index) => (
              <Box key={p.title.en} sx={{ textAlign: "center", px: { xs: 2.5, md: 3 }, py: { xs: 3, md: 1.5 }, borderRight: { md: index < principles.length - 1 ? "1px solid rgba(221,209,232,.28)" : "none" } }}>
                <Icon sx={{ fontSize: { xs: 58, md: 62 }, mb: 2, color: "#ddd1e8", strokeWidth: .8 }} />
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 13, md: 14 }, textTransform: "uppercase", letterSpacing: .5, lineHeight: 1.2 }}>{t(p.title)}</Typography>
                <Typography sx={{ color: "rgba(255,255,255,.78)", fontSize: { xs: 13, md: 14 }, lineHeight: 1.55, mt: 1.25 }}>{t(p.body)}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ textAlign: "center", mt: { xs: 4, md: 2.5 }, px: { xs: 1, md: 10 } }}>
            <FormatQuoteRoundedIcon sx={{ display: "block", mx: "auto", color: "#8654bc", fontSize: 42, mb: -1.5 }} />
            <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 25, md: 31 }, lineHeight: 1.12, color: "#e4d9eb", maxWidth: 800, mx: "auto" }}>
              {lang === "es" ? <>No podemos controlar los terremotos,<br />pero sí cómo respondemos a ellos.</> : <>We cannot control earthquakes,<br />but we can control how we respond to them.</>}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,.82)", fontSize: { xs: 12, md: 14 }, mt: 1.5 }}>{lang === "es" ? "Acompañar con presencia, conocimiento y compasión sí marca la diferencia." : "Being present with knowledge and compassion makes a difference."}</Typography>
            <FavoriteRoundedIcon sx={{ display: "block", mx: "auto", mt: 1, color: "#8f64c4", fontSize: 20 }} />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MissionSessionsPage;
