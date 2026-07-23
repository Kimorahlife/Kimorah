import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { KIMORAH_ES } from "./translator/kimorah-es";

// Remember each text node's original (English) copy so we can restore it when
// the user switches back from Spanish.
const originals = new WeakMap<Text, string>();

/**
 * Walk the live DOM and swap public text to Spanish (or back) using the
 * KIMORAH_ES phrase map. Anything inside a `[data-language-switcher]` element
 * (the switcher UI itself) is skipped so the control keeps its own labels.
 */
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

/**
 * Global side-effect that keeps the whole page translated to the active
 * language and re-applies as the DOM changes. Call this once, high in the tree
 * (App), regardless of which language UI is visible on a given route.
 */
export const useAutoTranslate = (): void => {
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
};

export default useAutoTranslate;
