import { BoxProps } from "@mui/material";
import { ReactNode } from "react";

export type MiniNavItemsType = {
  title: string;
  icon: ReactNode;
} & (
  | { onClick: VoidFunction; isLoading?: boolean; link?: never }
  | { onClick?: never; isLoading?: never; link: string }
);

export type MiniNavSidebarProps = BoxProps & {
  navItems: Array<MiniNavItemsType>;
};
