"use client";

import { Box, BoxProps, Container, ContainerProps } from "@mui/material";
import { PropsWithChildren } from "react";
import { HEADER } from "../config-layout";
import { MiniNavContent } from "./mini-nav-content";
import { MiniNavSidebar } from "./mini-nav-sidebar";
import { MiniNavItemsType } from "./types";

type Props = PropsWithChildren<{
  navItems: Array<MiniNavItemsType>;
  slotProps?: {
    wrapper?: BoxProps;
    container?: ContainerProps;
    sidebar?: React.ComponentProps<typeof MiniNavSidebar>;
    content?: React.ComponentProps<typeof MiniNavContent>;
  };
}>;

export default function MiniNavLayout({
  navItems,
  children,
  slotProps,
}: Props) {
  return (
    <Container maxWidth="xl" {...slotProps?.container}>
      <Box
        {...slotProps?.wrapper}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: { xs: 1.5, md: 3 },
          mt: `${HEADER.H_DESKTOP}px`,
          maxHeight: `calc(100vh - ${HEADER.H_DESKTOP}px)`,
          ...slotProps?.wrapper?.sx,
        }}
      >
        <MiniNavSidebar navItems={navItems} {...slotProps?.sidebar} />

        <MiniNavContent {...slotProps?.content}>{children}</MiniNavContent>
      </Box>
    </Container>
  );
}
