import React from "react";
import { Box, Container, Typography } from "@mui/material";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoBadge from "../../landing/LogoBadge";
import { missionData, missionDataEs, PriorityCurriculumCard } from "./mission-data";
import PartnerRow from "./PartnerRow";
import PriorityResearchCard from "./PriorityResearchCard";
import PriorityProgramCard from "./PriorityProgramCard";
import { useDatabaseCurricula } from "./useDatabaseCurricula";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const INDIGO = "#2f2a63";
const GOLD = "#c99a1e";

const SectionHeading: React.FC<{ title: string; action?: string; onAction?: () => void }> = ({
  title,
  action,
  onAction,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: { xs: 4, sm: 5 }, mb: 2 }}>
    <Typography sx={{ fontWeight: 700, letterSpacing: 1.5, color: INDIGO, fontSize: { xs: 14, sm: 16 } }}>
      {title}
    </Typography>
    {action && (
      <Typography
        onClick={onAction}
        sx={{ color: INDIGO, fontSize: 13, fontWeight: 600, cursor: "pointer", "&:hover": { color: GOLD } }}
      >
        {action}
      </Typography>
    )}
  </Box>
);

/** A short line where the programme card would be — loading, failed, or empty. */
const ProgramNote: React.FC<{ text: string; tone?: string }> = ({ text, tone = INDIGO }) => (
  <Typography sx={{ color: tone, fontSize: 13 }}>{text}</Typography>
);

/**
 * Mission pillar page — a full-width, data-driven layout built from modular
 * components (PriorityResearchCard, PartnerRow). The page copy comes from
 * `missionData`; the priority programme's curricula come from the database.
 */
const MissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language).startsWith("es");
  const d = spanish ? missionDataEs : missionData;

  const stored = useDatabaseCurricula(d.priorityProgram);

  const explore = (curriculum: PriorityCurriculumCard) =>
    navigate(`/mission/c/${curriculum.slug}/session/1`);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        backgroundImage: "url('/pillars/mission-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: "#2a2140",
      }}
    >
      {/* Legibility overlay */}
      <Box sx={{ minHeight: "100dvh", background: "linear-gradient(180deg, rgba(245,243,252,0.30) 0%, rgba(238,236,250,0.55) 45%, rgba(238,236,250,0.6) 100%)" }}>

        <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 7 } }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 3 } }}>
            <LogoBadge size={{ xs: 68, sm: 96 }} />
            <Typography
              component="h1"
              sx={{ fontFamily: SERIF, fontWeight: 700, color: INDIGO, fontSize: { xs: 44, sm: 76 }, letterSpacing: 2, lineHeight: 1 }}
            >
              {d.title}
            </Typography>
          </Box>

          {/* Gold divider */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, my: { xs: 2, sm: 3 }, maxWidth: 520 }}>
            <Box sx={{ height: 2, flex: 1, bgcolor: GOLD, opacity: 0.7 }} />
            <EnergySavingsLeafRoundedIcon sx={{ color: GOLD, fontSize: 20 }} />
          </Box>

          <Typography
            sx={{
              fontFamily: SERIF,
              fontWeight: 700,
              color: INDIGO,
              fontSize: spanish
                ? { xs: 25, sm: 28, md: 31 }
                : { xs: 27, sm: 33, md: 38 },
              lineHeight: 1.15,
              letterSpacing: spanish ? "-0.3px" : "normal",
              width: "100%",
            }}
          >
            {d.tagline}
          </Typography>
          <Typography
            sx={{
              color: INDIGO,
              fontSize: { xs: 15, sm: 17 },
              fontWeight: 500,
              lineHeight: 1.6,
              mt: 2,
              width: "100%",
            }}
          >
            {d.description}
          </Typography>

          {/* Priority Programs */}
          <SectionHeading title={spanish ? "PROGRAMAS PRIORITARIOS" : "PRIORITY PROGRAMS"} />
          {stored.loading && (
            <ProgramNote text={spanish ? "Cargando currículos…" : "Loading curricula…"} />
          )}
          {stored.error && <ProgramNote text={stored.error} tone="#b3261e" />}
          {!stored.loading && !stored.error && !stored.program && (
            <ProgramNote
              text={
                stored.includesDrafts
                  ? spanish
                    ? "Aún no hay currículos — crea uno en el Constructor de Currículos."
                    : "No curricula stored yet — create one in the Curriculum Builder."
                  : spanish
                    ? "Aún no se ha publicado nada — activa Publicado en el Constructor de Currículos para mostrar un currículo aquí."
                    : "Nothing published yet — turn on Published in the Curriculum Builder to show a curriculum here."
              }
            />
          )}
          {stored.program && <PriorityProgramCard item={stored.program} onExplore={explore} />}

          {/* Priority Research */}
          <SectionHeading title={spanish ? "INVESTIGACIÓN PRIORITARIA" : "PRIORITY RESEARCH"} />
          <PriorityResearchCard item={d.priority} />

          {/* Featured Partners */}
          <SectionHeading title={spanish ? "ORGANIZACIONES DESTACADAS" : "FEATURED ORGANIZATIONS"} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {d.partners.map((p) => (
              <PartnerRow key={p.id} partner={p} />
            ))}
          </Box>

        </Container>
      </Box>
    </Box>
  );
};

export default MissionPage;
