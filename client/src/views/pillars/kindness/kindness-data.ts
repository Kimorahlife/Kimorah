/**
 * Kindness → "Coquí Research Data" dashboard content.
 *
 * This is the single data source for the dashboard. Almost everything here is
 * intended to come from the database (survey aggregates); it's shaped to be
 * replaced by an API response (e.g. `GET /api/research/coqui`). Every chart
 * component reads from this object, so swapping to a fetch/hook needs no
 * component changes.
 */
export interface Segment { label: string; value: number; color: string }
export interface BarItem { label: string; value: number }
export interface WordItem { word: string; weight: number } // weight 0..1
export interface NavItem { id: string; label: string; icon: string; active?: boolean }
export interface GlanceStat { icon: string; value: string; unit?: string; label: string }

export interface KindnessData {
  header: { eyebrow: string; title: string; subtitle: string; frogImage: string };
  nav: NavItem[];
  sidebarQuote: string;
  glance: GlanceStat[];
  imprinting: { average: string; outOf: string; distribution: Segment[] };
  timeSinceExposure: BarItem[];
  emotionalResponses: BarItem[];
  somaticResponses: BarItem[];
  timeOfExposure: Segment[];
  emotionalThemes: WordItem[];
  somaticThemes: WordItem[];
  participantQuotes: string[];
  originalLocation: BarItem[];
  currentLocation: BarItem[];
  about: { text: string; buttonLabel: string };
  footerQuote: string;
}

// Purple sequential ramp for the ordinal Imprinting distribution (light→dark by rank).
const IMPRINT = ["#6c5cd0", "#8a7de0", "#a99ee8", "#cabff2"];
// Validated CVD-safe categorical palette (dataviz skill, dark surface) for Time of Exposure.
const TOD = ["#3987e5", "#008300", "#d55181", "#c98500", "#199e70"];

export const kindnessData: KindnessData = {
  header: {
    eyebrow: "ECHOES OF BELONGING",
    title: "COQUÍ RESEARCH DATA",
    subtitle:
      "Investigating Emotional and Somatic Responses to the Coquí Frog Call in Displaced Populations",
    frogImage: "/pillars/mission-frog.png",
  },
  nav: [
    { id: "overview", label: "Overview", icon: "home" },
    { id: "key-findings", label: "Key Findings", icon: "star" },
    { id: "demographics", label: "Demographics", icon: "group" },
    { id: "emotional", label: "Emotional Responses", icon: "favorite" },
    { id: "somatic", label: "Somatic Responses", icon: "air" },
    { id: "time", label: "Time & Exposure", icon: "schedule" },
    { id: "location", label: "Location & Displacement", icon: "place" },
    { id: "data", label: "Coquí Research Data", icon: "bar" },
    { id: "methodology", label: "Methodology", icon: "doc" },
    { id: "survey", label: "Survey", icon: "survey" },
    { id: "about", label: "About the Study", icon: "info" },
  ],
  sidebarQuote:
    "The Coquí call is more than a sound— it is a thread that connects memory, body, and belonging.",
  glance: [
    { icon: "person", value: "412", label: "Total Participants" },
    { icon: "globe", value: "14", label: "Countries Represented" },
    { icon: "calendar", value: "3.6", unit: "yrs", label: "Avg. Time Since Last Exposure to Coquí" },
    { icon: "heart", value: "4.6", unit: "/ 5", label: "Avg. Emotional Connection Score (Imprinting Score)" },
  ],
  imprinting: {
    average: "4.6",
    outOf: "out of 5",
    distribution: [
      { label: "Very Strong (4.1 – 5)", value: 54, color: IMPRINT[0] },
      { label: "Strong (3.1 – 4.0)", value: 28, color: IMPRINT[1] },
      { label: "Moderate (2.1 – 3.0)", value: 12, color: IMPRINT[2] },
      { label: "Weak (1.0 – 2.0)", value: 6, color: IMPRINT[3] },
    ],
  },
  timeSinceExposure: [
    { label: "< 1 year", value: 16 },
    { label: "1 – 3 years", value: 27 },
    { label: "4 – 10 years", value: 28 },
    { label: "11 – 20 years", value: 18 },
    { label: "> 20 years", value: 11 },
  ],
  emotionalResponses: [
    { label: "Nostalgia", value: 68 },
    { label: "Peace", value: 62 },
    { label: "Belonging", value: 58 },
    { label: "Yearning", value: 46 },
    { label: "Happiness", value: 42 },
    { label: "Comfort", value: 38 },
    { label: "Connection", value: 34 },
    { label: "Melancholy", value: 29 },
  ],
  somaticResponses: [
    { label: "Deepened Breathing", value: 65 },
    { label: "Relaxation", value: 60 },
    { label: "Goosebumps", value: 42 },
    { label: "Tears", value: 38 },
    { label: "Smiling", value: 37 },
    { label: "Calm Body", value: 35 },
    { label: "Warmth", value: 28 },
    { label: "Chills", value: 22 },
  ],
  timeOfExposure: [
    { label: "Night", value: 61, color: TOD[0] },
    { label: "After Rain", value: 22, color: TOD[1] },
    { label: "Dusk", value: 9, color: TOD[2] },
    { label: "Early Morning", value: 5, color: TOD[3] },
    { label: "Daytime", value: 3, color: TOD[4] },
  ],
  emotionalThemes: [
    { word: "nostalgia", weight: 1.0 }, { word: "peace", weight: 0.95 }, { word: "belonging", weight: 0.82 },
    { word: "home", weight: 0.6 }, { word: "comfort", weight: 0.55 }, { word: "memories", weight: 0.55 },
    { word: "happiness", weight: 0.5 }, { word: "family", weight: 0.48 }, { word: "childhood", weight: 0.45 },
    { word: "longing", weight: 0.42 }, { word: "love", weight: 0.4 }, { word: "warmth", weight: 0.35 },
  ],
  somaticThemes: [
    { word: "relaxation", weight: 1.0 }, { word: "breathing", weight: 0.92 }, { word: "calm", weight: 0.85 },
    { word: "goosebumps", weight: 0.7 }, { word: "tears", weight: 0.55 }, { word: "heart", weight: 0.5 },
    { word: "body", weight: 0.5 }, { word: "peace", weight: 0.45 }, { word: "warmth", weight: 0.4 },
    { word: "stillness", weight: 0.38 },
  ],
  participantQuotes: [
    "It takes me back home instantly.",
    "It reminds me that I'm not alone.",
    "It's the sound of my childhood nights.",
    "It brings me peace in the chaos of being far from home.",
  ],
  originalLocation: [
    { label: "Puerto Rico", value: 41 },
    { label: "Caracas, Venezuela", value: 23 },
    { label: "Central Coast, PR", value: 12 },
    { label: "Tucacas, Venezuela", value: 8 },
    { label: "Maracay, Venezuela", value: 6 },
  ],
  currentLocation: [
    { label: "USA", value: 46 },
    { label: "Spain", value: 13 },
    { label: "Venezuela", value: 10 },
    { label: "Colombia", value: 6 },
    { label: "Italy", value: 5 },
  ],
  about: {
    text:
      "This data represents responses from 412 participants who formerly lived in places where the Coquí frog call was a natural part of their environment and no longer do. Collected via survey.",
    buttonLabel: "View Methodology",
  },
  footerQuote: "“To remember a sound is to remember a place. To feel it is to belong.”",
};
