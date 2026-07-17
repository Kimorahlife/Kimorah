import React, { ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";
import { kindnessData } from "./kindness-data";
import Sidebar from "./Sidebar";
import { INK } from "./components";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const GOLD = "#d8b25a";

/**
 * Shared Coquí layout: dark page + sidebar nav + hero. Used by both the
 * research dashboard and the survey (they only differ by the hero title, the
 * active nav item, and the body content passed as children).
 */
const CoquiShell: React.FC<{ activeId: string; heroTitle: string; children: ReactNode }> = ({ activeId, heroTitle, children }) => {
  const navigate = useNavigate();
  const h = kindnessData.header;

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "#221d45", color: INK, display: "flex" }}>
      <Sidebar nav={kindnessData.nav} quote={kindnessData.sidebarQuote} activeId={activeId} />

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Button
          onClick={() => navigate("/mission")}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            display: { xs: "inline-flex", md: "none" },
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 20,
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            borderRadius: 999,
            bgcolor: "rgba(0,0,0,0.5)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
          }}
        >
          Back
        </Button>

        {/* Hero */}
        <Box
          sx={{
            position: "relative",
            px: { xs: 2, sm: 4 },
            py: 5,
            backgroundImage: "url('/pillars/kindness-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(34,29,69,0.5) 0%, rgba(34,29,69,0.82) 100%)" }} />
          <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ color: GOLD, fontWeight: 700, letterSpacing: 2, fontSize: { xs: 12, sm: 14 } }}>{h.eyebrow}</Typography>
              <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: "#fff", fontSize: { xs: 32, sm: 52 }, lineHeight: 1.05, mt: 0.5 }}>
                {heroTitle}
              </Typography>
              <Typography sx={{ color: "#d9d5f0", fontSize: { xs: 14, sm: 17 }, mt: 1, maxWidth: 560 }}>{h.subtitle}</Typography>
            </Box>
            <Box
              component="img"
              src={h.frogImage}
              alt="Coquí"
              sx={{ width: { xs: 84, sm: 118 }, height: { xs: 84, sm: 118 }, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.35)", flexShrink: 0 }}
            />
          </Box>
        </Box>

        {children}
      </Box>
    </Box>
  );
};

export default CoquiShell;
