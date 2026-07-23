import React from "react";
import { Box } from "@mui/material";
import LanguageMenu from "./LanguageMenu";

/**
 * Floating language switcher (fixed top-right) for pages that don't embed the
 * language control in their own chrome (SiteHeader / Landing handle it inline).
 * The global translation side-effect lives in useAutoTranslate (called in App).
 */
const LanguageSwitcher: React.FC = () => (
  <Box sx={{ position: "fixed", top: { xs: 12, sm: 22 }, right: { xs: 12, sm: 24 }, zIndex: 10000 }}>
    <LanguageMenu variant="light" />
  </Box>
);

export default LanguageSwitcher;
