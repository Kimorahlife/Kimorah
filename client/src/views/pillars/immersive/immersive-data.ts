/**
 * Immersive page content. Static for now, shaped to be replaced by an API
 * response (e.g. `GET /api/immersive`). `imageUrl` is optional on cards — when
 * absent, the component renders a themed placeholder. Fill them in later by
 * dropping images in public/pillars/immersive/ and setting imageUrl here.
 */
export interface ImmersiveService {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  imageUrl?: string;
}

export interface ImmersiveRetreat {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface ImmersivePodcast {
  id: string;
  title: string;
  description: string;
}

export interface ImmersiveContent {
  title: string;
  tagline: string;
  description: string;
  services: ImmersiveService[];
  retreatsHeading: string;
  retreatsSubtitle: string;
  retreats: ImmersiveRetreat[];
  podcastHeading: string;
  podcastSubtitle: string;
  podcasts: ImmersivePodcast[];
  cta: { heading: string; subtext: string; buttonLabel: string };
}

export const immersiveData: ImmersiveContent = {
  title: "Immersive",
  tagline: "Deep healing. Whole you.",
  description:
    "Personalized mental health and holistic healing services to support your journey to wholeness.",
  services: [
    { id: "grief",      title: "Grief Counseling",   description: "Compassionate support to navigate loss, honor your emotions, and find meaning.", buttonLabel: "Heal & Remember" },
    { id: "somatic",    title: "Somatic Practices",  description: "Reconnect with your body, release stored tension, and restore balance.",         buttonLabel: "Return to Self" },
    { id: "hypno",      title: "Hypnotherapy",       description: "Access your subconscious mind to heal, reframe patterns, and create lasting change.", buttonLabel: "Transform Within" },
    { id: "ancestral",  title: "Ancestral Healing",  description: "Reconnect with your lineage and receive guidance and healing across generations.", buttonLabel: "Honoring Roots" },
    { id: "music",      title: "Medicine Music",     description: "Therapeutic sound journeys and medicine music to uplift, soothe, and transform.",  buttonLabel: "Listen. Heal. Rise." },
    { id: "meditation", title: "Guided Meditations", description: "Find inner peace, clarity, and resilience through mindful guided practices.",      buttonLabel: "Center & Restore" },
  ],
  retreatsHeading: "Workshops",
  retreatsSubtitle: "Step away. Reconnect. Return renewed.",
  retreats: [
    { id: "wellness",  title: "Wellness Retreats",    description: "Rest, recharge, and nurture your mind, body, and spirit in nature." },
    { id: "journeys",  title: "Ancestral Journeys",   description: "Sacred experiences to connect with your roots and ancestral wisdom." },
    { id: "healing",   title: "Healing Retreats",     description: "Deep healing experiences to release, transform, and realign your life." },
    { id: "escapes",   title: "Inner Peace Escapes",  description: "Immerse in stillness, reflection, and practices that bring you back to yourself." },
  ],
  podcastHeading: "Podcast",
  podcastSubtitle: "Listen. Reflect. Grow.",
  podcasts: [
    { id: "episode-1", title: "Episode One",   description: "A gentle conversation about healing, growth, and returning to yourself." },
    { id: "episode-2", title: "Episode Two",   description: "Explore practical tools for creating calm, clarity, and meaningful change." },
    { id: "episode-3", title: "Episode Three", description: "Stories and insights to support your journey toward greater wholeness." },
    { id: "episode-4", title: "Episode Four",  description: "Pause, reconnect, and discover new ways to care for your inner world." },
  ],
  cta: {
    heading: "You don't have to do this alone.",
    subtext: "We're here to walk this path with you.",
    buttonLabel: "Explore Retreats",
  },
};
