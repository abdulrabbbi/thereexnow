"use client";

import { LoadingScreen } from "@/components/loading-screen";
import {
  Routine_GetRoutinesQueryVariables,
  Routines,
} from "@/graphql/generated";
import { useGetTranslatedRoutines } from "@/hooks/helpers/translated-hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useSetState } from "@/hooks/use-set-state";
import { HEADER } from "@/layouts/config-layout";
import { useRouter } from "@/routes/hooks";
import { getCategoriesRoute } from "@/routes/paths";
import { Box, Container, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RoutinesToolbar } from "../components/RoutinesToolbar";
import { EmptyRoutinesList } from "../empty-routines-list";
import { RoutineCard } from "../routine-card";
import { RoutineRemoveDialog } from "../routine-remove-dialog";
import { RoutineShareDialog } from "../routine-share-dialog";

export default function RoutinesView() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), 400);
  const { state, setState, onResetState } = useSetState<{
    data?: Routines;
    variant?: "share" | "remove";
  }>({});

  useEffect(() => {
    setKeyword(debouncedQuery);
  }, [debouncedQuery]);

  const onSearch = useCallback(() => {
    setKeyword(query.trim());
  }, [query]);

  const onAdd = useCallback(() => {
    router.push(getCategoriesRoute({}));
  }, [router]);

  const routineQueryVariables = useMemo<Routine_GetRoutinesQueryVariables | undefined>(
    () =>
      keyword
        ? {
            where: { name: { contains: keyword } },
          }
        : undefined,
    [keyword],
  );

  const { data, isLoading, isFetching } = useGetTranslatedRoutines(
    routineQueryVariables,
  );

  return (
    <Container
      maxWidth="xl"
      sx={{
        pt: {
          xs: `${HEADER.H_MOBILE + 12}px`,
          md: `${HEADER.H_DESKTOP + 12}px`,
        },
        pb: { xs: 3, md: 5 },
        minWidth: 0,
      }}
    >
      <Paper
        variant="outlined"
        sx={{ p: { xs: 1.5, md: 2 }, mb: { xs: 2, md: 3 }, minWidth: 0, width: 1 }}
      >
        <Box sx={{ minWidth: 0, width: 1 }}>
          <RoutinesToolbar
            value={query}
            onChange={setQuery}
            onSearch={onSearch}
            onAdd={onAdd}
            loading={!!keyword && isFetching}
          />
        </Box>
      </Paper>

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
