import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PURPLE = "#7650bd";
const INK = "#17165b";

const sessionOneSteps = [
  { id: "presentation", en: "Introduction", es: "Introducción", path: "/mission/sessions/1" },
  { id: "concepts", en: "Concepts", es: "Conceptos", path: "/mission/sessions/1/concepts" },
  { id: "objectives", en: "Objectives", es: "Objetivos", path: "/mission/sessions/1/objectives" },
  { id: "psychoeducation", en: "Psychoeducation", es: "Psicoeducación", path: "/mission/sessions/1/psychoeducation" },
  { id: "intervention", en: "Intervention", es: "Intervención", path: "/mission/sessions/1/intervention" },
  { id: "processing", en: "Processing", es: "Procesamiento", path: "/mission/sessions/1/processing" },
  { id: "closing", en: "Closing", es: "Cierre", path: "/mission/sessions/1/closing" },
] as const;

const sessionTwoSteps = [
  { id: "introduction", en: "Introduction", es: "Introducción", path: "/mission/sessions/2" },
  { id: "concepts", en: "Concepts", es: "Conceptos", path: "/mission/sessions/2/concepts" },
  { id: "objectives", en: "Objectives", es: "Objetivos", path: "/mission/sessions/2/objectives" },
  { id: "psychoeducation", en: "Psychoeducation", es: "Psicoeducación", path: "/mission/sessions/2/psychoeducation" },
  { id: "intervention", en: "Intervention", es: "Intervención", path: "/mission/sessions/2/intervention" },
  { id: "processing", en: "Processing", es: "Procesamiento", path: "/mission/sessions/2/processing" },
  { id: "closing", en: "Closing", es: "Cierre", path: "/mission/sessions/2/closing" },
] as const;

const sessionThreeSteps = [
  { id: "introduction", en: "Introduction", es: "Introducción", path: "/mission/sessions/3" },
  { id: "concepts", en: "Concepts", es: "Conceptos", path: "/mission/sessions/3/concepts" },
  { id: "objectives", en: "Objectives", es: "Objetivos", path: "/mission/sessions/3/objectives" },
  { id: "psychoeducation", en: "Psychoeducation", es: "Psicoeducación", path: "/mission/sessions/3/psychoeducation" },
  { id: "intervention", en: "Intervention", es: "Intervención", path: "/mission/sessions/3/intervention" },
  { id: "processing", en: "Processing", es: "Procesamiento", path: "/mission/sessions/3/processing" },
  { id: "closing", en: "Closing", es: "Cierre", path: "/mission/sessions/3/closing" },
] as const;

type Props = {
  session: 1 | 2 | 3;
  active: string;
};

export default function CurriculumStepNavigation({ session, active }: Props) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const spanish = i18n.language?.toLowerCase().startsWith("es");
  const steps = session === 1 ? sessionOneSteps : session === 2 ? sessionTwoSteps : sessionThreeSteps;
  const currentIndex = Math.max(0, steps.findIndex((step) => step.id === active));
  const previous = currentIndex > 0 ? steps[currentIndex - 1] : undefined;
  const next = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : undefined;
  const nextSession = currentIndex === steps.length - 1 && session < 3
    ? { path: `/mission/sessions/${session + 1}`, number: session + 1 }
    : undefined;

  const go = (path: string) => {
    navigate(path);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  return (
    <Box
      component="nav"
      aria-label={spanish ? "Navegación de la sesión" : "Session navigation"}
      sx={{
        mt: 1.25,
        px: { xs: 1, sm: 1.5 },
        py: 1,
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)",
        alignItems: "center",
        gap: { xs: 0.75, sm: 1.5 },
        bgcolor: "rgba(255,255,255,.96)",
        border: "1px solid rgba(89,59,160,.16)",
        borderRadius: 3,
        boxShadow: "0 7px 22px rgba(47,32,105,.08)",
        position: { xs: "sticky", md: "static" },
        bottom: { xs: 10, md: "auto" },
        zIndex: 20,
      }}
    >
      {previous ? (
        <Button
          onClick={() => go(previous.path)}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            justifySelf: "start",
            minWidth: 0,
            color: INK,
            borderRadius: 99,
            px: { xs: 1, sm: 2 },
            fontSize: { xs: 11, sm: 13 },
            fontWeight: 700,
          }}
        >
          {spanish ? "Anterior" : "Previous"}
        </Button>
      ) : <Box />}

      <Box sx={{ textAlign: "center", minWidth: { xs: 92, sm: 150 } }}>
        <Typography sx={{ color: PURPLE, fontSize: { xs: 10, sm: 11 }, fontWeight: 800, letterSpacing: 1 }}>
          {spanish ? `PASO ${currentIndex + 1} DE ${steps.length}` : `STEP ${currentIndex + 1} OF ${steps.length}`}
        </Typography>
        <Typography sx={{ color: INK, fontSize: { xs: 12, sm: 14 }, fontWeight: 700 }}>
          {spanish ? steps[currentIndex].es : steps[currentIndex].en}
        </Typography>
      </Box>

      {(next || nextSession) ? (
        <Button
          onClick={() => go(next?.path ?? nextSession!.path)}
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            justifySelf: "end",
            minWidth: 0,
            bgcolor: PURPLE,
            borderRadius: 99,
            px: { xs: 1.25, sm: 2.5 },
            fontSize: { xs: 11, sm: 13 },
            fontWeight: 700,
            boxShadow: "0 4px 10px rgba(57,36,118,.2)",
            "&:hover": { bgcolor: "#6742a7" },
          }}
        >
          {nextSession
            ? (spanish ? `Sesión ${nextSession.number}` : `Session ${nextSession.number}`)
            : (spanish ? "Continuar" : "Continue")}
        </Button>
      ) : <Box />}
    </Box>
  );
}
