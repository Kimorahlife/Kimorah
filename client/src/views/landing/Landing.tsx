import React, { useEffect } from "react";
import { Box, Button, ButtonBase, Typography } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useToken } from "../authentication/components/useToken";
import { AppDispatch } from "../../store/store";
import { loadRoles } from "../../store/slices/roles";
import { useNavigate } from "react-router-dom";
import LanguageMenu from "../shared/LanguageMenu";
import LogoBadge from "./LogoBadge";
import LandingBackground from "./LandingBackground";
import { PILLARS, Pillar } from "./pillars";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';

// Subtle shadow so the plain white text stays legible over the photo (no glow).
const HALO = "0 1px 3px rgba(0,0,0,0.45)";

// Warm sun-gold from the KIMORAH LIFE logo.
const SUN = "#e8b53f";

const PillarButton: React.FC<{
  pillar: Pillar;
  onSelect: (p: Pillar) => void;
  /** Locked: the viewer is signed out, so nothing here is open to them yet. */
  locked?: boolean;
  spanish?: boolean;
}> = ({ pillar, onSelect, locked = false, spanish = false }) => (
  <ButtonBase
    focusRipple
    disabled={locked}
    aria-label={
      locked
        ? `${pillar.label} — ${spanish ? "próximamente" : "coming soon"}`
        : pillar.label
    }
    onClick={() => onSelect(pillar)}
    sx={{
      flexDirection: "column",
      gap: 0.5,
      borderRadius: 2,
      p: 0.25,
      width: "100%",
      minWidth: 0,
      verticalAlign: "top",
      cursor: locked ? "default" : "pointer",
      ...(!locked && {
        "&:hover .kimorah-circle": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 22px rgba(40,40,70,0.28)",
        },
      }),
    }}
  >
    <Box
      className="kimorah-circle"
      sx={{
        "--tile": "clamp(36px, min(15vh, 11.5vw), 180px)",
        width: "var(--tile)",
        height: "var(--tile)",
        flexShrink: 0,
        mx: "auto",
        borderRadius: "50%",
        bgcolor: pillar.color,
        color: "#fff",
        // Signed out: every pillar reads as unavailable — desaturated and faded
        // — so the brand colours are something signing in reveals.
        ...(locked && { filter: "grayscale(0.9)", opacity: 0.5 }),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 16px rgba(40,40,70,0.18)",
        transition: "transform .18s ease, box-shadow .18s ease",
        "& svg": { fontSize: "calc(var(--tile) * 0.21)" },
        "& .mi-glyph": { fontSize: "calc(var(--tile) * 0.30)" },
        "& .mission-glyph": { position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" },
        "& .mission-glyph::after": { content: '\"\"', position: "absolute", top: "8%", bottom: "-36%", left: "50%", width: 2, bgcolor: "currentColor", transform: "translateX(-50%)" },
        "& .mission-staff": { position: "absolute", top: "64%", left: "50%", zIndex: 1, fontFamily: SERIF, fontSize: ".72em", lineHeight: 1, transform: "translateX(-50%)" },
        "& .oneness-glyph": { position: "relative", display: "block", width: "calc(var(--tile) * 0.30)", height: "calc(var(--tile) * 0.30)" },
        "& .oneness-glyph i": { position: "absolute", width: "58%", height: "58%", border: "1.5px solid currentColor", borderRadius: "50%" },
        "& .oneness-glyph i:nth-of-type(1)": { top: 0, left: "21%" },
        "& .oneness-glyph i:nth-of-type(2)": { top: "21%", right: 0 },
        "& .oneness-glyph i:nth-of-type(3)": { right: "8%", bottom: 0 },
        "& .oneness-glyph i:nth-of-type(4)": { left: "8%", bottom: 0 },
        "& .oneness-glyph i:nth-of-type(5)": { top: "21%", left: 0 },
        "& .papyrus-glyph": { width: "calc(var(--tile) * 0.30)", height: "calc(var(--tile) * 0.30)", overflow: "visible" },
      }}
    >
      <Typography
        component="span"
        sx={{
          width: "100%",
          height: "calc(var(--tile) * 0.31)",
          display: "grid",
          placeItems: "center",
          fontFamily: SERIF,
          fontSize: "calc(var(--tile) * 0.29)",
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
          width: "calc(var(--tile) * 0.36)",
          height: "calc(var(--tile) * 0.34)",
          mt: "calc(var(--tile) * 0.025)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 0,
          "& > svg": { width: "calc(var(--tile) * 0.30)", height: "calc(var(--tile) * 0.30)", fontSize: "calc(var(--tile) * 0.30)" },
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
        fontSize: "clamp(9px, 1.7vh, 17px)",
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
    {locked && (
      <Box
        component="span"
        sx={{
          mt: "clamp(1px, 0.5vh, 5px)",
          px: "clamp(4px, 0.8vw, 11px)",
          py: "clamp(1px, 0.25vh, 3px)",
          borderRadius: 99,
          border: "1px solid rgba(255,255,255,.45)",
          bgcolor: "rgba(255,255,255,.14)",
          backdropFilter: "blur(4px)",
          color: "#fff",
          fontSize: "clamp(6.5px, 1.15vh, 12px)",
          fontWeight: 800,
          letterSpacing: 0.6,
          lineHeight: 1.4,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        Coming soon
      </Box>
    )}
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
  const dispatch = useDispatch<AppDispatch>();
  const [token, , isTokenValid] = useToken();
  const signedIn = isTokenValid;
  const spanish = (i18n.resolvedLanguage || i18n.language || "en").startsWith("es");

  // The landing sits outside PrivateRoute, so nothing has fetched the roles
  // list yet — without this the viewer's permissions read as empty and every
  // tile would look locked.
  useEffect(() => {
    if (token) dispatch(loadRoles(token));
  }, [token, dispatch]);


  /**
   * Locked while signed out, except the one launched pillar which is open to
   * everyone. Signing in unlocks the rest — a member has full access.
   */
  const isLocked = (pillar: Pillar) => !signedIn && !pillar.alwaysAvailable;

  const handleSelect = (pillar: Pillar) => {
    if (isLocked(pillar)) return;
    navigate(pillar.path);
  };

  return (
    <Box
      sx={{
        position: "relative",
        // The splash must fit the viewport exactly — never scroll, never clip.
        // Everything inside is sized in vh-based clamp()s so the whole stack
        // shrinks with the screen instead of overflowing it.
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

      {/* Top-right: language dropdown + ghost Members/Dashboard button. The
          landing shows no site banner, so these are its only chrome. */}
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
          onClick={() => navigate(signedIn ? "/dashboard" : "/login")}
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
          {signedIn ? (spanish ? "Panel" : "Dashboard") : spanish ? "Miembros" : "Members"}
        </Button>
        <LanguageMenu variant="ghost" />
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1280,
          px: { xs: 1.25, sm: 3 },
          py: "clamp(8px, 2vh, 28px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <LogoBadge size="clamp(88px, 20vh, 260px)" />

        <Typography
          component="h1"
          sx={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: "clamp(34px, 8vh, 82px)",
            color: "#ffffff",
            textShadow: HALO,
            mt: "clamp(3px, 1.1vh, 13px)",
            lineHeight: 1.1,
          }}
        >
          Welcome
        </Typography>

        <Typography
          sx={{
            mt: "clamp(3px, 1vh, 11px)",
            fontWeight: 700,
            fontSize: "clamp(15px, 2.7vh, 27px)",
            color: "#ffffff",
            textShadow: HALO,
          }}
        >
          This is your space.
        </Typography>
        <Typography
          sx={{
            mt: "clamp(2px, 0.6vh, 6px)",
            fontSize: "clamp(13px, 2.2vh, 22px)",
            color: "#ffffff",
            textShadow: HALO,
          }}
        >
          Choose what you want to nurture today.
        </Typography>

        <Box sx={{ mt: "clamp(4px, 1.5vh, 15px)", mb: "clamp(3px, 1.2vh, 12px)" }}>
          <Divider />
        </Box>

        <Typography
          sx={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "clamp(13.5px, 2.4vh, 24px)",
            color: "#ffffff",
            textShadow: HALO,
            maxWidth: 360,
            lineHeight: 1.4,
          }}
        >
          Every choice is a step toward your well-being.
        </Typography>

        <FavoriteRoundedIcon
          sx={{ color: SUN, fontSize: "clamp(20px, 4.2vh, 50px)", mt: "clamp(3px, 1vh, 10px)", mb: "clamp(4px, 1.5vh, 15px)", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }}
        />

        {/* All seven pillars on one row — the letters read K-I-M-O-R-A-H */}
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            columnGap: "clamp(2px, 1vw, 16px)",
            mt: "clamp(2px, 0.6vh, 6px)",
            alignItems: "start",
            justifyItems: "center",
          }}
        >
          {PILLARS.map((p) => (
            <PillarButton
              key={p.letter}
              pillar={p}
              onSelect={handleSelect}
              locked={isLocked(p)}
              spanish={spanish}
            />
          ))}
        </Box>

      </Box>
    </Box>
  );
};

export default Landing;
