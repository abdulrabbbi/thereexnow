"use client";

import type { SxProps, Theme } from "@mui/material/styles";

import { Box } from "@mui/material";
import { Content, Main } from "./main";
import { Section } from "./section";

export type AuthLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box sx={{ height: "100%", minHeight: "100vh", bgcolor: "#eafcff" }}>
      <Main>
        <Content>{children}</Content>
        <Section />
      </Main>
    </Box>
  );
}
