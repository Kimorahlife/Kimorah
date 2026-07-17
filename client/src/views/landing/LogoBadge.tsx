import React from "react";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";

interface LogoBadgeProps {
  /** Responsive size (px). Width and height stay equal — the logo is square. */
  size?: SxProps<Theme>["width"];
}

/**
 * KIMORAH LIFE emblem. Uses the real logo asset at `public/kimorah-logo.png`.
 * Replace that file to update the logo everywhere it's shown.
 */
const LogoBadge: React.FC<LogoBadgeProps> = ({ size = { xs: 176, sm: 208 } }) => (
  <Box
    component="img"
    src="/kimorah-logo.png"
    alt="Kimorah Life"
    sx={{ display: "block", width: size, height: size, objectFit: "contain" }}
  />
);

export default LogoBadge;
