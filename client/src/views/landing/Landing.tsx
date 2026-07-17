import React from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { useNavigate } from "react-router-dom";
import LogoBadge from "./LogoBadge";
import LandingBackground from "./LandingBackground";
import { PILLARS, Pillar } from "./pillars";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';

const HEADING_GREEN = "#24483a";
const BODY_GREEN = "#3a4a44";
const MUTED = "#6b7a72";

const PillarButton: React.FC<{ pillar: Pillar; onSelect: (p: Pillar) => void }> = ({
  pillar,
  onSelect,
}) => (
  <ButtonBase
    focusRipple
    aria-label={pillar.label}
    onClick={() => onSelect(pillar)}
    sx={{
      flexDirection: "column",
      gap: 0.5,
      borderRadius: 2,
      p: 0.25,
      width: "100%",
      verticalAlign: "top",
      "&:hover .kimorah-circle": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 22px rgba(40,40,70,0.28)",
      },
    }}
  >
    <Box
      className="kimorah-circle"
      sx={{
        width: "100%",
        maxWidth: { xs: 80, sm: 124, md: 140 },
        aspectRatio: "1 / 1",
        mx: "auto",
        borderRadius: "50%",
        bgcolor: pillar.color,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 16px rgba(40,40,70,0.18)",
        transition: "transform .18s ease, box-shadow .18s ease",
        "& svg": { fontSize: { xs: 19, sm: 29 } },
        "& .mi-glyph": { fontSize: { xs: 19, sm: 29 } },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", lineHeight: 0, mb: 0.1 }}>
        {pillar.icon}
      </Box>
      <Typography
        component="span"
        sx={{ fontFamily: SERIF, fontSize: { xs: 24, sm: 40 }, lineHeight: 1, fontWeight: 600 }}
      >
        {pillar.letter}
      </Typography>
    </Box>
    <Typography
      component="span"
      sx={{
        fontSize: { xs: 10, sm: 13 },
        fontWeight: 700,
        color: "#ffffff",
        textShadow: "0 1px 4px rgba(0,0,0,0.55)",
        letterSpacing: 0.1,
        lineHeight: 1.15,
        textAlign: "center",
        width: "100%",
        overflowWrap: "anywhere",
      }}
    >
      {pillar.label}
    </Typography>
  </ButtonBase>
);

const Divider: React.FC = () => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "58%", my: 0.5 }}>
    <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(60,74,68,0.22)" }} />
    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#5b6f97" }} />
    <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(60,74,68,0.22)" }} />
  </Box>
);

/**
 * Public landing page — the calm "front door" that mirrors the KIMORAH brand:
 * a welcome, and the seven pillars (Kindness, Immersive, Mission, Oneness,
 * Revitalization, Acceptance, Harmony) as choices to nurture.
 *
 * Background: a soft lavender gradient by default. Drop a photo at
 * `public/landing-bg.jpg` and it layers in automatically (the gradient stays as
 * a legibility overlay).
 */
const Landing: React.FC = () => {
  const navigate = useNavigate();

  // Pillars don't have destinations yet — route to signup so a visitor can
  // start. Swap to `navigate(pillar.path)` once those sections exist.
  const handleSelect = (_pillar: Pillar) => {
    navigate("/signup");
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#cfc8e6",
      }}
    >
      {/* Layer 1 — SVG valley scene (default backdrop) */}
      <LandingBackground />

      {/* Layer 2 — optional real photo; covers the SVG when present at public/landing-bg.jpg */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/landing-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Layer 3 — soft top overlay so the header text stays legible */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(245,242,250,0.40) 0%, rgba(245,242,250,0.08) 26%, rgba(245,242,250,0) 52%)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 900,
          px: 3,
          py: { xs: 5, sm: 7 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <LogoBadge />

        <Typography
          component="h1"
          sx={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: { xs: 40, sm: 46 },
            color: HEADING_GREEN,
            mt: 2,
            lineHeight: 1.1,
          }}
        >
          Welcome
        </Typography>

        <Typography sx={{ mt: 1.5, fontWeight: 700, fontSize: 15, color: BODY_GREEN }}>
          This is your space.
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 14, color: MUTED }}>
          Choose what you want to nurture today.
        </Typography>

        <Box sx={{ mt: 2.5, mb: 2 }}>
          <Divider />
        </Box>

        <Typography
          sx={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 14.5,
            color: MUTED,
            maxWidth: 300,
            lineHeight: 1.5,
          }}
        >
          Every choice is a step toward your well-being.
        </Typography>

        <FavoriteRoundedIcon sx={{ color: "#2f8f8f", fontSize: 18, mt: 1.5, mb: 3 }} />

        {/* All seven pillars on one row — the letters read K-I-M-O-R-A-H */}
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            columnGap: { xs: 0.75, sm: 2 },
            mt: 0.5,
            alignItems: "start",
            justifyItems: "center",
          }}
        >
          {PILLARS.map((p) => (
            <PillarButton key={p.letter} pillar={p} onSelect={handleSelect} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;
