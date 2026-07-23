import React, { useState } from "react";
import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem, SxProps, Theme } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import { useTranslation } from "react-i18next";

const LANGUAGES: { code: "en" | "es"; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

/**
 * "light"  — light pill (used on light/gradient backgrounds; the original look).
 * "onDark" — translucent white outline for dark headers (SiteHeader).
 * "ghost"  — transparent + white text for photo/hero backgrounds (Landing).
 */
export type LanguageMenuVariant = "light" | "onDark" | "ghost";

const triggerStyles: Record<LanguageMenuVariant, SxProps<Theme>> = {
  light: {
    border: "2px solid rgba(174,137,225,.8)",
    bgcolor: "rgba(248,240,255,.84)",
    color: "#352374",
    backdropFilter: "blur(9px)",
    boxShadow: "0 6px 20px rgba(48,28,90,.2)",
    "&:hover": { bgcolor: "rgba(240,229,253,.92)", borderColor: "rgba(174,137,225,1)" },
  },
  onDark: {
    border: "1.5px solid rgba(255,255,255,.55)",
    bgcolor: "rgba(255,255,255,.1)",
    color: "#fff",
    backdropFilter: "blur(6px)",
    "&:hover": { bgcolor: "rgba(255,255,255,.2)", borderColor: "rgba(255,255,255,.85)" },
  },
  ghost: {
    border: "1.5px solid rgba(255,255,255,.7)",
    bgcolor: "rgba(255,255,255,.12)",
    color: "#fff",
    backdropFilter: "blur(6px)",
    boxShadow: "0 4px 14px rgba(0,0,0,.25)",
    "&:hover": { bgcolor: "rgba(255,255,255,.22)", borderColor: "#fff" },
  },
};

interface LanguageMenuProps {
  variant?: LanguageMenuVariant;
  /** Extra styles merged onto the trigger button (e.g. sizing tweaks). */
  sx?: SxProps<Theme>;
}

/**
 * Presentational language dropdown (button + menu). Inline — position it via
 * the parent. The `data-language-switcher` markers keep the auto-translator
 * (see useAutoTranslate) from rewriting the control's own labels, including the
 * portaled menu.
 */
const LanguageMenu: React.FC<LanguageMenuProps> = ({ variant = "light", sx }) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || "en";
  const spanish = language.startsWith("es");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const select = (next: "en" | "es") => {
    void i18n.changeLanguage(next);
    setAnchorEl(null);
  };

  const current = spanish ? "Español" : "English";

  return (
    <Box data-language-switcher sx={{ display: "inline-flex" }}>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={spanish ? "Cambiar idioma" : "Change language"}
        startIcon={<LanguageRoundedIcon sx={{ fontSize: 19 }} />}
        endIcon={<KeyboardArrowDownRoundedIcon sx={{ transition: "transform .2s ease", transform: open ? "rotate(180deg)" : "none" }} />}
        sx={[{ minWidth: 0, px: { xs: 1.4, sm: 1.7 }, py: { xs: .55, sm: .7 }, borderRadius: 99, fontWeight: 800, fontSize: { xs: 11.5, sm: 13 }, textTransform: "uppercase", whiteSpace: "nowrap" }, triggerStyles[variant], ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      >
        {current}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { "data-language-switcher": "true", sx: { mt: 1, minWidth: 168, borderRadius: 2.5, border: "2px solid rgba(174,137,225,.55)", bgcolor: "rgba(250,245,255,.97)", backdropFilter: "blur(9px)", boxShadow: "0 12px 32px rgba(48,28,90,.24)", overflow: "hidden" } } as any }}
        MenuListProps={{ sx: { py: .5 }, "aria-label": spanish ? "Idiomas disponibles" : "Available languages" }}
      >
        {LANGUAGES.map(({ code, label }) => {
          const active = code === "es" ? spanish : !spanish;
          return (
            <MenuItem key={code} selected={active} onClick={() => select(code)} sx={{ mx: .75, my: .15, borderRadius: 1.5, py: .9, color: "#352374", fontWeight: active ? 800 : 600, fontSize: 13.5, "&.Mui-selected": { bgcolor: "rgba(188,154,229,.32)" }, "&.Mui-selected:hover": { bgcolor: "rgba(188,154,229,.42)" }, "&:hover": { bgcolor: "rgba(188,154,229,.2)" } }}>
              <ListItemIcon sx={{ minWidth: 30, color: "#6540b2" }}>{active && <CheckRoundedIcon sx={{ fontSize: 19 }} />}</ListItemIcon>
              <ListItemText primaryTypographyProps={{ sx: { fontWeight: "inherit", fontSize: "inherit" } }}>{label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default LanguageMenu;
