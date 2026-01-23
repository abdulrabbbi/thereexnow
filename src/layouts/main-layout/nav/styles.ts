// import { ListItemButton, styled } from "@mui/material";
// import { NavItemStateProps } from "./types";

// export const StyledNavItem = styled(ListItemButton, {
//   shouldForwardProp: (prop) => prop !== "active" && prop !== "subItem",
// })<NavItemStateProps>(({ active, theme }) => ({
//   width: "100%",
//   justifyContent: "flex-start",
//   paddingBlock: theme.spacing(1.5),
//   paddingInline: theme.spacing(2),
//   borderRadius: theme.shape.borderRadius * 1.25,
//   fontSize: 14,
//   minHeight: "auto",
//   color: theme.palette.grey[900],
//   fontWeight: theme.typography.fontWeightMedium,
//   textTransform: "none",
//   transition: theme.transitions.create(["color", "background-color"], {
//     duration: theme.transitions.duration.shorter,
//   }),
//   "&:hover": {
//     color: theme.palette.primary.dark,
//     backgroundColor: theme.palette.action.hover,
//   },
//   ...(active && {
//     color: theme.palette.primary.main,
//     backgroundColor: theme.palette.action.selected,
//     fontWeight: theme.typography.fontWeightBold,
//   }),
//   [theme.breakpoints.up("sm")]: {
//     fontSize: 16,
//   },
// }));



import { ListItemButton, styled } from "@mui/material";
import { NavItemStateProps } from "./types";

export const StyledNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "subItem",
})<NavItemStateProps>(({ active, theme }) => ({
  // ✅ Drawer/mobile default
  width: "100%",
  justifyContent: "flex-start",
  paddingBlock: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 1.25,
  fontSize: 14,
  minHeight: "auto",
  color: theme.palette.grey[900],
  fontWeight: theme.typography.fontWeightMedium,
  textTransform: "none",
  transition: theme.transitions.create(["color", "background-color"], {
    duration: theme.transitions.duration.shorter,
  }),

  "&:hover": {
    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.hover,
  },

  ...(active && {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.selected,
    fontWeight: theme.typography.fontWeightBold,
  }),

  // ✅ Desktop top navbar version (md+)
  [theme.breakpoints.up("md")]: {
    width: "auto",
    justifyContent: "center",
    paddingInline: theme.spacing(1.25),
    paddingBlock: theme.spacing(0.75),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: "transparent", // remove drawer-like background
    "&:hover": {
      backgroundColor: "transparent",
    },
    ...(active && {
      backgroundColor: "transparent",
    }),
  },

  [theme.breakpoints.up("sm")]: {
    fontSize: 16,
  },
}));
