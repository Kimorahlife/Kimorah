/**
 * Oneness page content. Static now, shaped for a future `GET /api/oneness`.
 * Card `icon` maps to an MUI icon in the component; offering `imageUrl` is
 * optional (placeholder until a real image is added).
 */
export interface OnenessCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
}

export interface OnenessOffering {
  id: string;
  title: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  duration: string;
  level: string;
  actionLabel: string;
  actionStyle: "play" | "link";
  imageUrl?: string;
}

export interface OnenessContent {
  title: string;
  tagline: string;
  description: string;
  pathways: OnenessCard[];
  experiences: OnenessCard[];
  offerings: OnenessOffering[];
  cta: { line1: string; line2: string };
}

export const onenessData: OnenessContent = {
  title: "Oneness",
  tagline: "Align. Connect. Become.",
  description:
    "Tools and practices to help you return to your true nature and live in harmony with yourself, others, and the Earth.",
  pathways: [
    { id: "meditations",  title: "Guided Meditations", description: "Calm your mind, open your heart, and reconnect within.",        icon: "meditation", accent: "#2e7d6a" },
    { id: "spirituality", title: "Spirituality",       description: "Explore spiritual teachings, practices, and sacred wisdom.",     icon: "moon",       accent: "#7b5ea6" },
    { id: "holistic",     title: "Holistic Coaching",  description: "Mind, body, and spirit support for inner balance and healing.",  icon: "leaf",       accent: "#5f8c4a" },
    { id: "lifecoach",    title: "Life Coach",         description: "Clarity, purpose, and aligned action for the life you desire.",  icon: "people",     accent: "#3f6fb0" },
    { id: "workshops",    title: "Workshops",          description: "Live and upcoming workshops to expand your consciousness.",      icon: "lotus",      accent: "#c99a1e" },
  ],
  experiences: [
    { id: "mediumship", title: "Mediumship",                  description: "Develop connection with spirit, receive guidance, and strengthen intuition.", icon: "crystal",   accent: "#2e7d6a" },
    { id: "telepathy",  title: "Telepathy",                   description: "Explore the power of mind-to-mind communication and energetic connection.",    icon: "telepathy", accent: "#7b5ea6" },
    { id: "faith",      title: "Faith & Religious Affiliation", description: "Honor your path and explore diverse traditions with open heart.",             icon: "temple",    accent: "#5f8c4a" },
    { id: "rituals",    title: "Sacred Rituals",              description: "Participate in transformative ceremonies and ancestral practices.",            icon: "path",      accent: "#3f6fb0" },
    { id: "conscious",  title: "Conscious Living",            description: "Integrate spiritual wisdom into everyday life.",                               icon: "sunset",    accent: "#7b6ea6" },
  ],
  offerings: [
    { id: "morning", title: "Morning Presence Meditation",         badge: "New",  badgeColor: "#4a9d6a", description: "Start your day in stillness and gratitude.",            duration: "20 min", level: "All Levels",    actionLabel: "Play",       actionStyle: "play" },
    { id: "reiki",   title: "Reiki Energy Healing Session",                                              description: "Remote energy healing to restore balance and flow.",   duration: "60 min", level: "All Levels",    actionLabel: "Book Now",   actionStyle: "link" },
    { id: "soul",    title: "Remembering Your Soul's Path Workshop", badge: "Live", badgeColor: "#2e7d6a", description: "A 2-hour interactive workshop to reconnect with your purpose.", duration: "2 hr", level: "Intermediate", actionLabel: "Learn More", actionStyle: "link" },
  ],
  cta: {
    line1: "You are not separate from the universe.",
    line2: "You are the universe, experiencing itself.",
  },
};
