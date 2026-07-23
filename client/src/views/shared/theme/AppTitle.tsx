import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Header brand for the dashboard shell: a large logo + "Kimorah" title.
 * Clicking it returns the (already-authenticated) user to the dashboard —
 * replaces Toolpad's default brand link, which points at "/".
 */
const AppTitle = () => {
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => navigate("/dashboard")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate("/dashboard");
      }}
      sx={{ display: "flex", alignItems: "center", gap: 1.25, cursor: "pointer", maxHeight: 60, overflow: "hidden" }}
    >
      <img
        src="/kimorah-logo.png"
        alt="Kimorah"
        style={{ height: 51, width: "auto", display: "block", objectFit: "contain" }}
      />
      <Typography
        fontWeight={700}
        sx={{ color: "primary.main", letterSpacing: 0.5, lineHeight: 1, fontSize: "1.65rem" }}
      >
        Kimorah
      </Typography>
    </Box>
  );
};

export default AppTitle;
