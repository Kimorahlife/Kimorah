import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useFeatureFullAccess } from "../../shared/permissions";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { PriorityProgramItem } from "./mission-data";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';

/**
 * Priority programme card. The two "Explore curriculum" buttons open only for
 * someone who can genuinely work in the curriculum: Add AND (Edit OR Delete)
 * on `curriculums`. A partial grant — say Add alone — is not enough, so the
 * buttons render greyed and inert rather than failing after the click.
 */
const PriorityProgramCard: React.FC<{
  item: PriorityProgramItem;
  onExplore?: () => void;
  onExploreSecondary?: () => void;
  onWatchVideo?: () => void;
}> = ({ item, onExplore, onExploreSecondary, onWatchVideo }) => {
  const canOpenCurriculum = useFeatureFullAccess("curriculums");
  return (
  <Box
    sx={{
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: { xs: "1fr", lg: "46% 54%" },
      minHeight: { xs: 0, lg: 620 },
      borderRadius: 4,
      bgcolor: "#090e1f",
      boxShadow: "0 18px 46px rgba(12,9,35,.34)",
    }}
  >
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 480, sm: 590, lg: "100%" },
        p: { xs: 3, sm: 5 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "white",
        backgroundImage: `linear-gradient(180deg,rgba(12,11,34,.18),rgba(12,11,34,.18)),linear-gradient(90deg,rgba(12,11,34,.58),transparent 72%),url('${item.imageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: { xs: "30% center", lg: "28% center" },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg,rgba(104,38,65,.08),rgba(20,13,37,.22))",
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 430 }}>
        <Typography component="h3" sx={{ fontFamily: SERIF, fontSize: { xs: 45, sm: 57 }, lineHeight: 1.05, fontWeight: 600 }}>
          {item.title}
          <Box component="span" sx={{ display: "block", color: "#a875e2", fontStyle: "italic", mt: 0.7 }}>
            {item.highlightedTitle}
          </Box>
        </Typography>
        <Box sx={{ width: 48, borderTop: "2px solid rgba(255,255,255,.75)", my: 3 }} />
        <Typography sx={{ maxWidth: 370, color: "rgba(255,255,255,.9)", fontSize: { xs: 16, sm: 17 }, lineHeight: 1.6 }}>
          {item.description}
        </Typography>
      </Box>
    </Box>

    <Box sx={{ p: { xs: 2.5, sm: 3.5 }, display: "flex", flexDirection: "column", bgcolor: "rgba(7,13,31,.97)", color: "white" }}>
      <Typography sx={{ textAlign: "center", fontSize: { xs: 15, sm: 17 }, fontWeight: 700, letterSpacing: 2.2, lineHeight: 1.45, px: 2, mb: 2.5 }}>
        {item.purpose}
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        {item.curricula.map((curriculum, index) => (
          <Box
            key={curriculum.number}
            sx={{
              minHeight: 365,
              p: { xs: 2.5, sm: 2 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              border: `1px solid ${curriculum.accent}`,
              borderRadius: 3,
              background: `radial-gradient(circle at 50% 0%,${curriculum.accent}22,transparent 42%),rgba(13,19,40,.72)`,
            }}
          >
            <Box sx={{ width: 58, height: 58, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: curriculum.accent, fontSize: 24, fontWeight: 800 }}>
              {curriculum.number}
            </Box>
            <Box
              sx={{
                minHeight: { xs: 0, sm: 135 },
                mt: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 26, sm: 27 }, lineHeight: 1.12 }}>
                {curriculum.title}
              </Typography>
              {curriculum.highlightedTitle && (
                <Typography sx={{ fontFamily: SERIF, fontStyle: "italic", color: "#a875e2", fontSize: 24, mt: 0.5 }}>
                  {curriculum.highlightedTitle}
                </Typography>
              )}
            </Box>
            <Box sx={{ width: 38, borderTop: "1px solid rgba(255,255,255,.78)", my: 2 }} />
            <Typography sx={{ flex: 1, minHeight: { sm: 106 }, display: "flex", alignItems: "flex-start", justifyContent: "center", color: "rgba(255,255,255,.86)", fontSize: 13.5, lineHeight: 1.55 }}>
              {curriculum.description}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              disabled={!canOpenCurriculum}
              onClick={index === 0 ? onExplore : onExploreSecondary}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                mt: 2,
                bgcolor: curriculum.accent,
                borderRadius: 99,
                py: 1.15,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.1,
                boxShadow: "none",
                "&:hover": { bgcolor: curriculum.accent, filter: "brightness(1.1)", boxShadow: "none" },
                "&.Mui-disabled": {
                  bgcolor: "rgba(255,255,255,.14)",
                  color: "rgba(255,255,255,.45)",
                },
              }}
            >
              {curriculum.action}
            </Button>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2, p: 2, border: "1px solid rgba(255,255,255,.35)", borderRadius: 2.5 }}>
        <GroupsOutlinedIcon sx={{ color: "#a875e2", fontSize: 38, flexShrink: 0 }} />
        <Box>
          <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2 }}>{item.audience}</Typography>
          <Typography sx={{ color: "rgba(255,255,255,.75)", fontSize: 12.5, lineHeight: 1.45, mt: 0.4 }}>{item.audienceDescription}</Typography>
        </Box>
      </Box>

      <Button
        variant="outlined"
        onClick={onWatchVideo}
        startIcon={<Box sx={{ display: "grid", placeItems: "center", border: "1px solid currentColor", borderRadius: "50%", width: 25, height: 25 }}><PlayArrowRoundedIcon sx={{ fontSize: 17 }} /></Box>}
        sx={{ alignSelf: "center", mt: 2, color: "white", borderColor: "rgba(255,255,255,.55)", borderRadius: 99, px: 4, py: 1.1, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,.06)" } }}
      >
        {item.secondaryAction}
      </Button>
    </Box>
    </Box>
  );
};

export default PriorityProgramCard;
