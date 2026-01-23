import Box, { BoxProps } from "@mui/material/Box";

export function MiniNavContent({ children, sx, ...other }: BoxProps) {
  return (
    <Box
      component="main"
      sx={{
        py: 6,
        flexGrow: 1,
        overflowY: "auto",
        scrollbarWidth: "none", // Hide scrollbar for Firefox
        msOverflowStyle: "none", // Hide scrollbar for IE and Edge (legacy)
        "&::-webkit-scrollbar": {
          display: "none", // Hide scrollbar for WebKit browsers (Chrome, Safari, Edge)
        },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
