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
        pt: 5,
        pb: 5,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        [theme.breakpoints.up("md")]: {
          gap: 10,
        },
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
        py: 4,
        px: 3,
        width: 1,
        borderRadius: 2,
        maxWidth: "380px",
        bgcolor: "background.paper",
        boxShadow: { xs: "none", md: theme.customShadows.z24 },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
