import type { Components, Theme } from "@mui/material/styles";

import { alpha } from "@mui/material/styles";

const MuiBackdrop: Components<Theme>["MuiBackdrop"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: alpha(theme.palette.grey["800"], 0.48),
    }),
    invisible: { background: "transparent" },
  },
};

export const backdrop = { MuiBackdrop };
