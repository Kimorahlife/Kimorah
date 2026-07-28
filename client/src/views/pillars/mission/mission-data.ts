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
  /** Background behind the logo (defaults to white). Use dark for white-on-black marks. */
  logoBg?: string;
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

export interface PriorityProgramItem {
  title: string;
  highlightedTitle: string;
  description: string;
  audience: string;
  audienceDescription: string;
  primaryAction: string;
  secondaryAction: string;
  imageUrl: string;
}

export interface MissionContent {
  title: string;
  tagline: string;
  description: string;
  causes: MissionCause[];
  priorityProgram: PriorityProgramItem;
  priority: PriorityResearchItem;
  partners: MissionPartner[];
  cta: { heading: string; subtext: string; buttonLabel: string };
}

export const missionData: MissionContent = {
  title: "MISSION",
  tagline: "Healing People. Revitalizing Communities. Protecting Our Earth.",
  description:
    "We believe healing is the foundation of a thriving world. Through compassionate mental health care, transformative education, meaningful research, creativity, humanitarian service, and environmental stewardship, KIMORAH LIFE empowers individuals to overcome adversity, strengthens communities through connection and purpose, and fosters a healthier relationship with our planet. Together, we are building a future where every act of healing creates lasting change for people, communities, and the Earth.",
  causes: [
    { id: "earth",    title: "Earth & Climate",    subtitle: "Protect our home",              icon: "globe",   color: "#5f8c48" },
    { id: "children", title: "Children Education", subtitle: "Invest in their future",        icon: "book",    color: "#3f6fb0" },
    { id: "arts",     title: "Arts & Culture",     subtitle: "Inspire. Create. Transform.",   icon: "palette", color: "#7b5ea6" },
    { id: "research", title: "Research & Science", subtitle: "Discover. Understand. Advance.", icon: "science", color: "#3f8f97" },
  ],
  priorityProgram: {
    title: "When the Earth Changes,",
    highlightedTitle: "We Change Too",
    description:
      "A psychoeducational curriculum offering support and processing for people directly and indirectly affected by the earthquake in Venezuela.",
    audience: "DESIGNED FOR MENTAL HEALTH PROFESSIONALS",
    audienceDescription:
      "Evidence-based. Trauma-informed. Integrative and culturally sensitive approaches.",
    primaryAction: "EXPLORE SESSIONS",
    secondaryAction: "WATCH INTRODUCTORY VIDEO",
    imageUrl: "/pillars/priority-program-portal.png",
  },
  priority: {
    badge: "TOP PRIORITY",
    title: "Echoes of Belonging",
    subtitle:
      "Investigating Emotional and Somatic Responses to the Coquí Frog Call in Displaced Venezuelan Populations",
    description:
      "Exploring the emotional and somatic impact of the Coquí call on those who once lived with it and no longer do. Search past data, support the study, and help us understand the power of sound, memory, and belonging.",
    surveyUrl: "#",
    dataUrl: "#",
    imageUrl: "/pillars/mission-frog.png",
  },
  partners: [
    { id: "humanamente", name: "Humanamente", description: "Humanamente connects people still experiencing the consequences of the earthquake in Venezuela with verified mental health professionals, free of charge.", accent: "#4f91cb", logoUrl: "/pillars/partner-humanamente.svg" },
    { id: "gem", name: "Global Empowerment Mission", description: "GEM: One of the world's most effective disaster relief organizations.", accent: "#31568f", logoUrl: "/pillars/partner-gem.svg" },
  ],
  cta: {
    heading: "Want to get involved?",
    subtext: "Your support fuels change.",
    buttonLabel: "Make an Impact",
  },
};

export const missionDataEs: MissionContent = {
  title: "MISIÓN",
  tagline: "Sanando personas. Revitalizando comunidades. Protegiendo nuestra Tierra.",
  description:
    "Creemos que la sanación es la base de un mundo próspero. A través de una atención compasiva de la salud mental, educación transformadora, investigación significativa, creatividad, servicio humanitario y responsabilidad ambiental, KIMORAH LIFE empodera a las personas para superar la adversidad, fortalece las comunidades mediante la conexión y el propósito, y fomenta una relación más saludable con nuestro planeta. Juntos, estamos construyendo un futuro donde cada acto de sanación genera un cambio duradero para las personas, las comunidades y la Tierra.",
  causes: [
    { id: "earth", title: "Tierra y clima", subtitle: "Protege nuestro hogar", icon: "globe", color: "#5f8c48" },
    { id: "children", title: "Educación infantil", subtitle: "Invierte en su futuro", icon: "book", color: "#3f6fb0" },
    { id: "arts", title: "Arte y cultura", subtitle: "Inspira. Crea. Transforma.", icon: "palette", color: "#7b5ea6" },
    { id: "research", title: "Investigación y ciencia", subtitle: "Descubre. Comprende. Avanza.", icon: "science", color: "#3f8f97" },
  ],
  priorityProgram: {
    title: "Cuando la Tierra cambia,",
    highlightedTitle: "Nosotros también",
    description:
      "Currículo psicoeducativo de apoyo y procesamiento para personas afectadas directa e indirectamente por el terremoto de Venezuela.",
    audience: "DISEÑADO PARA PROFESIONALES DE LA SALUD MENTAL",
    audienceDescription:
      "Basado en evidencia. Informado por trauma. Enfoques integrativos y culturalmente sensibles.",
    primaryAction: "EXPLORAR SESIONES",
    secondaryAction: "VER VIDEO INTRODUCTORIO",
    imageUrl: "/pillars/priority-program-portal.png",
  },
  priority: {
    badge: "PRIORIDAD PRINCIPAL",
    title: "Ecos de pertenencia",
    subtitle:
      "Investigación de las respuestas emocionales y somáticas al canto del coquí en poblaciones venezolanas desplazadas",
    description:
      "Exploramos el impacto emocional y somático del canto del coquí en quienes alguna vez convivieron con él y ya no lo hacen. Consulta datos anteriores, apoya el estudio y ayúdanos a comprender el poder del sonido, la memoria y el sentido de pertenencia.",
    surveyUrl: "#",
    dataUrl: "#",
    imageUrl: "/pillars/mission-frog.png",
  },
  partners: [
    { id: "humanamente", name: "Humanamente", description: "Humanamente conecta a quienes siguen sintiendo las consecuencias del terremoto en Venezuela con profesionales de salud mental verificados, de forma gratuita.", accent: "#4f91cb", logoUrl: "/pillars/partner-humanamente.svg" },
    { id: "gem", name: "Global Empowerment Mission", description: "GEM: Una de las organizaciones de ayuda en desastres más eficaces del mundo.", accent: "#31568f", logoUrl: "/pillars/partner-gem.svg" },
  ],
  cta: {
    heading: "¿Quieres participar?",
    subtext: "Tu apoyo impulsa el cambio.",
    buttonLabel: "Genera un impacto",
  },
};
