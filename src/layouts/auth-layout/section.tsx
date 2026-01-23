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
        [theme.breakpoints.up("md")]: {
          display: "block",
        },
        ...sx,
      }}
    >
      <Box
        alt="Sign in"
        component="img"
        src={`/images/auth-bg.svg`}
        sx={{ width: 1, mt: 7 }}
      />
    </Box>
  );
}
