import { ReactNode } from "react";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
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
  { letter: "K", label: "Kindness",       color: "#16788f", path: "/kindness",       icon: <VolunteerActivismOutlinedIcon sx={iconSx} /> },
  { letter: "I", label: "Immersive",      color: "#211d4d", path: "/immersive",      icon: <LocalFireDepartmentOutlinedIcon sx={iconSx} /> },
  { letter: "M", label: "Mission",        color: "#d69c00", path: "/mission",        icon: <span className="mi-glyph mission-glyph" style={{ lineHeight: 1, fontWeight: 500 }}>&#934;<span className="mission-staff">§</span></span> },
  { letter: "O", label: "Oneness",        color: "#123f2d", path: "/oneness",        icon: <span className="oneness-glyph" aria-hidden="true"><i /><i /><i /><i /><i /></span> },
  { letter: "R", label: "Revitalization", color: "#16778e", path: "/revitalization", icon: <svg className="papyrus-glyph" viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M32 58V17M27 58 19 28M37 58l8-30M23 58 12 37M41 58l11-21M28 58 15 45M36 58l13-13M19 58 9 47M45 58l10-11" /><path d="M29 13h6v10h-6zM15.5 23.5l5-2 4 10-5 2zM43.5 31.5l4-10 5 2-4 10z" /><path d="M32 13V8M18 21l-2-4M50 21l2-4M16 58h32" /></g></svg> },
  { letter: "A", label: "Acceptance",     color: "#211d50", path: "/acceptance",     icon: <SelfImprovementRoundedIcon sx={iconSx} /> },
  { letter: "H", label: "Harmony",        color: "#123f2d", path: "/harmony",        icon: <WavesRoundedIcon sx={iconSx} /> },
];
