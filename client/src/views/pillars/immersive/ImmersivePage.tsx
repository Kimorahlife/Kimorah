import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useNavigate } from "react-router-dom";
import LogoBadge from "../../landing/LogoBadge";
import { immersiveData } from "./immersive-data";
import ServiceCard from "./ServiceCard";
import RetreatCard from "./RetreatCard";
import PodcastSection from "./PodcastSection";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const INDIGO = "#3a2f6e";

/**
 * Immersive pillar page — full-width, data-driven layout built from modular
 * components (ServiceCard, RetreatCard). Content comes from `immersiveData`;
 * swap that for an API call when the backend is ready. Card images render as
 * placeholders until real images are added.
 */
const ImmersivePage: React.FC = () => {
  const navigate = useNavigate();
  const d = immersiveData;

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        backgroundImage: "url('/pillars/immersive-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: "#2a2140",
      }}
    >
      {/* Light lavender overlay keeps the airy look + card legibility */}
      <Box sx={{ minHeight: "100dvh", background: "linear-gradient(180deg, rgba(244,242,250,0.62) 0%, rgba(238,236,250,0.74) 100%)" }}>
        <Button
          onClick={() => navigate("/")}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 10,
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            borderRadius: 999,
            bgcolor: "rgba(20,12,40,0.5)",
            backdropFilter: "blur(4px)",
            "&:hover": { bgcolor: "rgba(20,12,40,0.7)" },
          }}
        >
          Back
        </Button>

        <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 7 } }}>
          {/* Header */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <LogoBadge size={{ xs: 92, sm: 116 }} />
            <Typography
              component="h1"
              sx={{ fontFamily: SERIF, fontWeight: 700, color: INDIGO, fontSize: { xs: 52, sm: 80 }, lineHeight: 1, mt: 1 }}
            >
              {d.title}
            </Typography>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 600, color: INDIGO, fontSize: { xs: 22, sm: 30 }, mt: 1 }}>
              {d.tagline}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 1.5, width: 200 }}>
              <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(58,47,110,0.35)" }} />
              <SpaRoundedIcon sx={{ color: "#8b79bd", fontSize: 20 }} />
              <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(58,47,110,0.35)" }} />
            </Box>
            <Typography sx={{ color: "#4a4276", fontSize: { xs: 15, sm: 18 }, maxWidth: 560 }}>
              {d.description}
            </Typography>
          </Box>

          {/* Services — 6 cards, 3 across on desktop */}
          <Box
            sx={{
              mt: { xs: 4, sm: 5 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
              gap: { xs: 2, sm: 2.5 },
            }}
          >
            {d.services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </Box>

          {/* Retreats */}
          <Box sx={{ textAlign: "center", mt: { xs: 5, sm: 7 } }}>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: INDIGO, fontSize: { xs: 28, sm: 34 } }}>
              {d.retreatsHeading}
            </Typography>
            <Typography sx={{ color: "#5b5387", fontSize: { xs: 13, sm: 15 }, mt: 0.5 }}>
              {d.retreatsSubtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              mt: 3,
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: { xs: 1.5, sm: 2.5 },
            }}
          >
            {d.retreats.map((r) => (
              <RetreatCard key={r.id} retreat={r} />
            ))}
          </Box>

          <PodcastSection heading={d.podcastHeading} subtitle={d.podcastSubtitle} podcasts={d.podcasts} />

          {/* CTA banner */}
          <Box
            sx={{
              mt: { xs: 4, sm: 5 },
              p: { xs: 2, sm: 2.5 },
              borderRadius: 999,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 1.5, sm: 3 },
              bgcolor: "rgba(231,224,243,0.92)",
              boxShadow: "0 8px 24px rgba(60,40,90,0.15)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FavoriteBorderRoundedIcon sx={{ color: INDIGO, fontSize: 28 }} />
              <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography sx={{ color: INDIGO, fontWeight: 600, fontSize: { xs: 15, sm: 17 } }}>{d.cta.heading}</Typography>
                <Typography sx={{ color: "#5b5387", fontSize: { xs: 13, sm: 15 } }}>{d.cta.subtext}</Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              endIcon={<ChevronRightRoundedIcon />}
              sx={{
                bgcolor: "#5a4a9c",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 999,
                px: 3,
                py: 1,
                whiteSpace: "nowrap",
                boxShadow: "none",
                "&:hover": { bgcolor: "#4c3f88", boxShadow: "none" },
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

export default ImmersivePage;
