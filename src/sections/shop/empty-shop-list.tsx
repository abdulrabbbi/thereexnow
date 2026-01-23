import EmptyContent from "@/components/empty-content";
import { Box } from "@mui/material";

export function EmptyShopList() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "60vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <EmptyContent title="No products" />
    </Box>
  );
}
