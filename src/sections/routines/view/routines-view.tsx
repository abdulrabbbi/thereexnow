"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { Routines } from "@/graphql/generated";
import { useGetTranslatedRoutines } from "@/hooks/helpers/translated-hooks";
import useLocales from "@/hooks/use-locales";
import { useSetState } from "@/hooks/use-set-state";
import { HEADER } from "@/layouts/config-layout";
import { RouterLink } from "@/routes/components";
import { getCategoriesRoute } from "@/routes/paths";
import { SearchBar } from "@/sections/common/search-bar";
import { Box, Button, Container, styled } from "@mui/material";
import { useState } from "react";
import { EmptyRoutinesList } from "../empty-routines-list";
import { RoutineCard } from "../routine-card";
import { RoutineRemoveDialog } from "../routine-remove-dialog";
import { RoutineShareDialog } from "../routine-share-dialog";

export default function RoutinesView() {
  const { t } = useLocales();

  const [keyword, setKeyword] = useState("");
  const { state, setState, onResetState } = useSetState<{
    data?: Routines;
    variant?: "share" | "remove";
  }>({});

  const { data, isLoading, isFetching } = useGetTranslatedRoutines({
    where: { name: { contains: keyword } },
  });

  return (
    <Container maxWidth="xl" sx={{ pt: 10 }}>
      {isLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : data?.length ? (
        <>
          <StickyBox py={2}>
            <StyledContainer maxWidth="md" sx={{ px: 0 }}>
              <SearchBar
                value={keyword}
                onChange={setKeyword}
                label={t("SEARCH_ROUTINE")}
                isLoading={!!keyword && isFetching}
                slotProps={{ root: { pl: 0, pr: 1 } }}
              />

              <Button
                size="medium"
                LinkComponent={RouterLink}
                href={getCategoriesRoute({})}
              >
                {t("ADD_A_NEW_ROUTINE")}
              </Button>
            </StyledContainer>
          </StickyBox>

          <Container
            maxWidth="xl"
            sx={{
              gap: 3,
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(5, 1fr)",
              },
            }}
          >
            {data?.map((item) => (
              <RoutineCard
                item={item}
                key={item.id}
                onShare={(routine) =>
                  setState({ data: routine, variant: "share" })
                }
                onRemove={(routine) =>
                  setState({ data: routine, variant: "remove" })
                }
              />
            ))}
          </Container>

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
              routine={state.data}
              onClose={onResetState}
            />
          ) : null}
        </>
      ) : (
        <EmptyRoutinesList />
      )}
    </Container>
  );
}

const StickyBox = styled(Box)({
  zIndex: 99,
  position: "sticky",
  top: HEADER.H_DESKTOP,
  backgroundColor: "white",
});

const StyledContainer = styled(Container)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
