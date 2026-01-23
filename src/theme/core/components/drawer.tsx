import type { Components, Theme } from "@mui/material/styles";

import { alpha } from "@mui/material/styles";
import { paper, stylesMode } from "../../styles";

const MuiDrawer: Components<Theme>["MuiDrawer"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paperAnchorRight: ({ ownerState, theme }) => ({
      ...(ownerState.variant === "temporary" && {
        ...paper({ theme }),
        boxShadow: `-40px 40px 80px -8px ${alpha(theme.palette.grey["500"], 0.24)}`,
        [stylesMode.dark]: {
          boxShadow: `-40px 40px 80px -8px ${alpha(theme.palette.common.black, 0.24)}`,
        },
      }),
    }),
    paperAnchorLeft: ({ ownerState, theme }) => ({
      ...(ownerState.variant === "temporary" && {
        ...paper({ theme }),
        boxShadow: `40px 40px 80px -8px ${alpha(theme.palette.grey["500"], 0.24)}`,
        [stylesMode.dark]: {
          boxShadow: `40px 40px 80px -8px  ${alpha(theme.palette.common.black, 0.24)}`,
        },
      }),
    }),
  },
};

export const drawer = { MuiDrawer };
