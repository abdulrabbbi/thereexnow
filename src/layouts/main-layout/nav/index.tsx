"use client";

import { HEADER } from "@/layouts/config-layout";
import { useNavConfig } from "@/layouts/nav-config";
import { Stack, StackProps } from "@mui/material";
import { NavList } from "./nav-list";

const DESKTOP_BREAKPOINT = "md";

type Props = StackProps & {
  onItemClick?: () => void;
};

export default function MainNav({
  onItemClick,
  spacing,
  direction,
  justifyContent,
  alignItems,
  sx,
  ...props
}: Props) {
  const mainNavConfig = useNavConfig();

  const stackSpacing =
    spacing ?? { xs: 2.5, [DESKTOP_BREAKPOINT]: 7 };
  const stackDirection =
    direction ?? { xs: "column", [DESKTOP_BREAKPOINT]: "row" };
  const stackJustifyContent = justifyContent ?? {
    xs: "flex-start",
    [DESKTOP_BREAKPOINT]: "center",
  };
  const stackAlignItems = alignItems ?? "center";

  return (
    <Stack
      {...props}
      component="nav"
      alignItems={stackAlignItems}
      justifyContent={stackJustifyContent}
      spacing={stackSpacing}
      direction={stackDirection}
      sx={{
        flexGrow: 1,
        height: { xs: "auto", [DESKTOP_BREAKPOINT]: HEADER.H_DESKTOP },
        ...(sx || {}),
      }}
    >
      {mainNavConfig.map((item, index) => (
        <NavList data={item} key={index} onItemClick={onItemClick} />
      ))}
    </Stack>
  );
}
