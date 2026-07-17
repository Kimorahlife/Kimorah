import React, { ReactNode } from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import BalanceRoundedIcon from "@mui/icons-material/BalanceRounded";
import WavesRoundedIcon from "@mui/icons-material/WavesRounded";
import LandscapeOutlinedIcon from "@mui/icons-material/LandscapeOutlined";
import SignpostOutlinedIcon from "@mui/icons-material/SignpostOutlined";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import FlareRoundedIcon from "@mui/icons-material/FlareRounded";
import { useNavigate } from "react-router-dom";
import LogoBadge from "../../landing/LogoBadge";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const INDIGO = "#342478";
const LAVENDER = "#a98bd0";

interface InnerTruth {
  title: string;
  prompt: string;
  icon: ReactNode;
}

const innerTruths: InnerTruth[] = [
  { title: "Breath", prompt: "What new beginning flows with my breath?", icon: <AirRoundedIcon /> },
  { title: "Acceptance", prompt: "What can I embrace as it is?", icon: <FavoriteBorderRoundedIcon /> },
  { title: "Values", prompt: "What principles guide me right now?", icon: <SpaOutlinedIcon /> },
  { title: "Stimulation", prompt: "What story or insight can I share?", icon: <ChatBubbleOutlineRoundedIcon /> },
  { title: "Clarity", prompt: "How can I bring clarity to my emotions?", icon: <LightbulbOutlinedIcon /> },
  { title: "Expression", prompt: "What truth needs to be spoken/expressed?", icon: <CreateOutlinedIcon /> },
  { title: "Balance", prompt: "Where can I find equilibrium today?", icon: <BalanceRoundedIcon /> },
  { title: "Adaptation", prompt: "How can I grow through my limits?", icon: <WavesRoundedIcon /> },
  { title: "Humility", prompt: "What keeps me grounded in truth?", icon: <LandscapeOutlinedIcon /> },
  { title: "Choice", prompt: "Which path will I consciously choose?", icon: <SignpostOutlinedIcon /> },
  { title: "Completion", prompt: "What cycle is ready to be completed?", icon: <AutorenewRoundedIcon /> },
  { title: "Honor", prompt: "How can I recognize what I’ve learned?", icon: <FlareRoundedIcon /> },
];

const InnerTruthCard: React.FC<{ item: InnerTruth; number: number }> = ({ item, number }) => (
  <Box
    sx={{
      position: "relative",
      minHeight: { xs: 190, sm: 205 },
      px: 2,
      py: 2.5,
      border: "1px solid rgba(82,59,126,0.24)",
      borderRadius: 3,
      bgcolor: "rgba(255,251,252,0.9)",
      backdropFilter: "blur(7px)",
      boxShadow: "0 8px 22px rgba(55,35,90,0.14)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: 12,
        left: 12,
        width: 38,
        height: 38,
        borderRadius: "50%",
        bgcolor: LAVENDER,
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontFamily: SERIF,
        fontSize: 20,
        fontWeight: 700,
      }}
    >
      {number}
    </Box>
    <Box sx={{ color: INDIGO, height: 57, display: "grid", placeItems: "center", "& svg": { fontSize: 52, strokeWidth: 0.7 } }}>
      {item.icon}
    </Box>
    <Typography sx={{ mt: 0.6, fontFamily: SERIF, color: INDIGO, fontSize: 21, fontWeight: 700 }}>
      {item.title}
    </Typography>
    <Typography sx={{ mt: 0.4, color: INDIGO, fontSize: 15, lineHeight: 1.45, maxWidth: 190 }}>
      {item.prompt}
    </Typography>
  </Box>
);

const RevitalizationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: "100dvh",
        backgroundImage: "url('/pillars/revitalization-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: { md: "fixed" },
      }}
    >
      <Box sx={{ minHeight: "100dvh", background: "linear-gradient(180deg, rgba(247,235,246,0.28), rgba(65,39,101,0.12))" }}>
        <IconButton
          aria-label="Back to home"
          onClick={() => navigate("/")}
          sx={{
            position: "fixed",
            top: { xs: 14, sm: 28 },
            left: { xs: 14, sm: 28 },
            zIndex: 5,
            width: { xs: 54, sm: 68 },
            height: { xs: 54, sm: 68 },
            color: INDIGO,
            bgcolor: "rgba(173,143,211,0.78)",
            backdropFilter: "blur(5px)",
            "&:hover": { bgcolor: "rgba(157,123,203,0.92)" },
          }}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: { xs: 30, sm: 38 } }} />
        </IconButton>

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, py: { xs: 4, sm: 5 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <LogoBadge size={{ xs: 108, sm: 132 }} />
            <Typography
              component="h1"
              sx={{ fontFamily: SERIF, color: INDIGO, fontWeight: 600, fontSize: { xs: 44, sm: 68 }, lineHeight: 1.05, mt: 0.5 }}
            >
              Revitalization
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: 260, sm: 330 }, my: 1.5 }}>
              <Box sx={{ flex: 1, height: 1.5, bgcolor: "#a583cc" }} />
              <SpaOutlinedIcon sx={{ color: "#8e65bd", fontSize: 38 }} />
              <Box sx={{ flex: 1, height: 1.5, bgcolor: "#a583cc" }} />
            </Box>

            <Typography sx={{ color: INDIGO, fontSize: { xs: 17, sm: 22 }, lineHeight: 1.35 }}>
              Renew your energy. Reclaim your truth.
              <br />
              Rise into your fullest self.
            </Typography>

            <Box sx={{ display: "flex", gap: 2.5, my: 2.1 }}>
              {[false, true, false].map((active, index) => (
                <Box key={index} sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: active ? "#7650ad" : "#d9c5e5" }} />
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.2 }}>
              <SpaOutlinedIcon sx={{ color: "#ae8ed1", fontSize: 28, transform: "rotate(-25deg)" }} />
              <Typography component="h2" sx={{ fontFamily: SERIF, color: INDIGO, fontWeight: 700, fontSize: { xs: 26, sm: 34 } }}>
                The 12 Laws of Inner Truths
              </Typography>
              <SpaOutlinedIcon sx={{ color: "#ae8ed1", fontSize: 28, transform: "rotate(25deg)" }} />
            </Box>
            <Typography sx={{ color: INDIGO, fontSize: { xs: 17, sm: 20 }, mt: 0.2 }}>Reflective Cycle</Typography>
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            {innerTruths.map((item, index) => (
              <InnerTruthCard key={item.title} item={item} number={index + 1} />
            ))}
          </Box>

          <Box
            sx={{
              mx: "auto",
              mt: 3,
              maxWidth: 570,
              px: { xs: 2.5, sm: 4 },
              py: 1.5,
              border: "1px solid rgba(255,255,255,0.62)",
              borderRadius: 999,
              bgcolor: "rgba(108,76,150,0.72)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              boxShadow: "0 8px 20px rgba(48,28,80,0.18)",
              backdropFilter: "blur(7px)",
            }}
          >
            <FavoriteBorderRoundedIcon sx={{ fontSize: 36, flexShrink: 0 }} />
            <Typography sx={{ fontFamily: SERIF, fontSize: { xs: 16, sm: 20 }, textAlign: "center" }}>
              Every choice is a step toward your well-being.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default RevitalizationPage;
