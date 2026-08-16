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
  url: string;
  imageUrl?: string;
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
    { id: "grief",      title: "Grief Counseling",   description: "Compassionate support to navigate loss, honor your emotions, and find meaning.", buttonLabel: "Heal & Remember", imageUrl: "/images/claudia-gonzalez-portrait.png" },
    { id: "somatic",    title: "Somatic Practices",  description: "Reconnect with your body, release stored tension, and restore balance.",         buttonLabel: "Return to Self" },
    { id: "hypno",      title: "Hypnotherapy",       description: "Access your subconscious mind to heal, reframe patterns, and create lasting change.", buttonLabel: "Transform Within" },
    { id: "ancestral",  title: "Ancestral Healing",  description: "Reconnect with your lineage and receive guidance and healing across generations.", buttonLabel: "Honoring Roots" },
    { id: "music",      title: "Medicine Music",     description: "Therapeutic sound journeys and medicine music to uplift, soothe, and transform.",  buttonLabel: "Listen. Heal. Rise." },
    { id: "meditation", title: "Personal Transformational Coach", description: "Identify emotional blocks and wounds, reconnect with your body and true essence, strengthen your self-love, and build a life of purpose.", buttonLabel: "Center & Restore" },
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
    { id: "episode-1", title: "Episode One",   description: "A gentle conversation about healing, growth, and returning to yourself.", url: "https://youtu.be/4ZkP8vXYTkM?si=4fCzeph7Y9cA4ZQ0", imageUrl: "/images/podcast-episode-1.png" },
    { id: "episode-2", title: "Episode Two",   description: "Explore practical tools for creating calm, clarity, and meaningful change.", url: "https://youtu.be/7f0j7PRKWUU?si=c4wiwO1Q4RiCKahN", imageUrl: "/images/podcast-episode-2.png" },
    { id: "episode-3", title: "Episode Three", description: "Stories and insights to support your journey toward greater wholeness.", url: "https://youtu.be/xkRF5z6XQVs?si=zlFJdHMY1oaoEYnK", imageUrl: "/images/podcast-episode-3.png" },
    { id: "episode-4", title: "Episode Four",  description: "Pause, reconnect, and discover new ways to care for your inner world.", url: "https://youtu.be/qDTUinHdr10?si=9aGalfYRbTdXj8r5", imageUrl: "/images/podcast-episode-4.png" },
    { id: "episode-5", title: "Episode Five",  description: "Explore spirituality, ancestral knowledge, and their connection to mental health.", url: "https://youtu.be/T7tl2pGr2Nc?si=ppi3HX-cm-Rg23JX", imageUrl: "/images/podcast-episode-5.png" },
    { id: "episode-6", title: "Episode Six",   description: "A compassionate conversation about grief, loss, and the ways we learn to carry love forward.", url: "https://youtu.be/I6Q27p4TxWM?si=tKcmVcAgJCA6qSLZ", imageUrl: "/images/podcast-episode-6.png" },
  ],
  cta: {
    heading: "You don't have to do this alone.",
    subtext: "We're here to walk this path with you.",
    buttonLabel: "Explore Workshops",
  },
};
