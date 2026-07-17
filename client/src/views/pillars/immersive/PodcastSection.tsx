import React from "react";
import { Box, Typography } from "@mui/material";
import HeadphonesRoundedIcon from "@mui/icons-material/HeadphonesRounded";
import { ImmersivePodcast } from "./immersive-data";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const INDIGO = "#3a2f6e";

interface PodcastSectionProps {
  heading: string;
  subtitle: string;
  podcasts: ImmersivePodcast[];
}

const PodcastSection: React.FC<PodcastSectionProps> = ({ heading, subtitle, podcasts }) => (
  <Box component="section" sx={{ mt: { xs: 5, sm: 7 } }}>
    <Box sx={{ textAlign: "center" }}>
      <Typography component="h2" sx={{ fontFamily: SERIF, fontWeight: 700, color: INDIGO, fontSize: { xs: 28, sm: 34 } }}>
        {heading}
      </Typography>
      <Typography sx={{ color: "#5b5387", fontSize: { xs: 13, sm: 15 }, mt: 0.5 }}>
        {subtitle}
      </Typography>
    </Box>

    <Box
      sx={{
        mt: 3,
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
        gap: { xs: 1.5, sm: 2.5 },
      }}
    >
      {podcasts.map((podcast) => (
        <Box
          key={podcast.id}
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
          <Box
            sx={{
              height: 92,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #a89ac9 0%, #7d6bb0 100%)",
            }}
          >
            <HeadphonesRoundedIcon sx={{ color: "rgba(255,255,255,0.55)", fontSize: 34 }} />
          </Box>
          <Box sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}>
            <Typography sx={{ fontFamily: SERIF, fontWeight: 700, color: INDIGO, fontSize: { xs: 15, sm: 17 } }}>
              {podcast.title}
            </Typography>
            <Typography sx={{ color: "#5b5387", fontSize: { xs: 12, sm: 13 }, lineHeight: 1.4, mt: 0.5 }}>
              {podcast.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

export default PodcastSection;
