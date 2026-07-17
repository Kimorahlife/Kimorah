import React, { ReactNode } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { useNavigate } from "react-router-dom";
import LogoBadge from "../../landing/LogoBadge";
import { onenessData } from "./oneness-data";
import PracticeCard from "./PracticeCard";
import OfferingRow from "./OfferingRow";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const GREEN = "#245c4a";

const SectionHeading: React.FC<{ children: ReactNode; action?: ReactNode; centered?: boolean }> = ({ children, action, centered }) =>
  centered ? (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mt: { xs: 4, sm: 5 }, mb: 2.5 }}>
      <EnergySavingsLeafRoundedIcon sx={{ color: "#7fae8c", fontSize: 18, transform: "scaleX(-1)" }} />
      <Typography sx={{ fontWeight: 700, letterSpacing: 1.5, color: GREEN, fontSize: { xs: 14, sm: 16 } }}>{children}</Typography>
      <EnergySavingsLeafRoundedIcon sx={{ color: "#7fae8c", fontSize: 18 }} />
    </Box>
  ) : (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: { xs: 4, sm: 5 }, mb: 2 }}>
      <Typography sx={{ fontWeight: 700, letterSpacing: 1, color: GREEN, fontSize: { xs: 14, sm: 16 } }}>{children}</Typography>
      {action}
    </Box>
  );

const cardGrid = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", md: "repeat(5, 1fr)" },
  gap: { xs: 1.5, sm: 2 },
} as const;

const OnenessPage: React.FC = () => {
  const navigate = useNavigate();
  const d = onenessData;

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        backgroundImage: "url('/pillars/oneness-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: "#7fb8ad",
      }}
    >
      <Box sx={{ minHeight: "100dvh", background: "linear-gradient(180deg, rgba(232,244,240,0.42) 0%, rgba(224,240,238,0.6) 100%)" }}>
        <Button
          onClick={() => navigate("/")}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 10,
            color: GREEN,
            textTransform: "none",
            fontWeight: 700,
            px: 2,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(4px)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
          }}
        >
          Back
        </Button>

        <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 7 } }}>
          {/* Header */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <LogoBadge size={{ xs: 84, sm: 104 }} />
            <Typography component="h1" sx={{ fontFamily: SERIF, fontWeight: 700, color: GREEN, fontSize: { xs: 56, sm: 88 }, lineHeight: 1, mt: 1 }}>
              {d.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 1.5, width: 200 }}>
              <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(36,92,74,0.35)" }} />
              <EnergySavingsLeafRoundedIcon sx={{ color: "#7fae8c", fontSize: 20 }} />
              <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(36,92,74,0.35)" }} />
            </Box>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: GREEN, fontSize: { xs: 24, sm: 32 } }}>{d.tagline}</Typography>
            <Typography sx={{ color: "#3f6155", fontSize: { xs: 15, sm: 17 }, mt: 1.5, maxWidth: 520 }}>{d.description}</Typography>
          </Box>

          {/* Pathways */}
          <SectionHeading centered>PATHWAYS TO ONENESS</SectionHeading>
          <Box sx={cardGrid}>
            {d.pathways.map((c) => (
              <PracticeCard key={c.id} card={c} variant="arrow" />
            ))}
          </Box>

          {/* Specialized experiences */}
          <SectionHeading centered>SPECIALIZED EXPERIENCES</SectionHeading>
          <Box sx={cardGrid}>
            {d.experiences.map((c) => (
              <PracticeCard key={c.id} card={c} variant="explore" />
            ))}
          </Box>

          {/* Featured offerings */}
          <SectionHeading
            action={
              <Typography sx={{ color: GREEN, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center" }}>
                View All ›
              </Typography>
            }
          >
            FEATURED OFFERINGS
          </SectionHeading>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {d.offerings.map((o) => (
              <OfferingRow key={o.id} offering={o} />
            ))}
          </Box>

          {/* CTA banner */}
          <Box
            sx={{
              mt: { xs: 4, sm: 5 },
              px: { xs: 2, sm: 4 },
              py: { xs: 2, sm: 2.5 },
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              background: "linear-gradient(120deg, #2e6b5b 0%, #1f5245 100%)",
              boxShadow: "0 10px 26px rgba(20,60,50,0.28)",
            }}
          >
            <EnergySavingsLeafRoundedIcon sx={{ color: "#a9e0c4", fontSize: 26, flexShrink: 0 }} />
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ color: "#fff", fontSize: { xs: 14, sm: 16 } }}>{d.cta.line1}</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: { xs: 14, sm: 16 } }}>{d.cta.line2}</Typography>
            </Box>
            <FavoriteRoundedIcon sx={{ color: "#a9e0c4", fontSize: 24, flexShrink: 0 }} />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default OnenessPage;
