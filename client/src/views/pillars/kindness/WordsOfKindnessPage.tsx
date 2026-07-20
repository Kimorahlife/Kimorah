import React from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";

const INDIGO = "#28216f";

const float = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-0.25deg); }
  50% { transform: translate3d(0, -10px, 0) rotate(0.25deg); }
`;

const floatingSx = (delay = 0, duration = 5.5) => ({
  animation: `${float} ${duration}s ease-in-out ${delay}s infinite`,
  willChange: "transform",
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});

const phrases = [
  "You are not alone", "Take your time", "I believe in you", "You are doing great", "Choose peace",
  "It’s okay to take a break", "You have value", "Keep going", "Thank you for being you",
  "Your feelings are valid", "One step at a time", "I’m proud of you", "You make a difference",
  "You are worthy", "You bring light", "You are stronger than you think", "Be kind to yourself",
  "You are capable", "Progress, not perfection", "You are enough", "Trust the process",
  "I love you", "One day at a time", "Stay present",
];

const Phrase: React.FC<{ children: string; index: number }> = ({ children, index }) => (
  <Box sx={floatingSx(-(index % 7) * .42, 4.8 + (index % 5) * .35)}>
    <Typography sx={{
      minHeight: { xs: 58, md: 72 },
      px: { xs: 1, md: 2 },
      display: "grid",
      placeItems: "center",
      color: INDIGO,
      fontSize: { xs: 16, sm: 19, md: 21 },
      lineHeight: 1.35,
      textAlign: "center",
      whiteSpace: "pre-line",
      cursor: "default",
      transition: "font-weight .12s ease, scale .12s ease",
      "&:hover": { fontWeight: 800, scale: "1.035" },
    }}>{children}</Typography>
  </Box>
);

const WordsOfKindnessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box component="main" sx={{ minHeight: "100dvh", width: "100%", overflow: "hidden", background: "radial-gradient(circle at 50% 45%, rgba(255,248,237,.97) 0%, rgba(252,245,242,.95) 45%, rgba(233,222,247,.93) 100%)", color: INDIGO }}>
      <IconButton aria-label="Back to kindness" onClick={() => navigate("/kindness")} sx={{ position: "fixed", top: { xs: 14, sm: 24 }, left: { xs: 14, sm: 24 }, zIndex: 5, width: { xs: 50, sm: 58 }, height: { xs: 50, sm: 58 }, color: INDIGO, bgcolor: "rgba(205,184,232,.78)", backdropFilter: "blur(7px)", "&:hover": { bgcolor: "rgba(185,157,222,.95)" } }}><ArrowBackRoundedIcon /></IconButton>

      <Container maxWidth="lg" sx={{ py: { xs: 8, sm: 7 }, px: { xs: 2, sm: 4 } }}>
        <Typography component="h1" sx={{ ...floatingSx(0, 6.8), fontSize: { xs: 36, sm: 52, md: 58 }, fontWeight: 500, letterSpacing: { xs: 6, sm: 13, md: 17 }, textAlign: "center", lineHeight: 1.15 }}>WORDS OF KINDNESS</Typography>
        <Box sx={{ mx: "auto", mt: 2.2, width: { xs: "82%", sm: "54%" }, display: "flex", alignItems: "center", gap: 2, color: "#a38dd4" }}><Box sx={{ flex: 1, height: 1, bgcolor: "currentColor" }} /><Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "currentColor" }} /><Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "currentColor" }} /><Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "currentColor" }} /><Box sx={{ flex: 1, height: 1, bgcolor: "currentColor" }} /></Box>
        <Box sx={floatingSx(-1.1, 5.9)}><Typography sx={{ mt: 2.2, mb: { xs: 3, md: 3.8 }, fontSize: { xs: 17, sm: 21 }, textAlign: "center", "&:hover": { fontWeight: 800 } }}>Be gentle with yourself. Be kind to others. Shine love.</Typography></Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", md: "repeat(5, minmax(0, 1fr))" }, alignItems: "center", columnGap: { xs: .5, md: 1 }, rowGap: { xs: .6, md: 1 } }}>
          {phrases.slice(0, 7).map((phrase, index) => <Phrase key={phrase} index={index}>{phrase}</Phrase>)}
          <Box sx={{ ...floatingSx(-2, 7.2), gridColumn: { xs: "1 / -1", md: "2 / 5" }, gridRow: { md: "2 / span 3" }, py: { xs: 1.5, md: 0 }, textAlign: "center" }}>
            <Typography sx={{ fontSize: { xs: 60, sm: 84, md: 118 }, fontWeight: 700, lineHeight: .93, letterSpacing: -5, "&:hover": { fontWeight: 900 } }}>You<br />Matter</Typography>
            <Box sx={{ mx: "auto", my: 2, width: "75%", display: "flex", alignItems: "center", gap: 1.5, color: "#a38dd4" }}><Box sx={{ flex: 1, height: 1, bgcolor: "currentColor" }} /><Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "currentColor" }} /><Box sx={{ flex: 1, height: 1, bgcolor: "currentColor" }} /></Box>
            <Typography sx={{ color: "#8d78c9", fontSize: { xs: 28, sm: 38, md: 43 }, fontWeight: 500, "&:hover": { fontWeight: 800 } }}>You Are Enough</Typography>
          </Box>
          {phrases.slice(7).map((phrase, index) => <Phrase key={phrase} index={index + 7}>{phrase}</Phrase>)}
        </Box>
      </Container>
    </Box>
  );
};

export default WordsOfKindnessPage;
