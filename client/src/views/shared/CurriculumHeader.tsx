import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LogoBadge from "../landing/LogoBadge";
import LanguageMenu from "./LanguageMenu";
import { useToken } from "../authentication/components/useToken";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const PURPLE = "#6540b2";

/**
 * The header a curriculum reads under.
 *
 * SiteHeader carries the seven-pillar marketing navigation, which is the wrong
 * furniture around a session someone is working through — it invites them out
 * of the material rather than through it. This keeps only what a reader needs
 * at hand: the brand, the way back to their dashboard, and the language.
 *
 * Rendered by the session page itself rather than globally, so it appears
 * identically whether the curriculum is being read as the Mission template or
 * as a group's own copy.
 */
const CurriculumHeader: React.FC = () => {
  const navigate = useNavigate();
  const [, , isTokenValid] = useToken();
  const signedIn = isTokenValid;
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "en").startsWith("es");

  return (
    <Box
      component="header"
      sx={{
        background: "linear-gradient(90deg,#141336 0%,#1a1a44 100%)",
        borderBottom: "1px solid rgba(255,255,255,.09)",
      }}
    >
      <Box
        sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 2, py: { xs: 1, md: 1.25 }, px: { xs: 2, sm: 3, md: 5 },
        }}
      >
        <Box
          onClick={() => navigate(signedIn ? "/dashboard" : "/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate(signedIn ? "/dashboard" : "/");
          }}
          sx={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}
        >
          <LogoBadge size={{ xs: 44, md: 54 }} />
          <Typography
            sx={{
              ml: 1.5, display: { xs: "none", sm: "block" },
              fontFamily: SERIF, color: "#fff",
              fontSize: { xs: 19, md: 24 }, letterSpacing: 4, lineHeight: 1,
            }}
          >
            KIMORAH
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.25, sm: 2 }, flexShrink: 0 }}>
          <Button
            onClick={() => navigate(signedIn ? "/dashboard" : "/login")}
            variant="contained"
            sx={{
              bgcolor: PURPLE, color: "#fff", borderRadius: 99,
              px: { xs: 2.25, sm: 3 }, py: 1.1,
              fontSize: { xs: 12, sm: 13 }, fontWeight: 800, whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": { bgcolor: "#553599", boxShadow: "none" },
            }}
          >
            {signedIn ? (spanish ? "PANEL" : "DASHBOARD") : spanish ? "MIEMBROS" : "MEMBERS"}
          </Button>
          <LanguageMenu
            variant="onDark"
            sx={{ fontSize: { xs: 12.5, sm: 13.5 }, px: { xs: 1.7, sm: 2.1 }, py: { xs: 0.7, sm: 0.85 } }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CurriculumHeader;
