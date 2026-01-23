import type { Components, Theme } from "@mui/material/styles";

import { alpha } from "@mui/material/styles";

const MuiPaper: Components<Theme>["MuiPaper"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { elevation: 0 },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: { backgroundImage: "none" },
    outlined: ({ theme }) => ({
      borderColor: alpha(theme.palette.grey["500"], 0.16),
    }),
  },
};

export const paper = { MuiPaper };
