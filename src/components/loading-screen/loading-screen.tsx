"use client";

import type { SxProps, Theme } from "@mui/material/styles";

import { Fragment } from "react";

import LinearProgress from "@mui/material/LinearProgress";
import Portal from "@mui/material/Portal";
import { styled } from "@mui/material/styles";
import { Logo } from "../logo";

export type LoadingScreenProps = React.ComponentProps<"div"> & {
  portal?: boolean;
  sx?: SxProps<Theme>;
};

export function LoadingScreen({ portal, sx, ...other }: LoadingScreenProps) {
  const PortalWrapper = portal ? Portal : Fragment;

  return (
    <PortalWrapper>
      <LoadingContent sx={sx} {...other}>
        <Logo disabled />
        <LinearProgress color="primary" sx={{ width: 1, maxWidth: 50 }} />
      </LoadingContent>
    </PortalWrapper>
  );
}

const LoadingContent = styled("div")(({ theme }) => ({
  flexGrow: 1,
  width: "100%",
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}));
