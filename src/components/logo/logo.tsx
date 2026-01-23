import type { LinkProps } from "@mui/material/Link";

import { forwardRef } from "react";

import Link from "@mui/material/Link";
import { styled, useTheme } from "@mui/material/styles";

import { RouterLink } from "@/routes/components";

import { mergeClasses } from "@/utils/merge";
import { Box } from "@mui/material";
import { logoClasses } from "./classes";

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>((props, ref) => {
  const {
    className,
    href = "/",
    isSingle = false,
    disabled,
    sx,
    ...other
  } = props;

  const theme = useTheme();

  return (
    <LogoRoot
      ref={ref}
      href={href}
      underline="none"
      aria-label="Logo"
      component={RouterLink}
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        () => ({
          width: 60,
          height: 60,
          aspectRatio: "1/1",
          ...(disabled && { pointerEvents: "none" }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="img"
        src="/images/logo.png"
        sx={{ width: 1, height: 1 }}
      />
    </LogoRoot>
  );
});

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: "inherit",
  display: "inline-flex",
  verticalAlign: "middle",
}));
