import type { ColorSystemOptions } from "@mui/material/styles";

import { alpha } from "@mui/material/styles";
import COLORS from "./colors.json";

declare module "@mui/material/styles/createPalette" {
  interface CommonColors {
    white: string;
    black: string;
  }
  interface TypeText {
    disabled: string;
  }
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

declare module "@mui/material/styles" {
  interface ThemeVars {
    transitions: Theme["transitions"];
  }
}

declare module "@mui/material" {
  interface Color {
    ["50"]: string;
    ["100"]: string;
    ["200"]: string;
    ["300"]: string;
    ["400"]: string;
    ["500"]: string;
    ["600"]: string;
    ["700"]: string;
    ["800"]: string;
    ["900"]: string;
  }
}

export type ColorType =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

// Grey
export const grey = COLORS.grey;

// Primary
export const primary = COLORS.primary;

// Secondary
export const secondary = COLORS.secondary;

// Info
export const info = COLORS.info;

// Success
export const success = COLORS.success;

// Warning
export const warning = COLORS.warning;

// Error
export const error = COLORS.error;

// Common
export const common = COLORS.common;

// Text
export const text = {
  light: { primary: grey[800], secondary: grey[600], disabled: grey[500] },
  dark: { primary: "#FFFFFF", secondary: grey[500], disabled: grey[600] },
};

// Background
export const background = {
  light: {
    paper: "#FFFFFF",
    default: "#FFFFFF",
    neutral: grey[200],
  },
  dark: {
    paper: grey[800],
    default: grey[900],
    neutral: "#28323D",
  },
};

// Action
export const baseAction = {
  hover: alpha(grey["500"], 0.08),
  selected: alpha(grey["500"], 0.16),
  focus: alpha(grey["500"], 0.24),
  disabled: alpha(grey["500"], 0.8),
  disabledBackground: alpha(grey["500"], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

export const action = {
  light: { ...baseAction, active: grey[600] },
  dark: { ...baseAction, active: grey[500] },
};

/*
 * Base palette
 */
export const basePalette = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey["500"], 0.2),
  action,
};

export const lightPalette = {
  ...basePalette,
  text: text.light,
  background: background.light,
  action: action.light,
};

export const darkPalette = {
  ...basePalette,
  text: text.dark,
  background: background.dark,
  action: action.dark,
};

export const colorSchemes: Partial<
  Record<"dark" | "light", ColorSystemOptions>
> = {
  light: { palette: lightPalette },
  dark: { palette: darkPalette },
};
