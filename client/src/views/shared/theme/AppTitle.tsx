import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Header brand for the dashboard shell: the Kimorah Life mark plus the serif
 * "KIMORAH LIFE" wordmark. Clicking it returns the user to the landing page.
 *
 * This is the same lockup the brand uses elsewhere, minus the three-line
 * tagline — at app-bar height the tagline renders around 8px and is illegible,
 * so it stays on the pages that have room for it.
 */
const AppTitle = () => {
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => navigate("/")}
      role="button"
      tabIndex={0}
      aria-label="Kimorah Life — go to home"
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate("/");
      }}
      sx={{ display: "flex", alignItems: "center", gap: 1.25, cursor: "pointer", maxHeight: 60, overflow: "hidden" }}
    >
      <img
        src="/kimorah-logo.png"
        alt=""
        style={{ height: 51, width: "auto", display: "block", objectFit: "contain" }}
      />
      <Typography
        sx={{
          fontFamily: "Georgia, serif",
          color: "#38206f",
          letterSpacing: { xs: 1.5, sm: 3.5 },
          lineHeight: 1,
          fontSize: { xs: "1.05rem", sm: "1.35rem" },
          whiteSpace: "nowrap",
        }}
      >
        KIMORAH LIFE
      </Typography>
    </Box>
  );
};

export default AppTitle;
