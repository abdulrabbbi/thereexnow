import type { BoxProps } from "@mui/material/Box";
import type { ContainerProps } from "@mui/material/Container";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";

export function Main({ sx, children, ...other }: ContainerProps) {
  const theme = useTheme();

  return (
    <Container
      component="main"
      sx={{
        minHeight: "100svh",
        p: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 3, md: 10 },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Container>
  );
}

export function Content({ sx, children, ...other }: BoxProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: { xs: 3, sm: 4, md: 5 },
        width: 1,
        minWidth: 0,
        borderRadius: 2,
        maxWidth: { xs: 420, sm: 520, md: 620, lg: 720 },
        bgcolor: "background.paper",
        boxShadow: { xs: "none", sm: theme.customShadows.z24 },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
