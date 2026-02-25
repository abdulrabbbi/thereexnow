"use client";

import { LoadingScreen } from "@/components/loading-screen";
import {
  Routine_GetRoutinesQueryVariables,
  Routines,
} from "@/graphql/generated";
import { useGetTranslatedRoutines } from "@/hooks/helpers/translated-hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import useLocales from "@/hooks/use-locales";
import { useSetState } from "@/hooks/use-set-state";
import { RouterLink } from "@/routes/components";
import { getCategoriesRoute } from "@/routes/paths";
import { SearchBar } from "@/sections/common/search-bar";
import { Box, Button, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useMemo, useState } from "react";
import { EmptyRoutinesList } from "../empty-routines-list";
import { RoutineCard } from "../routine-card";
import { RoutineRemoveDialog } from "../routine-remove-dialog";
import { RoutineShareDialog } from "../routine-share-dialog";

export default function RoutinesView() {
  const { t } = useLocales();

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword.trim(), 400);
  const { state, setState, onResetState } = useSetState<{
    data?: Routines;
    variant?: "share" | "remove";
  }>({});

  const routineQueryVariables = useMemo<Routine_GetRoutinesQueryVariables | undefined>(
    () =>
      debouncedKeyword
        ? {
            where: { name: { contains: debouncedKeyword } },
          }
        : undefined,
    [debouncedKeyword],
  );

  const { data, isLoading, isFetching } = useGetTranslatedRoutines(
    routineQueryVariables,
  );

  return (
    <Container
      maxWidth="xl"
      sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 3, md: 5 }, minWidth: 0 }}
    >
      <Box sx={{ mb: { xs: 2, md: 3 }, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 360 } }}>
            <SearchBar
              value={keyword}
              onChange={setKeyword}
              onInputChange={setKeyword}
              label={t("SEARCH_ROUTINE")}
              isLoading={!!debouncedKeyword && isFetching}
              slotProps={{
                root: {
                  px: 0,
                  width: 1,
                  minWidth: 0,
                  gap: 1,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  alignItems: { xs: "stretch", sm: "center" },
                },
                button: {
                  sx: {
                    width: { xs: "100%", sm: 130 },
                    minWidth: { xs: 0, sm: 130 },
                    flexShrink: 0,
                  },
                },
              }}
            />
          </Box>

          <Button
            size="medium"
            variant="contained"
            LinkComponent={RouterLink}
            href={getCategoriesRoute({})}
            sx={{
              width: { xs: "100%", sm: "auto" },
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {t("ADD_A_NEW_ROUTINE")}
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : data?.length ? (
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} sx={{ minWidth: 0 }}>
          {data?.map((item) => (
            <Grid
              key={item.id}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              sx={{ minWidth: 0 }}
            >
              <RoutineCard
                item={item}
                onShare={(routine) =>
                  setState({ data: routine, variant: "share" })
                }
                onRemove={(routine) =>
                  setState({ data: routine, variant: "remove" })
                }
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyRoutinesList />
      )}

      {state.data && state.variant === "share" ? (
        <RoutineShareDialog
          open
          onClose={onResetState}
          routineId={state.data.id}
        />
      ) : null}

      {state.data && state.variant === "remove" ? (
        <RoutineRemoveDialog
          open
          routineId={state.data.id}
          onClose={onResetState}
        />
      ) : null}
    </Container>
  );
}
