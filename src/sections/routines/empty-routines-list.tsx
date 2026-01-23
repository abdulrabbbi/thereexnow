import EmptyContent from "@/components/empty-content";
import { RouterLink } from "@/routes/components";
import { getCategoriesRoute } from "@/routes/paths";
import { Box, Button } from "@mui/material";

export function EmptyRoutinesList() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "60vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <EmptyContent
        title="No routines"
        description="Try to add a new routine"
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
