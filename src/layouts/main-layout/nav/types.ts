// src/layouts/main-layout/nav/types.ts

import type { ButtonBaseProps } from "@mui/material/ButtonBase";

/**
 * Base item data coming from nav-config
 * (title/path + optional flags)
 */
export type NavItemBaseProps = {
  title: string;
  path: string;
  externalLink?: boolean;
  disabled?: boolean;
};

/**
 * State computed at runtime (active, etc.)
 */
export type NavItemStateProps = {
  active?: boolean;
};

/**
 * Props for the actual NavItem component.
 * Extends MUI ButtonBase props because StyledNavItem is usually a styled ButtonBase.
 */
export type NavItemProps = ButtonBaseProps<"div"> &
  NavItemBaseProps &
  NavItemStateProps & {
    onItemClick?: () => void;
  };

/**
 * Props for the NavList wrapper component
 */
export type NavListProps = {
  data: NavItemBaseProps;
  onItemClick?: () => void;
};
