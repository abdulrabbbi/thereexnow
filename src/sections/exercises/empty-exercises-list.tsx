import EmptyContent from "@/components/empty-content";
import useLocales from "@/hooks/use-locales";
import { Box, Button } from "@mui/material";

type Props = {
  isFilterApplied?: boolean;
  onResetFilters?: VoidFunction;
};

export function EmptyExercisesList({ isFilterApplied, onResetFilters }: Props) {
  const {t} = useLocales()
  return (
    <Box
      sx={{
        display: "flex",
        height: "60vh",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <EmptyContent
        title={t("NO_EXERCISE")}
        action={
          isFilterApplied ? (
            <Button
              sx={{ mt: 3 }}
              variant="soft"
              color="inherit"
              onClick={onResetFilters}
            >
              Reset filters
            </Button>
          ) : null
        }
      />
    </Box>
  );
}
