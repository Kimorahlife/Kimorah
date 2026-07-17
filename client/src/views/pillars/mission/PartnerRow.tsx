import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { MissionPartner } from "./mission-data";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

/** A single "Featured Partners" row. Data-driven — one per MissionPartner. */
const PartnerRow: React.FC<{ partner: MissionPartner }> = ({ partner }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      p: { xs: 1.5, sm: 2 },
      borderRadius: 3,
      bgcolor: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    }}
  >
    <Avatar
      src={partner.logoUrl}
      sx={{
        width: 84,
        height: 84,
        flexShrink: 0,
        fontWeight: 700,
        fontSize: 14,
        color: "#fff",
        // Transparent behind logos so they sit cleanly on the card; initials
        // fall back to the partner's accent colour.
        bgcolor: partner.logoUrl ? "transparent" : partner.accent,
        "& img": { objectFit: "contain", p: 0.4 },
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
      sx={{
        bgcolor: partner.accent,
        color: "#fff",
        textTransform: "none",
        borderRadius: 999,
        whiteSpace: "nowrap",
        boxShadow: "none",
        "&:hover": { bgcolor: partner.accent, filter: "brightness(0.92)", boxShadow: "none" },
      }}
    >
      Learn More
    </Button>
  </Box>
);

export default PartnerRow;
