import React from "react";
import { Box, Button, ButtonBase, Typography } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageMenu from "../shared/LanguageMenu";
import LogoBadge from "./LogoBadge";
import LandingBackground from "./LandingBackground";
import { PILLARS, Pillar } from "./pillars";
import { PILLAR_CONTENT } from "../pillars/pillar-content";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';

// Subtle shadow so the plain white text stays legible over the photo (no glow).
const HALO = "0 1px 3px rgba(0,0,0,0.45)";

// Warm sun-gold from the KIMORAH LIFE logo.
const SUN = "#e8b53f";

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
      minWidth: 0,
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
        width: { xs: 80, sm: 124, md: 140 },
        height: { xs: 80, sm: 124, md: 140 },
        flexShrink: 0,
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
        "& .mi-glyph": { fontSize: { xs: 26, sm: 42 } },
        "& .mission-glyph": { position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" },
        "& .mission-glyph::after": { content: '\"\"', position: "absolute", top: "8%", bottom: "-36%", left: "50%", width: 2, bgcolor: "currentColor", transform: "translateX(-50%)" },
        "& .mission-staff": { position: "absolute", top: "64%", left: "50%", zIndex: 1, fontFamily: SERIF, fontSize: ".72em", lineHeight: 1, transform: "translateX(-50%)" },
        "& .oneness-glyph": { position: "relative", display: "block", width: { xs: 27, sm: 42 }, height: { xs: 27, sm: 42 } },
        "& .oneness-glyph i": { position: "absolute", width: "58%", height: "58%", border: "1.5px solid currentColor", borderRadius: "50%" },
        "& .oneness-glyph i:nth-of-type(1)": { top: 0, left: "21%" },
        "& .oneness-glyph i:nth-of-type(2)": { top: "21%", right: 0 },
        "& .oneness-glyph i:nth-of-type(3)": { right: "8%", bottom: 0 },
        "& .oneness-glyph i:nth-of-type(4)": { left: "8%", bottom: 0 },
        "& .oneness-glyph i:nth-of-type(5)": { top: "21%", left: 0 },
        "& .papyrus-glyph": { width: { xs: 27, sm: 42 }, height: { xs: 27, sm: 42 }, overflow: "visible" },
      }}
    >
      <Typography
        component="span"
        sx={{
          width: "100%",
          height: { xs: 27, sm: 44 },
          display: "grid",
          placeItems: "center",
          fontFamily: SERIF,
          fontSize: { xs: 24, sm: 40 },
          lineHeight: 1,
          fontWeight: 600,
        }}
      >
        {pillar.letter}
      </Typography>
      <Box
        className="pillar-icon-slot"
        sx={{
          position: "relative",
          width: { xs: 34, sm: 50 },
          height: { xs: 32, sm: 48 },
          mt: { xs: 0.15, sm: 0.35 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 0,
          "& > svg": { width: { xs: 27, sm: 42 }, height: { xs: 27, sm: 42 }, fontSize: { xs: 27, sm: 42 } },
          ...(pillar.letter === "I" && {
            pb: { xs: 0.5, sm: 0.8 },
            "&::after": {
              content: '\"\"',
              position: "absolute",
              left: "18%",
              right: "18%",
              bottom: { xs: 2, sm: 3 },
              height: { xs: 3, sm: 4 },
              border: "1.5px solid currentColor",
              borderTop: 0,
              borderRadius: "0 0 50% 50%",
            },
          }),
        }}
      >
        {pillar.icon}
      </Box>
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
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "en").startsWith("es");

  // Open full component pages or image-based pillar pages. Pillars without
  // either kind of page continue to the signup flow.
  const handleSelect = (pillar: Pillar) => {
    const slug = pillar.path.replace("/", "");
    const componentPages = new Set(["acceptance", "harmony"]);
    navigate(componentPages.has(slug) || PILLAR_CONTENT[slug] ? pillar.path : "/signup");
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100dvh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
            "linear-gradient(180deg, rgba(20,12,40,0.32) 0%, rgba(20,12,40,0.14) 32%, rgba(20,12,40,0) 58%)",
        }}
      />

      {/* Top-right: language dropdown + ghost Members button (white text) */}
      <Box
        data-language-switcher
        sx={{
          position: "absolute",
          top: { xs: 12, sm: 22 },
          right: { xs: 12, sm: 24 },
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
        }}
      >
        <Button
          onClick={() => navigate("/login")}
          variant="outlined"
          sx={{
            color: "#fff",
            borderColor: "rgba(255,255,255,.7)",
            borderRadius: 99,
            px: { xs: 1.75, sm: 2.25 },
            py: { xs: .55, sm: .7 },
            fontSize: { xs: 11.5, sm: 13 },
            fontWeight: 800,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            bgcolor: "rgba(255,255,255,.12)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 4px 14px rgba(0,0,0,.25)",
            "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,.22)" },
          }}
        >
          {spanish ? "Miembros" : "Members"}
        </Button>
        <LanguageMenu variant="ghost" />
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1280,
          px: 3,
          py: { xs: 2, sm: 3 },
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
            fontSize: { xs: 50, sm: 64 },
            color: "#ffffff",
            textShadow: HALO,
            mt: 1.25,
            lineHeight: 1.1,
          }}
        >
          Welcome
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontWeight: 700,
            fontSize: { xs: 18, sm: 21 },
            color: "#ffffff",
            textShadow: HALO,
          }}
        >
          This is your space.
        </Typography>
        <Typography
          sx={{
            mt: 0.5,
            fontSize: { xs: 15, sm: 17 },
            color: "#ffffff",
            textShadow: HALO,
          }}
        >
          Choose what you want to nurture today.
        </Typography>

        <Box sx={{ mt: 1.5, mb: 1.25 }}>
          <Divider />
        </Box>

        <Typography
          sx={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: { xs: 16, sm: 18.5 },
            color: "#ffffff",
            textShadow: HALO,
            maxWidth: 360,
            lineHeight: 1.5,
          }}
        >
          Every choice is a step toward your well-being.
        </Typography>

        <FavoriteRoundedIcon
          sx={{ color: SUN, fontSize: { xs: 34, sm: 40 }, mt: 1, mb: 1.5, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }}
        />

        {/* All seven pillars on one row — the letters read K-I-M-O-R-A-H */}
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
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
