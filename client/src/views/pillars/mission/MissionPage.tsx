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

/** Marks which source a card was built from, while the two are side by side. */
const CompareLabel: React.FC<{ text: string; tone: string }> = ({ text, tone }) => (
  <Box
    sx={{
      display: "inline-block",
      mb: 1,
      px: 1.25,
      py: 0.4,
      border: `1px solid ${tone}`,
      borderRadius: 99,
      color: tone,
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: 1.1,
    }}
  >
    {text}
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

  // The same card, built from the stored curricula, shown beneath the hardcoded
  // one so the two can be compared before the hardcoded copy is retired.
  // Development only — a visitor should never see the page twice.
  const stored = useDatabaseCurricula(d.priorityProgram);
  const comparing = import.meta.env.DEV;
  /** Title of a stored curriculum whose page does not exist yet. */
  const [noPageFor, setNoPageFor] = React.useState<string | null>(null);

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
          {comparing && <CompareLabel text="HARDCODED — mission-data.ts" tone="#8a8fb5" />}
          {/* data-compare lets the comparison check measure the two cards'
              computed styles against each other instead of guessing selectors. */}
          <Box data-compare="hardcoded">
            <PriorityProgramCard
              item={d.priorityProgram}
              // The hardcoded pair is positional — there are exactly two, and
              // each has had its own page since before any of this was data.
              onExplore={(_, index) =>
                navigate(index === 0 ? "/mission/sessions/1" : "/mission/grief/session/1/introduction")
              }
            />
          </Box>

          {comparing && (
            <Box sx={{ mt: 4 }}>
              <CompareLabel
                text={
                  stored.includesDrafts
                    ? "FROM THE DATABASE — includes drafts, because you are signed in"
                    : "FROM THE DATABASE — published only"
                }
                tone="#6540b2"
              />
              {stored.loading && <Typography sx={{ color: INDIGO, fontSize: 13 }}>Loading stored curricula…</Typography>}
              {stored.error && <Typography sx={{ color: "#b3261e", fontSize: 13 }}>{stored.error}</Typography>}
              {!stored.loading && !stored.error && !stored.program && (
                <Typography sx={{ color: INDIGO, fontSize: 13 }}>
                  {stored.includesDrafts
                    ? "No curricula stored yet — create one in the Curriculum Builder."
                    : "Nothing published yet — turn on Published in the Curriculum Builder to show a curriculum here."}
                </Typography>
              )}
              {noPageFor && (
                <Typography sx={{ color: "#b3261e", fontSize: 13, mb: 1 }}>
                  {`“${noPageFor}” has no page yet — the session pages are still hardcoded, one per curriculum.`}
                </Typography>
              )}
              {stored.program && (
                <Box data-compare="database">
                  <PriorityProgramCard
                    item={stored.program}
                    // Routed by slug, never by position — the stored list can
                    // hold any number of curricula, in any order.
                    // Every stored curriculum opens its own session through the
                    // template — never the hardcoded page, which is what made
                    // both cards land on the same URL.
                    onExplore={(curriculum) => {
                      if (curriculum.slug) navigate(`/mission/c/${curriculum.slug}/session/1`);
                      else setNoPageFor(curriculum.title);
                    }}
                  />
                </Box>
              )}
            </Box>
          )}

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
