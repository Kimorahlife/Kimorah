import { ReactNode } from "react";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import FilterVintageRoundedIcon from "@mui/icons-material/FilterVintageRounded";
import GrassRoundedIcon from "@mui/icons-material/GrassRounded";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import WavesRoundedIcon from "@mui/icons-material/WavesRounded";

export interface Pillar {
  letter: string;
  label: string;
  /** Circle background colour. */
  color: string;
  /** Small glyph shown above the letter. */
  icon: ReactNode;
  /** Future route/section this pillar opens. */
  path: string;
}

// Size is controlled by the parent circle (responsive); keep only styling here.
const iconSx = { opacity: 0.92 } as const;

/**
 * The seven KIMORAH pillars. Order spells the brand: the first four render on
 * the top row (K I M O), the last three below (R A H).
 */
export const PILLARS: Pillar[] = [
  { letter: "K", label: "Kindness",       color: "#2f8f8f", path: "/kindness",       icon: <FavoriteBorderRoundedIcon sx={iconSx} /> },
  { letter: "I", label: "Immersive",      color: "#232a44", path: "/immersive",      icon: <LocalFireDepartmentRoundedIcon sx={iconSx} /> },
  { letter: "M", label: "Mission",        color: "#c99a1e", path: "/mission",        icon: <span className="mi-glyph" style={{ lineHeight: 1, fontWeight: 600 }}>&#934;</span> },
  { letter: "O", label: "Oneness",        color: "#1f3d30", path: "/oneness",        icon: <FilterVintageRoundedIcon sx={iconSx} /> },
  { letter: "R", label: "Revitalization", color: "#2f8f8f", path: "/revitalization", icon: <GrassRoundedIcon sx={iconSx} /> },
  { letter: "A", label: "Acceptance",     color: "#5b4f86", path: "/acceptance",     icon: <SelfImprovementRoundedIcon sx={iconSx} /> },
  { letter: "H", label: "Harmony",        color: "#1f3d30", path: "/harmony",        icon: <WavesRoundedIcon sx={iconSx} /> },
];
