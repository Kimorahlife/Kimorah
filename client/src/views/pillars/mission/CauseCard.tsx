import React from "react";
import { Box, Typography } from "@mui/material";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import { CauseIcon, MissionCause } from "./mission-data";

const ICONS: Record<CauseIcon, React.ElementType> = {
  globe: PublicRoundedIcon,
  book: MenuBookRoundedIcon,
  palette: PaletteRoundedIcon,
  science: ScienceRoundedIcon,
};

/** A single "Explore Causes" card. Data-driven — one per MissionCause. */
const CauseCard: React.FC<{ cause: MissionCause; onClick?: () => void }> = ({ cause, onClick }) => {
  const Icon = ICONS[cause.icon];
  return (
    <Box
      onClick={onClick}
      sx={{
        borderRadius: 3,
        p: { xs: 2, sm: 2.5 },
        minHeight: { xs: 148, sm: 196 },
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: onClick ? "pointer" : "default",
        background: `linear-gradient(160deg, ${cause.color} 0%, rgba(0,0,0,0.28) 170%)`,
        boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
        transition: "transform .18s ease, box-shadow .18s ease",
        "&:hover": onClick ? { transform: "translateY(-4px)", boxShadow: "0 14px 30px rgba(0,0,0,0.3)" } : undefined,
      }}
    >
      <Icon sx={{ fontSize: { xs: 32, sm: 44 }, opacity: 0.95 }} />
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, sm: 19 }, lineHeight: 1.15 }}>
          {cause.title}
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: { xs: 12, sm: 13.5 }, opacity: 0.9 }}>
          {cause.subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default CauseCard;
