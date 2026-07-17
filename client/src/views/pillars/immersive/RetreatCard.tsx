import React from "react";
import { Box, Typography } from "@mui/material";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";
import { ImmersiveRetreat } from "./immersive-data";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const INDIGO = "#3a2f6e";

/** One Retreat card (smaller, no button). Data-driven; placeholder until an image exists. */
const RetreatCard: React.FC<{ retreat: ImmersiveRetreat }> = ({ retreat }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      borderRadius: 3,
      overflow: "hidden",
      bgcolor: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 6px 18px rgba(60,40,90,0.12)",
    }}
  >
    {retreat.imageUrl ? (
      <Box component="img" src={retreat.imageUrl} alt={retreat.title} sx={{ width: "100%", height: 92, objectFit: "cover" }} />
    ) : (
      <Box sx={{ height: 92, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #a89ac9 0%, #7d6bb0 100%)" }}>
        <LandscapeRoundedIcon sx={{ color: "rgba(255,255,255,0.5)", fontSize: 34 }} />
      </Box>
    )}
    <Box sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}>
      <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: INDIGO, fontSize: { xs: 15, sm: 17 } }}>
        {retreat.title}
      </Typography>
      <Typography sx={{ color: "#5b5387", fontSize: { xs: 12, sm: 13 }, lineHeight: 1.4, mt: 0.5 }}>
        {retreat.description}
      </Typography>
    </Box>
  </Box>
);

export default RetreatCard;
