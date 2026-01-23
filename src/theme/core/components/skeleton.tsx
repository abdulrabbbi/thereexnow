import type { Components, Theme } from "@mui/material/styles";

import { alpha } from "@mui/material/styles";

const MuiSkeleton: Components<Theme>["MuiSkeleton"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { animation: "wave", variant: "rounded" },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: alpha(theme.palette.grey["400"], 0.12),
    }),
    rounded: ({ theme }) => ({ borderRadius: theme.shape.borderRadius * 2 }),
  },
};

export const skeleton = { MuiSkeleton };
