import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useTranslation } from "react-i18next";
import { PriorityResearchItem } from "./mission-data";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';

/** The "Priority Research" feature card. Data-driven from PriorityResearchItem. */
const PriorityResearchCard: React.FC<{
  item: PriorityResearchItem;
  onTakeSurvey?: () => void;
  onReviewData?: () => void;
}> = ({ item }) => {
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language).startsWith("es");
  return (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      gap: { xs: 2, md: 3 },
      alignItems: { md: "center" },
      p: { xs: 2.5, sm: 3 },
      borderRadius: 4,
      bgcolor: "rgba(244,242,251,0.9)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      filter: "grayscale(1)",
      opacity: 0.78,
    }}
  >
    <Avatar
      src={item.imageUrl}
      sx={{
        width: { xs: 96, md: 120 },
        height: { xs: 96, md: 120 },
        fontSize: 52,
        bgcolor: "transparent",
        alignSelf: { xs: "center", md: "flex-start" },
        flexShrink: 0,
      }}
    >
      🐸
    </Avatar>
    <Box sx={{ flex: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#c99a1e", mb: 0.5 }}>
        <StarRoundedIcon sx={{ fontSize: 18 }} />
        <Typography sx={{ fontWeight: 700, letterSpacing: 1, fontSize: 12 }}>{item.badge}</Typography>
      </Box>
      <Typography
        sx={{ fontFamily: SERIF, fontWeight: 700, color: "#2f2a63", fontSize: { xs: 22, sm: 26 }, lineHeight: 1.1 }}
      >
        {item.title}
      </Typography>
      <Typography sx={{ fontWeight: 600, color: "#3a3568", fontSize: { xs: 14, sm: 16 }, mt: 0.5 }}>
        {item.subtitle}
      </Typography>
      <Typography sx={{ color: "#5b5680", fontSize: { xs: 13, sm: 14 }, mt: 1, maxWidth: 640 }}>
        {item.description}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
        <Button
          variant="contained"
          disabled
          sx={{ bgcolor: "#5a4a9c", color: "#fff", textTransform: "none", borderRadius: 999, boxShadow: "none", "&:hover": { bgcolor: "#4c3f88", boxShadow: "none" } }}
        >
          {spanish ? "Realizar encuesta ›" : "Take Survey ›"}
        </Button>
        <Button
          variant="outlined"
          disabled
          sx={{ color: "#5a4a9c", borderColor: "#5a4a9c", textTransform: "none", borderRadius: 999, "&:hover": { borderColor: "#4c3f88", bgcolor: "rgba(90,74,156,0.08)" } }}
        >
          {spanish ? "Revisar datos ›" : "Review Data ›"}
        </Button>
      </Box>
    </Box>
    <Box
      sx={{
        width: { xs: "100%", md: 230 },
        minHeight: { md: 190 },
        borderTop: { xs: "1px dashed rgba(47,42,99,.35)", md: 0 },
        borderLeft: { xs: 0, md: "1px dashed rgba(47,42,99,.35)" },
        pt: { xs: 2, md: 0 },
        pl: { md: 3 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#4f4b67",
      }}
    >
      <AccessTimeRoundedIcon sx={{ fontSize: 64, mb: 1 }} />
      <Typography sx={{ fontWeight: 800, fontSize: 22, letterSpacing: 1 }}>
        {spanish ? "PRÓXIMAMENTE" : "COMING SOON"}
      </Typography>
      <Typography sx={{ fontSize: 13.5, lineHeight: 1.45, mt: 1 }}>
        {spanish ? "Este proyecto de investigación está actualmente en desarrollo." : "This research project is currently in development."}
      </Typography>
      <Typography sx={{ fontSize: 13, fontStyle: "italic", mt: 2 }}>
        {spanish ? "¡Mantente al tanto!" : "Stay tuned for updates!"}
      </Typography>
    </Box>
  </Box>
  );
};

export default PriorityResearchCard;
