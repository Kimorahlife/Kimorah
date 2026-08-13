import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useTranslation } from "react-i18next";
import { MissionPartner } from "./mission-data";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

/** A single "Featured Partners" row. Data-driven — one per MissionPartner. */
const PartnerRow: React.FC<{ partner: MissionPartner }> = ({ partner }) => {
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language).startsWith("es");
  const wideLogo = partner.id === "humanamente" || partner.id === "gem";
  return (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: "center",
      gap: 2,
      p: { xs: 1.5, sm: 2.25 },
      minHeight: { xs: 138, sm: 154 },
      borderRadius: 3,
      bgcolor: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    }}
  >
    <Avatar
      src={partner.logoUrl}
      sx={{
        width: wideLogo ? { xs: 128, sm: 180 } : 84,
        height: wideLogo ? { xs: 54, sm: 75 } : 84,
        borderRadius: wideLogo ? 2 : "50%",
        flexShrink: 0,
        fontWeight: 700,
        fontSize: 14,
        color: "#fff",
        // Transparent behind logos so they sit cleanly on the card; initials
        // fall back to the partner's accent colour.
        bgcolor: partner.id === "humanamente" ? partner.accent : wideLogo ? "#f6f5f2" : partner.logoUrl ? "transparent" : partner.accent,
        "& img": { width: "100%", height: "100%", objectFit: "contain", p: wideLogo ? 0 : 0.4 },
      }}
    >
      {initials(partner.name)}
    </Avatar>
    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
      <Typography sx={{ fontWeight: 700, color: "#2f2a63", fontSize: { xs: 15, sm: 17 } }}>
        {partner.name}
      </Typography>
      <Typography sx={{ color: "#5b5680", fontSize: { xs: 12.5, sm: 14 } }}>
        {partner.description}
      </Typography>
    </Box>
    <Button
      variant="contained"
      endIcon={<ChevronRightRoundedIcon />}
      href={partner.url}
      target={partner.url ? "_blank" : undefined}
      rel={partner.url ? "noopener noreferrer" : undefined}
      sx={{
        bgcolor: partner.accent,
        color: "#fff",
        textTransform: "none",
        borderRadius: 999,
        minWidth: { xs: 128, sm: 152 },
        width: { xs: "100%", sm: "auto" },
        height: 46,
        whiteSpace: "nowrap",
        boxShadow: "none",
        "&:hover": { bgcolor: partner.accent, filter: "brightness(0.92)", boxShadow: "none" },
      }}
    >
      {spanish ? "Conoce más" : "Learn More"}
    </Button>
  </Box>
  );
};

export default PartnerRow;
