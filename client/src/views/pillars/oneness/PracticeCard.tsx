import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import NightsStayRoundedIcon from "@mui/icons-material/NightsStayRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import Diversity1RoundedIcon from "@mui/icons-material/Diversity1Rounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import WbTwilightRoundedIcon from "@mui/icons-material/WbTwilightRounded";
import { OnenessCard } from "./oneness-data";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const GREEN = "#245c4a";

const ICONS: Record<string, React.ElementType> = {
  meditation: SelfImprovementRoundedIcon,
  moon: NightsStayRoundedIcon,
  leaf: EnergySavingsLeafRoundedIcon,
  people: Diversity1RoundedIcon,
  lotus: SpaRoundedIcon,
  crystal: DiamondRoundedIcon,
  telepathy: PsychologyRoundedIcon,
  temple: AccountBalanceRoundedIcon,
  path: RouteRoundedIcon,
  sunset: WbTwilightRoundedIcon,
};

/** Icon card used by both "Pathways" (arrow button) and "Specialized" (Explore pill). */
const PracticeCard: React.FC<{ card: OnenessCard; variant: "arrow" | "explore"; onAction?: () => void }> = ({
  card,
  variant,
  onAction,
}) => {
  const Icon = ICONS[card.icon] ?? SpaRoundedIcon;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 1,
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 8px 22px rgba(30,70,60,0.14)",
      }}
    >
      <Box sx={{ width: 60, height: 60, borderRadius: "50%", bgcolor: `${card.accent}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon sx={{ color: card.accent, fontSize: 30 }} />
      </Box>
      <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: GREEN, fontSize: { xs: 15, sm: 17 }, lineHeight: 1.15 }}>
        {card.title}
      </Typography>
      <Typography sx={{ color: "#4a6a5e", fontSize: { xs: 12, sm: 13 }, lineHeight: 1.4, flexGrow: 1 }}>
        {card.description}
      </Typography>
      {variant === "arrow" ? (
        <IconButton
          onClick={onAction}
          aria-label={card.title}
          sx={{ mt: 0.5, width: 34, height: 34, bgcolor: card.accent, color: "#fff", "&:hover": { bgcolor: card.accent, filter: "brightness(0.92)" } }}
        >
          <ChevronRightRoundedIcon />
        </IconButton>
      ) : (
        <Button
          onClick={onAction}
          sx={{ mt: 0.5, bgcolor: card.accent, color: "#fff", textTransform: "none", fontWeight: 600, borderRadius: 999, px: 2.5, boxShadow: "none", "&:hover": { bgcolor: card.accent, filter: "brightness(0.92)", boxShadow: "none" } }}
        >
          Explore
        </Button>
      )}
    </Box>
  );
};

export default PracticeCard;
