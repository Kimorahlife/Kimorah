import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import LogoBadge from "../landing/LogoBadge";
import { PILLARS } from "../landing/pillars";
import LanguageMenu from "./LanguageMenu";
import { useToken } from "../authentication/components/useToken";

const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const PURPLE = "#6540b2";

// Home and About are site-level destinations. The remaining links are the
// seven KIMORAH pillars (their initials spell K-I-M-O-R-A-H).
const SITE_ITEMS: { label: string; es: string; path: string }[] = [
  { label: "Home", es: "Inicio", path: "/" },
  { label: "About", es: "Acerca de", path: "/about" },
];
const PILLAR_ITEMS: { label: string; es: string; path: string }[] = [
  ...PILLARS.map((p) => ({ label: p.label, es: p.label, path: p.path })),
];

/**
 * Shared site header — rendered once globally (App) on every page except the
 * landing and auth screens. Self-contained sticky dark bar: brand + KIMORAH
 * nav + Members button + language dropdown. The language switcher lives here
 * per design, so pages that show this header need no separate control.
 */
const SiteHeader: React.FC = () => {
  const navigate = useNavigate();
  const [, , isTokenValid] = useToken();
  const signedIn = isTokenValid;
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const spanish = (i18n.resolvedLanguage || i18n.language || "en").startsWith("es");

  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname.startsWith(path));

  return (
    <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 1100, background: "linear-gradient(90deg,#141336 0%,#1a1a44 100%)", borderBottom: "1px solid rgba(255,255,255,.09)", boxShadow: "0 6px 20px rgba(16,12,40,.28)" }}>
      <Container maxWidth={false} sx={{ py: { xs: 1.25, md: 1.75 }, px: { xs: 2, sm: 3, md: 5 } }}>
        <Box component="nav" aria-label={spanish ? "Navegación principal" : "Primary navigation"} sx={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto", alignItems: "center", columnGap: { xs: 1.5, lg: 2.5 }, rowGap: { lg: 1.5 }, width: "100%" }}>
          {/* Brand */}
          <Box onClick={() => navigate("/")} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") navigate("/"); }} sx={{ justifySelf: "start", display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0, textAlign: "left" }}>
            <LogoBadge size={{ xs: 56, md: 70 }} />
            <Box sx={{ ml: 1.75, display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ fontFamily: SERIF, color: "#fff", fontSize: { xs: 23, md: 31 }, letterSpacing: 4, lineHeight: 1 }}>KIMORAH</Typography>
            </Box>
          </Box>

          {/* Site links and all seven KIMORAH pillars get the full second row.
              This keeps the pillars visible instead of letting the brand and
              account controls squeeze them out of the middle column. */}
          <Box sx={{ gridColumn: "1 / -1", gridRow: 2, justifySelf: "center", display: { xs: "none", lg: "flex" }, alignItems: "center", justifyContent: "center", gap: { lg: 1.5, xl: 2.25 }, minWidth: 0, width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, p: 0.5, border: "1px solid rgba(255,255,255,.22)", borderRadius: 99, bgcolor: "rgba(255,255,255,.06)", flexShrink: 0 }}>
              {SITE_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <Button key={item.path} onClick={() => navigate(item.path)} aria-current={active ? "page" : undefined} sx={{ minWidth: 0, px: { lg: 1.25, xl: 1.6 }, py: 0.55, borderRadius: 99, whiteSpace: "nowrap", color: "#fff", bgcolor: active ? "rgba(255,255,255,.2)" : "transparent", fontSize: { lg: 14, xl: 16 }, fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: active ? "rgba(255,255,255,.26)" : "rgba(255,255,255,.12)" } }}>{spanish ? item.es : item.label}</Button>
                );
              })}
            </Box>
            <Box sx={{ width: "1px", height: 25, bgcolor: "rgba(255,255,255,.2)", flexShrink: 0 }} />
            {PILLAR_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <Button key={item.path} onClick={() => navigate(item.path)} aria-current={active ? "page" : undefined} sx={{ position: "relative", p: 0, minWidth: 0, flexShrink: 0, whiteSpace: "nowrap", color: active ? "#fff" : "rgba(255,255,255,.82)", fontSize: { lg: 15, xl: 18 }, fontWeight: active ? 800 : 700, textTransform: "none", "&:hover": { color: "#fff", bgcolor: "transparent" }, "&::after": { content: '""', position: "absolute", left: 0, right: 0, bottom: -6, height: 2, borderRadius: 2, bgcolor: active ? "#fff" : "transparent" } }}>{spanish ? item.es : item.label}</Button>
              );
            })}
          </Box>

          {/* Actions */}
          <Box sx={{ gridColumn: 3, gridRow: 1, justifySelf: "end", display: "flex", alignItems: "center", gap: { xs: 1.25, sm: 2 }, flexShrink: 0 }}>
            <Button onClick={() => navigate(signedIn ? "/dashboard" : "/login")} variant="contained" sx={{ bgcolor: PURPLE, color: "#fff", borderRadius: 99, px: { xs: 2.5, sm: 3.25 }, py: 1.4, fontSize: { xs: 12, sm: 13.5 }, fontWeight: 800, whiteSpace: "nowrap", boxShadow: "none", "&:hover": { bgcolor: "#553599", color: "#fff", boxShadow: "none" } }}>{signedIn ? (spanish ? "PANEL" : "DASHBOARD") : spanish ? "MIEMBROS" : "MEMBERS"}</Button>
            <LanguageMenu variant="onDark" sx={{ fontSize: { xs: 12.5, sm: 14 }, px: { xs: 1.9, sm: 2.3 }, py: { xs: 0.8, sm: 0.95 } }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SiteHeader;
