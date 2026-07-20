import React, { useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { KIMORAH_ES } from "./translator/kimorah-es";

const originals = new WeakMap<Text, string>();

const translatePublicText = (language: string) => {
  const spanish = language.startsWith("es");
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode() as Text | null;
  while (node) {
    const parent = node.parentElement;
    if (parent && !parent.closest("[data-language-switcher]")) {
      const original = originals.get(node) ?? node.data;
      if (!originals.has(node)) originals.set(node, original);
      const trimmed = original.trim();
      const translated = spanish ? KIMORAH_ES[trimmed] : undefined;
      if (spanish && translated) node.data = original.replace(trimmed, translated);
      else if (!spanish && originals.has(node)) node.data = original;
    }
    node = walker.nextNode() as Text | null;
  }
};

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const observerRef = useRef<MutationObserver>();
  const language = i18n.resolvedLanguage || i18n.language || "en";

  useEffect(() => {
    document.documentElement.lang = language.startsWith("es") ? "es-419" : "en";
    translatePublicText(language);
    observerRef.current?.disconnect();
    const observer = new MutationObserver(() => translatePublicText(i18n.resolvedLanguage || i18n.language));
    observer.observe(document.getElementById("root") || document.body, { childList: true, subtree: true });
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [i18n, language]);

  const select = (next: "en" | "es") => void i18n.changeLanguage(next);

  return (
    <Box data-language-switcher sx={{ position: "fixed", top: { xs: 12, sm: 22 }, right: { xs: 12, sm: 24 }, zIndex: 10000, display: "flex", alignItems: "center", gap: .15, p: .45, border: "2px solid rgba(174,137,225,.8)", borderRadius: 99, bgcolor: "rgba(248,240,255,.84)", boxShadow: "0 6px 20px rgba(48,28,90,.2)", backdropFilter: "blur(9px)" }}>
      <Button onClick={() => select("en")} aria-pressed={!language.startsWith("es")} sx={{ minWidth: 0, px: { xs: 1.1, sm: 1.35 }, py: .45, borderRadius: 99, color: "#352374", bgcolor: !language.startsWith("es") ? "rgba(188,154,229,.48)" : "transparent", fontWeight: 800, fontSize: { xs: 11, sm: 13 }, textTransform: "uppercase" }}>English</Button>
      <Button onClick={() => select("es")} aria-pressed={language.startsWith("es")} sx={{ minWidth: 0, px: { xs: 1.1, sm: 1.35 }, py: .45, borderRadius: 99, color: "#352374", bgcolor: language.startsWith("es") ? "rgba(188,154,229,.48)" : "transparent", fontWeight: 800, fontSize: { xs: 11, sm: 13 }, textTransform: "uppercase" }}>Español</Button>
    </Box>
  );
};

export default LanguageSwitcher;
