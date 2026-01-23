import { Box, BoxProps } from "@mui/material";
import * as HomeConfig from "./home-config";

export function ExercisesMainSection({ children, ...rest }: BoxProps) {
  return (
    <Box
      component="main"
      sx={{
        px: 3,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: `calc(100% - ${HomeConfig.SIDE_BARS}px)`,
        height: `calc(100vh - ${HomeConfig.HEADERS_HEIGHT}px)`,
        maxHeight: `calc(100vh - ${HomeConfig.HEADERS_HEIGHT}px)`,
        ...rest,
      }}
    >
      {children}
    </Box>
  );
}
