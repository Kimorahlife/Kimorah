import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoBadge from "../../landing/LogoBadge";
import { missionData, missionDataEs } from "./mission-data";
import CauseCard from "./CauseCard";
import PartnerRow from "./PartnerRow";
import PriorityResearchCard from "./PriorityResearchCard";
import PriorityProgramCard from "./PriorityProgramCard";

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

/**
 * Mission pillar page — a full-width, data-driven layout built from modular
 * components (CauseCard, PriorityResearchCard, PartnerRow). Content comes from
 * `missionData` today; swap that for an API call when the backend is ready.
 */
const MissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language).startsWith("es");
  const d = spanish ? missionDataEs : missionData;

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
          <PriorityProgramCard item={d.priorityProgram} onExplore={() => navigate("/mission/sessions")} />

          {/* Priority Research */}
          <SectionHeading title={spanish ? "INVESTIGACIÓN PRIORITARIA" : "PRIORITY RESEARCH"} />
          <PriorityResearchCard item={d.priority} onReviewData={() => navigate("/mission/coqui")} />

          {/* Featured Partners */}
          <SectionHeading title={spanish ? "ORGANIZACIONES DESTACADAS" : "FEATURED ORGANIZATIONS"} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {d.partners.map((p) => (
              <PartnerRow key={p.id} partner={p} />
            ))}
          </Box>

          {/* Explore Causes */}
          <SectionHeading title={spanish ? "EXPLORA CAUSAS" : "EXPLORE CAUSES"} action={spanish ? "Ver todo ›" : "View All ›"} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: { xs: 1.5, sm: 2.5 },
            }}
          >
            {d.causes.map((c) => (
              <CauseCard key={c.id} cause={c} />
            ))}
          </Box>

          {/* Get involved CTA */}
          <Box
            sx={{
              mt: { xs: 4, sm: 5 },
              p: { xs: 2.5, sm: 3 },
              borderRadius: 4,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              background: "linear-gradient(120deg, #3a3170 0%, #52489a 100%)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box component="img" src="/pillars/leaf.png" alt="" sx={{ width: 44, height: 44, objectFit: "contain" }} />
              <Box>
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: { xs: 18, sm: 22 } }}>
                  {d.cta.heading}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: { xs: 13, sm: 15 } }}>
                  {d.cta.subtext}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              endIcon={<FavoriteRoundedIcon />}
              sx={{
                bgcolor: GOLD,
                color: "#3a2f10",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 999,
                px: 3,
                py: 1,
                whiteSpace: "nowrap",
                boxShadow: "none",
                "&:hover": { bgcolor: "#d8a92a", boxShadow: "none" },
              }}
            >
              {d.cta.buttonLabel}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MissionPage;
