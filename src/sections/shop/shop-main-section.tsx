import { Box, BoxProps } from "@mui/material";

export function ShopMainSection({ children, sx, ...rest }: BoxProps) {
  return (
    <Box
      component="main"
      sx={[
        {
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          px: { xs: 0, md: 3 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </Box>
  );
}
