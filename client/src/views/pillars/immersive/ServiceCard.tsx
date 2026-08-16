import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import { ImmersiveService } from "./immersive-data";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const INDIGO = "#3a2f6e";

/** One Immersive service card. Data-driven; renders a placeholder until an image exists. */
const ServiceCard: React.FC<{ service: ImmersiveService; onAction?: () => void }> = ({ service, onAction }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      borderRadius: 3,
      overflow: "hidden",
      bgcolor: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 8px 24px rgba(60,40,90,0.15)",
    }}
  >
    {service.imageUrl ? (
      <Box component="img" src={service.imageUrl} alt={service.title} sx={{ width: "100%", height: { xs: 132, sm: 152 }, objectFit: "cover", objectPosition: service.id === "grief" ? "center 36%" : "center" }} />
    ) : (
      <Box sx={{ height: { xs: 132, sm: 152 }, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #b7a6d6 0%, #8b79bd 100%)" }}>
        <SpaRoundedIcon sx={{ color: "rgba(255,255,255,0.5)", fontSize: 46 }} />
      </Box>
    )}
    <Box sx={{ p: { xs: 2, sm: 2.5 }, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1, flexGrow: 1 }}>
      <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: INDIGO, fontSize: { xs: 18, sm: 21 } }}>
        {service.title}
      </Typography>
      <Typography sx={{ color: "#5b5387", fontSize: { xs: 13, sm: 14 }, lineHeight: 1.4 }}>
        {service.description}
      </Typography>
      <Button
        onClick={onAction}
        endIcon={<ChevronRightRoundedIcon />}
        sx={{
          mt: "auto",
          bgcolor: "#e7e0f3",
          color: "#4b3f7a",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 999,
          px: 2,
          boxShadow: "none",
          "&:hover": { bgcolor: "#dcd2ee", boxShadow: "none" },
        }}
      >
        {service.buttonLabel}
      </Button>
    </Box>
  </Box>
);

export default ServiceCard;
