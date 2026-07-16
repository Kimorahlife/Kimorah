// Keep this module-only (exports), not a global .d.ts

export type PresetColor =
  | "default"
  | "theme1"
  | "theme2"
  | "theme3"
  | "theme4"
  | "theme5"
  | "theme6";

export type LanguageCode = "en" | "es" | "fr" | "de" | string;

export interface ConfigProps {
  menuOrientation: "vertical" | "horizontal";
  miniDrawer: boolean;
  fontFamily: string;
  borderRadius: number;
  outlinedFilled: boolean;
  mode: "light" | "dark";
  presetColor: PresetColor;
  i18n: LanguageCode;
  themeDirection: "ltr" | "rtl";
  container: boolean;
}
