/**
 * Mission page content.
 *
 * This is the single data source for the Mission page. Right now it's static,
 * but it's shaped to be replaced by an API response (e.g. `GET /api/mission`)
 * — each section below maps to a component that renders it. Swap `missionData`
 * for a fetch/React-Query hook when the backend endpoints exist.
 */
export type CauseIcon = "globe" | "book" | "palette" | "science";

export interface MissionCause {
  id: string;
  title: string;
  subtitle: string;
  icon: CauseIcon;
  color: string;
}

export interface MissionPartner {
  id: string;
  name: string;
  description: string;
  accent: string;
  logoUrl?: string;
  url?: string;
}

export interface PriorityResearchItem {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  surveyUrl: string;
  dataUrl: string;
  imageUrl?: string;
}

export interface MissionContent {
  title: string;
  tagline: string;
  description: string;
  causes: MissionCause[];
  priority: PriorityResearchItem;
  partners: MissionPartner[];
  cta: { heading: string; subtext: string; buttonLabel: string };
}

export const missionData: MissionContent = {
  title: "MISSION",
  tagline: "We rise together. We give back.",
  description:
    "Supporting organizations and research that heal our planet, empower our children, inspire through art, and expand our collective knowledge.",
  causes: [
    { id: "earth",    title: "Earth & Climate",    subtitle: "Protect our home",              icon: "globe",   color: "#5f8c48" },
    { id: "children", title: "Children Education", subtitle: "Invest in their future",        icon: "book",    color: "#3f6fb0" },
    { id: "arts",     title: "Arts & Culture",     subtitle: "Inspire. Create. Transform.",   icon: "palette", color: "#7b5ea6" },
    { id: "research", title: "Research & Science", subtitle: "Discover. Understand. Advance.", icon: "science", color: "#3f8f97" },
  ],
  priority: {
    badge: "TOP PRIORITY",
    title: "Echoes of Belonging",
    subtitle:
      "Investigating Emotional and Somatic Responses to the Coquí Frog Call in Displaced Venezuelan Populations",
    description:
      "Exploring the emotional and somatic impact of the Coquí call on those who once lived with it and no longer do. Search past data, support the study, and help us understand the power of sound, memory, and belonging.",
    surveyUrl: "#",
    dataUrl: "#",
  },
  partners: [
    { id: "rainforest", name: "Rainforest Trust",                 description: "Protecting rainforests and wildlife for a healthier planet.", accent: "#3f7d55" },
    { id: "unicef",     name: "UNICEF",                           description: "Providing education and resources for every child to thrive.", accent: "#2f7fc0" },
    { id: "nea",        name: "National Endowment for the Arts",  description: "Strengthening communities through the power of the arts.",     accent: "#6b5b9a" },
  ],
  cta: {
    heading: "Want to get involved?",
    subtext: "Your support fuels change.",
    buttonLabel: "Make an Impact",
  },
};
