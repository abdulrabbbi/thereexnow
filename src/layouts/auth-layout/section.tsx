import type { BoxProps } from "@mui/material/Box";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

type SectionProps = BoxProps & {};

export function Section({ sx }: SectionProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "none",
        flex: "1 1 auto",
        minWidth: 0,
        [theme.breakpoints.up("md")]: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ...sx,
      }}
    >
      <Box
        alt="Sign in"
        component="img"
        src={`/images/auth-bg.svg`}
        sx={{
          width: 1,
          height: "auto",
          maxWidth: 560,
          maxHeight: "80svh",
          objectFit: "contain",
        }}
      />
    </Box>
  );
}
