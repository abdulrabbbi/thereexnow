"use client";

/* i18n */
import "../locales/i18n";

import type {} from "@mui/lab/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";

import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PropsWithChildren } from "react";
import {
  colorSchemes,
  components,
  customShadows,
  shadows,
  typography,
} from "./core";
import { RTL } from "./right-to-left";

export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = createTheme({
    components,
    typography,
    direction: "ltr",
    shadows: shadows("light"),
    shape: { borderRadius: 8 },
    palette: colorSchemes.light?.palette,
    customShadows: customShadows("light"),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <RTL direction="ltr">{children}</RTL>
      </MuiThemeProvider>
    </LocalizationProvider>
  );
}
