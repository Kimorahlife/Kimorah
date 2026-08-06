import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import HearingOutlinedIcon from "@mui/icons-material/HearingOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import SessionTwoTabs, { SessionTwoTab } from "./SessionTwoTabs";

const TITLE = '"Playfair Display", Georgia, "Times New Roman", serif';
const INK = "#151c5c";
const PURPLE = "#6540b2";
type Lang = "en" | "es";
const tr = (l: Lang, en: string, es: string) => (l === "es" ? es : en);
const card = {
  bgcolor: "rgba(255,255,255,.9)",
  border: "1px solid rgba(69,45,143,.14)",
  borderRadius: 3,
};
const content = {
  concepts: {
    es: [
      "Estrés agudo.",
      "Estrés postraumático.",
      "La muerte no se puede controlar.",
      "Culpa del sobreviviente (normalizar esta experiencia).",
    ],
    en: [
      "Acute stress.",
      "Post-traumatic stress.",
      "Death cannot be controlled.",
      "Survivor guilt (normalizing this experience).",
    ],
  },
  objectives: {
    es: [
      "Comprender el impacto del duelo después de un desastre.",
      "Diferenciar la culpa de la responsabilidad.",
      "Validar las múltiples pérdidas que pueden surgir tras una tragedia.",
      "Favorecer la reconstrucción del autoconcepto y la autoestima frente a la adversidad.",
    ],
    en: [
      "Understand the impact of grief after a disaster.",
      "Differentiate guilt from responsibility.",
      "Validate the multiple losses that can arise after a tragedy.",
      "Support rebuilding self-concept and self-esteem in adversity.",
    ],
  },
  losses: {
    es: [
      "Personas.",
      "Hogar.",
      "Comunidad.",
      "Seguridad.",
      "Futuro esperado.",
      "Sentido de pertenencia.",
      "Identidad.",
    ],
    en: [
      "People.",
      "Home.",
      "Community.",
      "Safety.",
      "Expected future.",
      "Sense of belonging.",
      "Identity.",
    ],
  },
  explain: {
    es: [
      "La muerte es una realidad que escapa a nuestro control.",
      "La culpa del sobreviviente es una respuesta frecuente después de una tragedia y no significa que la persona sea responsable de lo ocurrido.",
      "El valor personal no disminuye por haber sobrevivido, estar lejos o sentirse incapaz de cambiar lo sucedido.",
      "Nuestra autoestima y autoconcepto pueden verse afectados por la pérdida, pero no están definidos por ella.",
      "La rabia, la tristeza y el dolor son emociones válidas que, cuando son procesadas de manera saludable, pueden convertirse en acciones con propósito, solidaridad y crecimiento personal.",
    ],
    en: [
      "Death is a reality beyond our control.",
      "Survivor guilt is common after tragedy and does not mean the person is responsible for what happened.",
      "Personal worth does not diminish because one survived, was far away, or could not change what happened.",
      "Loss can affect self-esteem and self-concept, but it does not define them.",
      "Anger, sadness, and pain are valid emotions that can become purposeful action, solidarity, and growth when processed healthily.",
    ],
  },
  reflection: {
    es: [
      "¿Quién soy hoy?",
      "¿Qué necesidades tengo en este momento de mi vida?",
      "¿Qué aspectos de mí permanecen iguales?",
      "¿Qué aspectos han cambiado a raíz de esta experiencia?",
      "¿Qué necesito para continuar cuidándome mientras transito este proceso de duelo?",
    ],
    en: [
      "Who am I today?",
      "What needs do I have at this moment?",
      "What aspects of me remain the same?",
      "What has changed because of this experience?",
      "What do I need to care for myself while moving through grief?",
    ],
  },
  processing: {
    es: [
      "¿Qué parte de tu identidad sientes que permanece intacta?",
      "¿Qué aspectos de ti han cambiado desde el terremoto?",
      "¿Qué necesidades has descubierto que antes no reconocías?",
      "¿Qué emociones aparecieron al reflexionar sobre quién eres hoy?",
      "¿Qué parte de ti necesita más compasión en este momento?",
      "¿Qué fortalezas continúan acompañándote a pesar de las pérdidas?",
      "¿Qué significa para ti seguir viviendo después de esta experiencia?",
    ],
    en: [
      "What part of your identity feels intact?",
      "What has changed in you since the earthquake?",
      "What needs have you discovered?",
      "What emotions appeared while reflecting on who you are today?",
      "What part of you needs more compassion?",
      "What strengths remain despite the losses?",
      "What does continuing to live after this experience mean to you?",
    ],
  },
};

const MissionSessionTwoPage: React.FC = () => {
  const navigate = useNavigate();
  const { section } = useParams();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language).startsWith("es")
    ? "es"
    : "en";
  const allowed = [
    "concepts",
    "objectives",
    "psychoeducation",
    "intervention",
    "processing",
    "closing",
  ];
  const active = (
    allowed.includes(section || "") ? section : "introduction"
  ) as SessionTwoTab;
  const objectiveApplications = [
    {
      icon: SpaOutlinedIcon,
      en: "Creating a safe and respectful space.",
      es: "Creando un espacio seguro y de respeto.",
    },
    {
      icon: HearingOutlinedIcon,
      en: "Listening actively and without judgment.",
      es: "Escuchando activamente y sin juicios.",
    },
    {
      icon: FavoriteBorderRoundedIcon,
      en: "Validating our emotions and those of others.",
      es: "Validando nuestras emociones y las de los demás.",
    },
    {
      icon: TrackChangesOutlinedIcon,
      en: "Opening the door to reflection, learning, and healing.",
      es: "Abriendo la puerta a la reflexión, el aprendizaje y la sanación.",
    },
  ];
  const numbered = (items: string[], emphasized = false) => (
    <Box sx={{ display: "grid", gap: 1.4 }}>
      {items.map((text, i) => (
        <Box
          key={text}
          sx={{
            ...card,
            minHeight: emphasized ? 112 : 94,
            p: emphasized ? 2.5 : 2.2,
            display: "flex",
            alignItems: "center",
            gap: emphasized ? 2.5 : 2,
          }}
        >
          <Box
            sx={{
              width: emphasized ? 64 : 52,
              height: emphasized ? 64 : 52,
              flexShrink: 0,
              borderRadius: "50%",
              bgcolor: "#eee7fa",
              color: PURPLE,
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
            }}
          >
            {i + 1}
          </Box>
          <Typography
            sx={{
              fontSize: emphasized ? { xs: 17, md: 20 } : undefined,
              fontWeight: emphasized ? 700 : 400,
              lineHeight: 1.5,
            }}
          >
            {text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
  const title = (en: string, es: string, subtitle?: string) => (
    <>
      <Typography
        component="h1"
        sx={{ fontSize: { xs: 30, md: 34 }, fontWeight: 400, lineHeight: 1.15 }}
      >
        {tr(lang, en, es)}
      </Typography>
      {subtitle && (
        <Typography sx={{ mt: 0.65, mb: 2.5, lineHeight: 1.55 }}>
          {subtitle}
        </Typography>
      )}
    </>
  );

  const render = () => {
    if (active === "concepts")
      return (
        <>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 34, md: 40 },
              fontWeight: 400,
              lineHeight: 1.15,
            }}
          >
            {tr(lang, "Concepts", "Conceptos")}
          </Typography>
          <Typography sx={{ mt: 0.5, mb: 4 }}>
            {tr(
              lang,
              "Key ideas for understanding the reality of loss.",
              "Ideas clave para comprender la realidad de la pérdida.",
            )}
          </Typography>
          {numbered(content.concepts[lang], true)}
        </>
      );
    if (active === "objectives")
      return (
        <>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 34, md: 40 },
              fontWeight: 400,
              lineHeight: 1.15,
            }}
          >
            {tr(lang, "Objectives", "Objetivos")}
          </Typography>
          <Typography sx={{ mt: 0.5, mb: 3 }}>
            {tr(
              lang,
              "What we hope to accomplish in this session.",
              "Lo que buscamos lograr en esta sesión.",
            )}
          </Typography>
          <Box sx={{ display: "grid", gap: 1.5 }}>
            {content.objectives[lang].map((text, i) => (
              <Box
                key={text}
                sx={{
                  ...card,
                  minHeight: 105,
                  p: 2.25,
                  display: "flex",
                  alignItems: "center",
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: "#eee7fa",
                    color: PURPLE,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: TITLE,
                    fontSize: 25,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography
                  sx={{
                    color: PURPLE,
                    fontSize: 18,
                    fontWeight: 600,
                    lineHeight: 1.25,
                  }}
                >
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      );
    if (active === "psychoeducation")
      return (
        <>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 34, md: 40 },
              fontWeight: 400,
              lineHeight: 1.15,
            }}
          >
            {tr(lang, "Psychoeducation", "Psicoeducación")}
          </Typography>
          <Typography sx={{ mt: 0.5, mb: 3 }}>
            {tr(
              lang,
              "Understanding loss, survivor guilt, and personal worth after a tragedy.",
              "Comprender la pérdida, la culpa del sobreviviente y el valor personal después de una tragedia.",
            )}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.1fr .9fr" },
              gap: 2.5,
            }}
          >
            <Box
              sx={{
                border: "1px solid rgba(69,45,143,.14)",
                borderRadius: 3,
                p: 2.5,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    bgcolor: PURPLE,
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <LightbulbOutlinedIcon />
                </Box>
                <Typography sx={{ fontSize: 25, color: PURPLE }}>
                  {tr(lang, "Explain:", "Explicar:")}
                </Typography>
              </Box>
              <Box sx={{ display: "grid", gap: 1.2 }}>
                {content.explain[lang].map((text, i) => (
                  <Box
                    key={text}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      p: 1.7,
                      bgcolor: "rgba(255,255,255,.86)",
                      border: "1px solid rgba(69,45,143,.11)",
                      borderRadius: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        flexShrink: 0,
                        borderRadius: "50%",
                        bgcolor: "#eee7fa",
                        color: PURPLE,
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 800,
                      }}
                    >
                      {i + 1}
                    </Box>
                    <Typography
                      sx={{
                        color: PURPLE,
                        fontSize: 15.5,
                        fontWeight: 700,
                        lineHeight: 1.4,
                      }}
                    >
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                bgcolor: "#f4effb",
                border: "1px solid rgba(69,45,143,.12)",
                borderRadius: 3,
                p: 2.5,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}
              >
                <MenuBookOutlinedIcon sx={{ color: PURPLE, fontSize: 34 }} />
                <Typography sx={{ fontSize: 23, color: PURPLE }}>
                  {tr(
                    lang,
                    "Explore forms of loss:",
                    "Explorar las diferentes formas de pérdida:",
                  )}
                </Typography>
              </Box>
              <Box sx={{ display: "grid", gap: 1.2 }}>
                {content.losses[lang].map((text, i) => (
                  <Box
                    key={text}
                    sx={{
                      minHeight: 62,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      bgcolor: "rgba(255,255,255,.9)",
                      borderRadius: 2.5,
                      p: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        flexShrink: 0,
                        borderRadius: "50%",
                        bgcolor: PURPLE,
                        color: "white",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 800,
                      }}
                    >
                      {i + 1}
                    </Box>
                    <FavoriteBorderRoundedIcon sx={{ color: PURPLE }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </>
      );
    if (active === "intervention")
      return (
        <>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 34, md: 40 },
              fontWeight: 400,
              lineHeight: 1.15,
            }}
          >
            {tr(lang, "Intervention", "Intervención")}
          </Typography>
          <Typography sx={{ mt: 0.5, mb: 2.5 }}>
            {tr(
              lang,
              "An activity focused on exploring identity reconstruction after loss.",
              "Actividad enfocada en explorar la reconstrucción de la identidad después de una pérdida.",
            )}
          </Typography>
          <Typography
            sx={{ color: PURPLE, fontSize: 18, fontWeight: 700, mb: 1.5 }}
          >
            {tr(lang, "Reflect on:", "Reflexionar sobre:")}
          </Typography>
          <Box sx={{ display: "grid", gap: 1.5 }}>
            {content.reflection[lang].map((text, i) => (
              <Box
                key={text}
                sx={{
                  ...card,
                  minHeight: 105,
                  p: 2.25,
                  display: "flex",
                  alignItems: "center",
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: "#eee7fa",
                    color: PURPLE,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: TITLE,
                    fontSize: 25,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography
                  sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1.35 }}
                >
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      );
    if (active === "processing")
      return (
        <>
          {title(
            "Processing",
            "Procesamiento",
            tr(lang, "Suggested questions:", "Preguntas sugeridas:"),
          )}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: 1.5,
            }}
          >
            {content.processing[lang].map((q, i) => (
              <Box
                key={q}
                sx={{
                  ...card,
                  minHeight: 125,
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: i % 2 ? "#faf0f8" : "#f4effb",
                }}
              >
                <FormatQuoteRoundedIcon sx={{ color: PURPLE }} />
                <Typography sx={{ fontSize: 17 }}>{q}</Typography>
              </Box>
            ))}
          </Box>
        </>
      );
    if (active === "closing") return <Closing lang={lang} />;
    return (
      <Box sx={{ display: "grid", gap: 2 }}>
        <Box sx={{ ...card, p: { xs: 2.5, md: 3.5 } }}>
          {title(
            "Welcome to Session 2",
            "Bienvenidos a la Sesión 2",
            tr(
              lang,
              "This session explores the reality of loss and identity reconstruction after tragedy.",
              "Esta sesión explora la realidad de la pérdida y la reconstrucción de la identidad después de una tragedia.",
            ),
          )}
        </Box>
        <Box sx={{ ...card, p: { xs: 2.5, md: 3.5 } }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                bgcolor: PURPLE,
                color: "white",
                display: "grid",
                placeItems: "center",
              }}
            >
              <LightbulbOutlinedIcon />
            </Box>
            <Typography sx={{ fontSize: { xs: 25, md: 31 }, fontWeight: 400 }}>
              {tr(lang, "Core concepts", "Conceptos centrales")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: 1.25,
            }}
          >
            {content.concepts[lang].map((x, i) => (
              <Box
                key={x}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  p: 1.6,
                  bgcolor: "#f4effb",
                  borderRadius: 2.5,
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: PURPLE,
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography>{x}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ ...card, p: { xs: 2.5, md: 3.5 } }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                bgcolor: PURPLE,
                color: "white",
                display: "grid",
                placeItems: "center",
              }}
            >
              <TrackChangesOutlinedIcon />
            </Box>
            <Typography sx={{ fontSize: { xs: 25, md: 31 }, fontWeight: 400 }}>
              {tr(lang, "Session objectives", "Objetivos de la sesión")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: 1.25,
            }}
          >
            {content.objectives[lang].map((x) => (
              <Box
                key={x}
                sx={{
                  display: "flex",
                  gap: 1.2,
                  alignItems: "flex-start",
                  p: 1.5,
                }}
              >
                <TrackChangesOutlinedIcon
                  sx={{ color: PURPLE, fontSize: 21, mt: 0.15 }}
                />
                <Typography>{x}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ ...card, p: { xs: 2.5, md: 3.5 } }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                bgcolor: PURPLE,
                color: "white",
                display: "grid",
                placeItems: "center",
              }}
            >
              <MenuBookOutlinedIcon />
            </Box>
            <Typography sx={{ fontSize: { xs: 25, md: 31 }, fontWeight: 400 }}>
              {tr(lang, "Psychoeducation", "Psicoeducación")}
            </Typography>
          </Box>
          <Typography sx={{ mb: 2 }}>
            {tr(
              lang,
              "Explore the different forms of loss:",
              "Explorar las diferentes formas de pérdida:",
            )}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(4,1fr)" },
              gap: 1,
            }}
          >
            {content.losses[lang].map((x) => (
              <Box
                key={x}
                sx={{
                  py: 1.5,
                  px: 1,
                  textAlign: "center",
                  bgcolor: "#f4effb",
                  borderRadius: 2,
                }}
              >
                {x}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      data-language-switcher
      sx={{ minHeight: "100dvh", bgcolor: "#f4f0fa", color: INK }}
    >
      <Box
        component="header"
        sx={{
          color: "white",
          textAlign: "center",
          background: "radial-gradient(circle at 50% 44%,#292455,#10122f 72%)",
          pb: 10,
          pt: 6,
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            bgcolor: PURPLE,
            px: 3,
            py: 0.7,
            borderRadius: 99,
            fontWeight: 800,
          }}
        >
          {tr(lang, "SESSION 2", "SESIÓN 2")}
        </Box>
        <Typography
          sx={{
            fontFamily: TITLE,
            fontSize: { xs: 48, md: 68 },
            lineHeight: 1,
            mt: 2,
          }}
        >
          {tr(lang, "Death and grief", "La muerte y el duelo")}
        </Typography>
        <Typography
          sx={{ mt: 3, color: "#c9b8e6", fontSize: 11, letterSpacing: 1.4 }}
        >
          {tr(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}
        </Typography>
        <Typography sx={{ fontSize: 21, mt: 0.7 }}>
          {tr(lang, "The reality of loss", "La realidad de la pérdida")}
        </Typography>
      </Box>
      <Container maxWidth="xl" sx={{ mt: -4, position: "relative", pb: 2 }}>
        <SessionTwoTabs active={active} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "275px minmax(0,1fr)" },
            gap: 2,
            mt: 2,
          }}
        >
          <Box
            component="aside"
            sx={{
              position: "relative",
              minHeight: { xs: 360, md: active === "objectives" ? 1080 : 900 },
              borderRadius: 3,
              p: 3,
              textAlign: "center",
              backgroundImage:
                "linear-gradient(rgba(255,246,250,.77),rgba(231,222,248,.72)),url('/pillars/mission-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Box
              sx={{
                bgcolor: PURPLE,
                color: "white",
                borderRadius: 2,
                py: 1,
                fontWeight: 800,
                fontSize: 20,
              }}
            >
              {tr(lang, "SESSION 2", "SESIÓN 2")}
            </Box>
            <Typography
              sx={{ fontFamily: TITLE, fontSize: 36, lineHeight: 1.15, mt: 3 }}
            >
              {tr(lang, "Death and grief", "La muerte y el duelo")}
            </Typography>
            <Box sx={{ borderTop: "1px solid rgba(80,54,150,.2)", my: 3 }} />
            <Typography sx={{ color: PURPLE, fontSize: 11, fontWeight: 800 }}>
              {tr(lang, "MAIN TOPIC", "TEMA PRINCIPAL")}
            </Typography>
            <Typography sx={{ fontWeight: 700, mt: 1 }}>
              {tr(lang, "The reality of loss", "La realidad de la pérdida")}
            </Typography>
            {active === "objectives" ? (
              <>
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,.72)",
                    borderRadius: 3,
                    p: 2,
                    mt: 3,
                    textAlign: "left",
                  }}
                >
                  <TrackChangesOutlinedIcon
                    sx={{ color: PURPLE, fontSize: 31 }}
                  />
                  <Typography
                    sx={{
                      color: PURPLE,
                      fontSize: 19,
                      fontWeight: 600,
                      mt: 0.5,
                    }}
                  >
                    {tr(
                      lang,
                      "Why have clear objectives?",
                      "¿Por qué tener objetivos claros?",
                    )}
                  </Typography>
                  <Typography sx={{ mt: 0.7, fontSize: 12, lineHeight: 1.5 }}>
                    {tr(
                      lang,
                      "They give direction to our group work, help us focus on what matters, and give each step a meaningful purpose.",
                      "Dan dirección al trabajo grupal, nos ayudan a enfocarnos en lo importante y dan a cada paso un propósito significativo.",
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,.72)",
                    borderRadius: 3,
                    p: 2,
                    mt: 2,
                    textAlign: "left",
                  }}
                >
                  <Typography
                    sx={{
                      color: PURPLE,
                      fontSize: 19,
                      fontWeight: 600,
                      mb: 1.25,
                    }}
                  >
                    {tr(
                      lang,
                      "How will we apply them?",
                      "¿Cómo los aplicaremos?",
                    )}
                  </Typography>
                  {objectiveApplications.map(({ icon: Icon, en, es }) => (
                    <Box
                      key={en}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        py: 0.75,
                      }}
                    >
                      <Icon
                        sx={{ color: PURPLE, fontSize: 22, flexShrink: 0 }}
                      />
                      <Typography sx={{ fontSize: 11.5, lineHeight: 1.35 }}>
                        {tr(lang, en, es)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    bgcolor: "rgba(244,239,251,.9)",
                    borderLeft: `4px solid ${PURPLE}`,
                    borderRadius: 3,
                    p: 2,
                    mt: 2,
                    textAlign: "left",
                  }}
                >
                  <StarBorderRoundedIcon sx={{ color: PURPLE, fontSize: 30 }} />
                  <Typography
                    sx={{ color: PURPLE, fontSize: 19, fontWeight: 600 }}
                  >
                    {tr(lang, "Important reminder", "Recordatorio importante")}
                  </Typography>
                  <Typography
                    sx={{ mt: 0.7, fontSize: 11.5, lineHeight: 1.45 }}
                  >
                    {tr(
                      lang,
                      "Each objective is a guide, not a demand. Small, conscious steps support individual and group well-being.",
                      "Cada objetivo es una guía, no una exigencia. Los pequeños pasos conscientes apoyan el bienestar individual y grupal.",
                    )}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  position: { md: "absolute" },
                  bottom: 38,
                  left: 28,
                  right: 28,
                  bgcolor: "rgba(255,255,255,.7)",
                  borderRadius: 3,
                  p: 2.5,
                  mt: 5,
                }}
              >
                <FavoriteBorderRoundedIcon
                  sx={{ color: PURPLE, fontSize: 38 }}
                />
                <Typography sx={{ fontWeight: 700, mt: 1 }}>
                  {tr(
                    lang,
                    "Your life and identity retain value through grief.",
                    "Tu vida y tu identidad conservan su valor durante el duelo.",
                  )}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            component="main"
            sx={{
              bgcolor: "rgba(255,255,255,.72)",
              border: "1px solid rgba(69,45,143,.15)",
              borderRadius: 3,
              p: { xs: 2.5, md: 4 },
              minWidth: 0,
            }}
          >
            {render()}
          </Box>
        </Box>
      </Container>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "#e9e0f6",
          py: 2.5,
        }}
      >
        <Button
          onClick={() => navigate("/mission/sessions/1")}
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            minWidth: 190,
            minHeight: 54,
            px: 3.5,
            borderWidth: 1.5,
            borderColor: PURPLE,
            color: INK,
            borderRadius: 99,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {tr(lang, "SESSION 1", "SESIÓN 1")}
        </Button>
        <Button
          onClick={() => navigate("/mission/sessions/2")}
          variant="outlined"
          startIcon={<AppsRoundedIcon />}
          sx={{
            minWidth: 300,
            minHeight: 54,
            px: 3.5,
            borderWidth: 1.5,
            borderColor: PURPLE,
            color: INK,
            borderRadius: 99,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {tr(lang, "CURRICULUM INDEX", "ÍNDICE DEL CURRÍCULO")}
        </Button>
        <Button
          onClick={() => navigate("/mission/sessions/3")}
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            minWidth: 280,
            minHeight: 54,
            px: 3.5,
            bgcolor: PURPLE,
            color: "#fff",
            borderRadius: 99,
            fontSize: 16,
            fontWeight: 500,
            boxShadow: "0 8px 18px rgba(57, 34, 117, 0.22)",
            "&:hover": {
              bgcolor: "#56349f",
              boxShadow: "0 10px 22px rgba(57, 34, 117, 0.28)",
            },
          }}
        >
          {tr(lang, "CONTINUE TO SESSION 3", "CONTINUAR A SESIÓN 3")}
        </Button>
      </Box>
    </Box>
  );
};

const Closing: React.FC<{ lang: Lang }> = ({ lang }) => {
  const closingParagraphs = [
    tr(
      lang,
      "Tragedy can change our circumstances, but it does not determine our worth.",
      "La tragedia puede cambiar nuestras circunstancias, pero no determina nuestro valor como personas.",
    ),
    tr(
      lang,
      "My life continues to have value. I am worthy of care, well-being, and a meaningful life, even amid pain.",
      "Mi vida sigue teniendo valor. Soy digno(a) de cuidado, de bienestar y de construir una vida con significado, incluso en medio del dolor.",
    ),
    tr(
      lang,
      "I cannot control death or chaos, but I can choose who I wish to be and the values by which I live.",
      "Aunque no pueda controlar la muerte o el caos que me rodea, sí puedo elegir la persona que deseo seguir siendo y los valores con los que quiero vivir cada día.",
    ),
  ];
  const feedback = [
    tr(
      lang,
      "What reflection are you taking with you today?",
      "¿Qué reflexión te llevas hoy?",
    ),
    tr(
      lang,
      "Share a personal quality you recognize after this session (optional).",
      "Comparte una cualidad personal que reconoces en ti después de esta sesión (opcional).",
    ),
  ];

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Box sx={{ ...card, p: { xs: 2.5, md: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <FavoriteBorderRoundedIcon sx={{ color: PURPLE, fontSize: 42 }} />
          <Typography
            component="h1"
            sx={{ fontSize: { xs: 32, md: 40 }, fontWeight: 400 }}
          >
            {tr(lang, "Psychoeducational closing", "Cierre psicoeducativo")}
          </Typography>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          {closingParagraphs.map((text) => (
            <Typography
              key={text}
              sx={{ mb: 1.4, fontSize: { xs: 15, md: 17 }, lineHeight: 1.75 }}
            >
              {text}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box sx={{ ...card, p: { xs: 2.5, md: 4 } }}>
        <Typography
          sx={{ fontSize: { xs: 28, md: 35 }, fontWeight: 400, mb: 2.5 }}
        >
          {tr(
            lang,
            "Feedback and a positive closing",
            "Feedback y cierre en una nota positiva",
          )}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 2,
          }}
        >
          {feedback.map((text) => (
            <Box
              key={text}
              sx={{
                minHeight: 115,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "#f1ebf8",
                borderRadius: 3,
                p: 2.5,
              }}
            >
              <FormatQuoteRoundedIcon sx={{ color: PURPLE }} />
              <Typography
                sx={{ fontSize: { xs: 19, md: 22 }, lineHeight: 1.35 }}
              >
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: ".85fr 1.15fr" },
          gap: 2,
        }}
      >
        <Box sx={{ ...card, p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <SpaOutlinedIcon sx={{ color: PURPLE, fontSize: 36 }} />
            <Typography sx={{ fontSize: 26, fontWeight: 400 }}>
              {tr(lang, "Therapeutic approach", "Enfoque terapéutico")}
            </Typography>
          </Box>
          <Typography sx={{ mt: 1.5, lineHeight: 1.65, fontStyle: "italic" }}>
            {tr(
              lang,
              "Grief Therapy, Logotherapy, and Narrative Therapy.",
              "Terapia de Duelo (Grief Therapy), Logoterapia y Terapia Narrativa.",
            )}
          </Typography>
        </Box>
        <Box sx={{ ...card, p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <MenuBookOutlinedIcon sx={{ color: PURPLE, fontSize: 36 }} />
            <Typography sx={{ fontSize: 26, fontWeight: 400 }}>
              {tr(lang, "Clinical reference", "Referencia clínica")}
            </Typography>
          </Box>
          <Typography sx={{ mt: 1.5, lineHeight: 1.65, fontStyle: "italic" }}>
            {tr(
              lang,
              "This session integrates Grief Therapy, Logotherapy, and Narrative Therapy to validate multiple losses, explore identity reconstruction, and promote meaning and dignity in the face of death and suffering.",
              "Esta sesión integra principios de la Terapia de Duelo, la Logoterapia y la Terapia Narrativa para validar las múltiples pérdidas tras una tragedia, explorar la reconstrucción de la identidad y promover el significado y la dignidad personal frente a la muerte y el sufrimiento.",
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default MissionSessionTwoPage;
