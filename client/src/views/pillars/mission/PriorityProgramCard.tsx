import React from "react";
import { Box, Button, Typography } from "@mui/material";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { PriorityProgramItem } from "./mission-data";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';

/** Compact split feature card for the Mission page's highest-priority program. */
const PriorityProgramCard: React.FC<{
  item: PriorityProgramItem;
  onExplore?: () => void;
  onWatchVideo?: () => void;
}> = ({ item, onExplore, onWatchVideo }) => (
  <Box
    sx={{
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.15fr) minmax(360px, 0.85fr)" },
      minHeight: { xs: 0, md: 390 },
      borderRadius: 4,
      bgcolor: "#11122f",
      boxShadow: "0 16px 40px rgba(12, 9, 35, 0.28)",
    }}
  >
    <Box
      sx={{
        minHeight: { xs: 300, sm: 380, md: "100%" },
        backgroundImage: `linear-gradient(90deg, rgba(18,16,49,0.15), rgba(18,16,49,0.46)), url('${item.imageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />

    <Box
      sx={{
        p: { xs: 3, sm: 4, md: 4.5 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <Typography
        component="h3"
        sx={{ fontFamily: SERIF, color: "#fff", fontSize: { xs: 34, sm: 40 }, lineHeight: 1, letterSpacing: -0.5 }}
      >
        {item.title}
        <Box component="span" sx={{ display: "block", color: "#a779df", fontStyle: "italic", mt: 0.6 }}>
          {item.highlightedTitle}
        </Box>
      </Typography>

      <Box sx={{ width: 40, height: 2, bgcolor: "rgba(255,255,255,0.65)", my: 2.25 }} />
      <Typography sx={{ color: "rgba(255,255,255,0.84)", fontSize: { xs: 14, sm: 15 }, lineHeight: 1.5 }}>
        {item.description}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: 2.5,
          p: 2,
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: 2.5,
          bgcolor: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(4px)",
        }}
      >
        <GroupsOutlinedIcon sx={{ color: "#b59ad9", fontSize: 36, flexShrink: 0 }} />
        <Box>
          <Typography sx={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 1.25 }}>
            {item.audience}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 12.5, lineHeight: 1.45, mt: 0.5 }}>
            {item.audienceDescription}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row", md: "column", lg: "row" }, gap: 1.5, mt: 2.5 }}>
        <Button
          variant="contained"
          onClick={onExplore}
          sx={{ bgcolor: "#7752b5", color: "#fff", borderRadius: 999, px: 3, py: 1.25, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, whiteSpace: "nowrap", boxShadow: "none", "&:hover": { bgcolor: "#8964c5", boxShadow: "none" } }}
        >
          {item.primaryAction}
        </Button>
        <Button
          variant="outlined"
          onClick={onWatchVideo}
          startIcon={<Box sx={{ display: "grid", placeItems: "center", border: "1px solid currentColor", borderRadius: "50%", width: 21, height: 21 }}><PlayArrowRoundedIcon sx={{ fontSize: 15 }} /></Box>}
          sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.62)", borderRadius: 999, px: 2.5, py: 1.1, fontSize: 11, fontWeight: 700, letterSpacing: 1, whiteSpace: "nowrap", "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" } }}
        >
          {item.secondaryAction}
        </Button>
      </Box>
    </Box>
  </Box>
);

export default PriorityProgramCard;
