import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import { OnenessOffering } from "./oneness-data";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const GREEN = "#245c4a";
const TEAL = "#2e7d6a";

/** A "Featured Offering" row. Data-driven; thumbnail is a placeholder until an image exists. */
const OfferingRow: React.FC<{ offering: OnenessOffering; onAction?: () => void }> = ({ offering, onAction }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: { xs: 1.5, sm: 2 },
      p: { xs: 1.25, sm: 1.5 },
      borderRadius: 3,
      bgcolor: "rgba(255,255,255,0.9)",
      boxShadow: "0 6px 16px rgba(30,70,60,0.1)",
    }}
  >
    {offering.imageUrl ? (
      <Box component="img" src={offering.imageUrl} alt={offering.title} sx={{ width: { xs: 68, sm: 92 }, height: { xs: 52, sm: 64 }, borderRadius: 2, objectFit: "cover", flexShrink: 0 }} />
    ) : (
      <Box sx={{ width: { xs: 68, sm: 92 }, height: { xs: 52, sm: 64 }, borderRadius: 2, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #8fc7b6 0%, #4f9c86 100%)" }}>
        <SpaRoundedIcon sx={{ color: "rgba(255,255,255,0.6)", fontSize: 26 }} />
      </Box>
    )}

    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: GREEN, fontSize: { xs: 15, sm: 17 } }}>{offering.title}</Typography>
        {offering.badge && (
          <Box sx={{ bgcolor: offering.badgeColor ?? TEAL, color: "#fff", fontSize: 10.5, fontWeight: 700, px: 1, py: 0.25, borderRadius: 999 }}>
            {offering.badge}
          </Box>
        )}
      </Box>
      <Typography sx={{ color: "#4a6a5e", fontSize: { xs: 12.5, sm: 13.5 } }}>{offering.description}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5, color: "#6b8378", fontSize: 12 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <ScheduleRoundedIcon sx={{ fontSize: 14 }} /> {offering.duration}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <SignalCellularAltRoundedIcon sx={{ fontSize: 14 }} /> {offering.level}
        </Box>
      </Box>
    </Box>

    {offering.actionStyle === "play" ? (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
        <IconButton onClick={onAction} aria-label="Play" sx={{ width: 44, height: 44, bgcolor: TEAL, color: "#fff", "&:hover": { bgcolor: "#276b5b" } }}>
          <PlayArrowRoundedIcon />
        </IconButton>
        <Typography sx={{ color: GREEN, fontWeight: 600, display: { xs: "none", sm: "block" } }}>{offering.actionLabel}</Typography>
      </Box>
    ) : (
      <Box onClick={onAction} sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0, cursor: "pointer" }}>
        <Typography sx={{ color: GREEN, fontWeight: 600, whiteSpace: "nowrap", display: { xs: "none", sm: "block" } }}>{offering.actionLabel}</Typography>
        <IconButton aria-label={offering.actionLabel} sx={{ width: 36, height: 36, border: `1.5px solid ${TEAL}`, color: TEAL, "&:hover": { bgcolor: `${TEAL}14` } }}>
          <ChevronRightRoundedIcon />
        </IconButton>
      </Box>
    )}
  </Box>
);

export default OfferingRow;
