import * as HomeConfig from "@/sections/exercises/home-config";
import { hideScrollY } from "@/theme/styles";
import { Box, BoxProps } from "@mui/material";

export function ShopMainSection({ children, ...rest }: BoxProps) {
  return (
    <Box
      {...rest}
      component="main"
      sx={{
        px: 3,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: `calc(100vh - ${HomeConfig.HEADERS_HEIGHT}px)`,
        maxHeight: `calc(100vh - ${HomeConfig.HEADERS_HEIGHT}px)`,
        ...hideScrollY,
        ...rest.sx,
      }}
    >
      {children}
    </Box>
  );
}
