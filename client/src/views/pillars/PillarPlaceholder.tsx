import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";
import LogoBadge from "../landing/LogoBadge";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';

/** Simple "coming soon" placeholder for a pillar whose page isn't built yet. */
const PillarPlaceholder: React.FC<{ title: string; bg?: string }> = ({ title, bg }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
        backgroundColor: "#2a2140",
        backgroundImage: bg ? `url('${bg}')` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,12,40,0.5) 0%, rgba(20,12,40,0.72) 100%)" }} />

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

      <Box sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, p: 3 }}>
        <LogoBadge size={{ xs: 110, sm: 140 }} />
        <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: "#fff", fontSize: { xs: 44, sm: 60 }, lineHeight: 1, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
          {title}
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: { xs: 16, sm: 18 }, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
          Coming soon.
        </Typography>
        <Button
          onClick={() => navigate("/")}
          variant="contained"
          sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.16)", color: "#fff", textTransform: "none", borderRadius: 999, px: 3, boxShadow: "none", "&:hover": { bgcolor: "rgba(255,255,255,0.26)", boxShadow: "none" } }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default PillarPlaceholder;
