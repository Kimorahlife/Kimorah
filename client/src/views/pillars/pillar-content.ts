/**
 * Per-pillar detail content. Each entry maps a pillar slug (its route, e.g.
 * `/mission` -> "mission") to a full-screen background image and the pillar's
 * "info" infographic shown on top. Add R/A/H here once their images exist.
 */
export interface PillarContent {
  label: string;
  bg: string;
  info: string;
}

export const PILLAR_CONTENT: Record<string, PillarContent> = {
  kindness:  { label: "Kindness",  bg: "/pillars/kindness-bg.jpg",  info: "/pillars/kindness-info.jpg" },
  immersive: { label: "Immersive", bg: "/pillars/immersive-bg.jpg", info: "/pillars/immersive-info.jpg" },
  mission:   { label: "Mission",   bg: "/pillars/mission-bg.jpg",   info: "/pillars/mission-info.jpg" },
  oneness:   { label: "Oneness",   bg: "/pillars/oneness-bg.jpg",   info: "/pillars/oneness-info.jpg" },
  revitalization: { label: "Revitalization", bg: "/pillars/revitalization-bg.png", info: "/pillars/revitalization-bg.png" },
};
