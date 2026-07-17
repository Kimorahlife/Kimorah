import React from "react";
import { Box, Button } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { PILLAR_CONTENT } from "./pillar-content";

/**
 * Pillar detail page — shows a pillar's info infographic over its full-screen
 * background image, with a Back button to the landing. Unknown slugs redirect
 * home. This page is allowed to scroll (the infographics are tall).
 */
const PillarDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const content = slug ? PILLAR_CONTENT[slug] : undefined;

  if (!content) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        py: { xs: 8, sm: 5 },
        px: 2,
        backgroundImage: `url('${content.bg}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: "#2a2140",
      }}
    >
      <Button
        onClick={() => navigate("/")}
        startIcon={<ArrowBackRoundedIcon />}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 10,
          color: "#fff",
          textTransform: "none",
          fontWeight: 600,
          px: 2,
          borderRadius: 999,
          bgcolor: "rgba(20,12,40,0.5)",
          backdropFilter: "blur(4px)",
          "&:hover": { bgcolor: "rgba(20,12,40,0.7)" },
        }}
      >
        Back
      </Button>

      <Box
        component="img"
        src={content.info}
        alt={`${content.label} overview`}
        sx={{
          width: "100%",
          maxWidth: 900,
          height: "auto",
          alignSelf: "flex-start",
          borderRadius: 3,
          boxShadow: "0 16px 50px rgba(0,0,0,0.4)",
        }}
      />
    </Box>
  );
};

export default PillarDetail;
