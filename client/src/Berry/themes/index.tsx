import { useMemo, ReactNode } from "react";
import {
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
  ThemeProvider,
  Theme,
  TypographyVariantsOptions,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Palette from "./palette";
import Typography from "./typography";
import componentStyleOverrides from "./compStyleOverride";
import customShadows from "./shadows";

import { CustomShadowProps } from "../types/default-theme";
import useConfig from "../hooks/useConfig";

interface Props {
  children: ReactNode;
}

export default function ThemeCustomization({ children }: Props) {
  const {
    borderRadius,
    fontFamily,
    mode,
    outlinedFilled,
    presetColor,
    themeDirection,
  } = useConfig();

  // Base theme (palette)
  const baseTheme: Theme = useMemo(
    () => Palette(mode, presetColor),
    [mode, presetColor]
  );

  // Typography, shadows, etc.
  const themeTypography: TypographyVariantsOptions = useMemo(
    () => Typography(baseTheme, borderRadius, fontFamily),
    [baseTheme, borderRadius, fontFamily]
  );

  const themeCustomShadows: CustomShadowProps = useMemo(
    () => customShadows(mode, baseTheme),
    [mode, baseTheme]
  );

  // Complete theme options
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      direction: themeDirection,
      palette: baseTheme.palette,
      mixins: {
        toolbar: {
          minHeight: "56px",
          padding: "16px",
          "@media (min-width: 600px)": {
            minHeight: "64px",
          },
        },
      },
      typography: themeTypography,
      customShadows: themeCustomShadows,
    }),
    [themeDirection, baseTheme, themeCustomShadows, themeTypography]
  );

  const finalTheme = useMemo(() => {
    const base = createTheme(themeOptions);
    base.components = componentStyleOverrides(
      base,
      borderRadius,
      outlinedFilled
    );
    return base;
  }, [themeOptions, borderRadius, outlinedFilled]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={finalTheme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
