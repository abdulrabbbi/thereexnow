import EmptyContent from "@/components/empty-content";
import { RouterLink } from "@/routes/components";
import { getCategoriesRoute } from "@/routes/paths";
import { Box, Button } from "@mui/material";

export function EmptyBoard() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <EmptyContent
        title="Board is empty"
        description="Try to add exercises to the board"
        action={
          <Button
            sx={{ mt: 5 }}
            color="inherit"
            LinkComponent={RouterLink}
            href={getCategoriesRoute({})}
          >
            Got to exercises
          </Button>
        }
      />
    </Box>
  );
}
