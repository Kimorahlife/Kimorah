/// <reference types="vite/client" />

// Extend Vite's built-in environment variables with custom ones
// Note: MODE, DEV, PROD, SSR are already defined by vite/client
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_MUX_PLAYBACK_ID_ENGLISH: string;
  readonly VITE_MUX_PLAYBACK_ID_SPANISH: string;
  // Add more custom env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
