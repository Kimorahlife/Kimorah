import React from "react";

interface LogoBadgeProps {
  size?: number;
}

/**
 * KIMORAH LIFE emblem. Uses the real logo asset at `public/kimorah-logo.png`.
 * Replace that file to update the logo everywhere it's shown.
 */
const LogoBadge: React.FC<LogoBadgeProps> = ({ size = 124 }) => (
  <img
    src="/kimorah-logo.png"
    alt="Kimorah Life"
    width={size}
    height={size}
    style={{ display: "block", width: size, height: size, objectFit: "contain" }}
  />
);

export default LogoBadge;
