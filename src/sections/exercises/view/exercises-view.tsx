"use client";

import { Iconify } from "@/components/iconify";
import { LoadingScreen } from "@/components/loading-screen";
import { Categories, ExerciseDto } from "@/graphql/generated";
import { useGetAllCategories } from "@/hooks/helpers/category";
import {
  useGetTranslatedExercises,
  useGetTranslatedFavoriteExercises,
} from "@/hooks/helpers/translated-hooks";
import { useAuth } from "@/hooks/use-auth";
import { useBoard } from "@/hooks/use-board";
import useLocales from "@/hooks/use-locales";
import { usePagination } from "@/hooks/use-pagination";
import { HEADER } from "@/layouts/config-layout";
import { useSearchParams } from "@/routes/hooks";
import { SearchBar } from "@/sections/common/search-bar";
import { hideScrollY } from "@/theme/styles";
import { simplifyExercise } from "@/utils";
import { css, Global } from "@emotion/react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { EmptyExercisesList } from "../empty-exercises-list";
import { ExerciseCard } from "../exercise-card";
import { ExercisesMainSection } from "../exercises-main-section";
import { ExercisesNav } from "../exercises-nav";
import { ExercisesRoutine } from "../exercises-routine";
import { ExercisesRoutineActions } from "../exercises-routine-actions";
import {
  ExercisesSortSelect,
  ExercisesSortType,
} from "../exercises-sort-select";

type Props = {
  isFavorite?: boolean;
};

export function ExercisesView({ isFavorite = false }: Props) {
  const board = useBoard();
  const { t } = useLocales();
  const pagination = usePagination();
  const { authenticated } = useAuth();
  const searchParams = useSearchParams();

  const searchParam = searchParams?.get("keyword") ?? "";
  const categoryId = searchParams?.get("categoryId") ?? undefined;
  const subCategoryId = searchParams?.get("subCategoryId") ?? undefined;

  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState<ExercisesSortType>(
    ExercisesSortType.DEFAULT
  );
  const [categoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false);

  useEffect(() => {
    if (searchParam && searchParam != keyword) {
      setKeyword(searchParam);
    }
  }, [searchParam]);

  const { categoriesData, categoriesLoading } = useGetAllCategories();

  const variables = {
    keyword,
    sort: sortBy,
    page: pagination.page - 1,
    categoryId: categoryId ? Number(categoryId) : undefined,
    subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
  };

  const {
    exercisesData,
    exercisesLoading,
    exercisesFetching,
    exercisesTotalCount,
  } = useGetTranslatedExercises({ ...variables, enabled: !isFavorite });

  const {
    favoriteExercisesData,
    favoriteExercisesLoading,
    favoriteExercisesFetching,
    favoriteExercisesTotalCount,
  } = useGetTranslatedFavoriteExercises({
    ...variables,
    enabled: isFavorite && authenticated,
  });

  const data = isFavorite ? favoriteExercisesData : exercisesData;
  const isLoading = isFavorite ? favoriteExercisesLoading : exercisesLoading;
  const isFetching = isFavorite ? favoriteExercisesFetching : exercisesFetching;
  const totalCount = isFavorite
    ? favoriteExercisesTotalCount
    : exercisesTotalCount;

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === "routine-droppable") {
      const exerciseId = parseInt(draggableId.replace("exercise-", ""));
      const exerciseData = data?.find(
        (item: any) => item.exercise?.id === exerciseId
      );

      const isExistInBoard = board.data.some(
        (item) => item.exercise?.id === exerciseId
      );

      if (exerciseData && !isExistInBoard) {
        board.onAddExercise(simplifyExercise(exerciseData as ExerciseDto));
      }
    }
  };

  const onResetFilters = () => {
    setKeyword("");
  };

  useEffect(() => {
    if (keyword) {
      onResetFilters();
    }
  }, [categoryId, subCategoryId]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Global
        styles={css`
          /* This ensures the drag layer is always on top */
          [data-rbd-drag-placeholder] {
            opacity: 0.2;
          }

          /* This targets the drag layer created by react-beautiful-dnd */
          [data-rbd-draggable-id] {
            z-index: 9999 !important;
          }

          /* This targets the portal created for dragging */
          [data-rbd-drag-handle-draggable-id] {
            z-index: 9999 !important;
          }

          /* Target the portal element directly */
          div[data-rbd-portal] {
            z-index: 9999 !important;
          }
        `}
      />
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3 },
          pt: {
            xs: `${HEADER.H_MOBILE + 24}px`,
            md: `${HEADER.H_DESKTOP + 24}px`,
          },
          pb: { xs: 4, md: 6 },
        }}
      >
        {categoriesLoading ? (
          <LoadingScreen sx={{ height: "60svh" }} />
        ) : (
          <>
            <Box
              sx={{
                position: "sticky",
                top: { xs: HEADER.H_MOBILE, md: HEADER.H_DESKTOP },
                zIndex: 99,
                bgcolor: "background.paper",
                py: 2,
              }}
            >
              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ minWidth: 0 }}
              >
                <Grid
                  size={{ xs: 12 }}
                  sx={{ display: { xs: "block", md: "none" }, minWidth: 0 }}
                >
                  <Button
                    fullWidth
                    color="inherit"
                    variant="outlined"
                    startIcon={<Iconify icon="eva:menu-2-fill" />}
                    onClick={() => setCategoriesDrawerOpen(true)}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {t("CATEGORIES")}
                  </Button>
                </Grid>

                <Grid
                  size={{ xs: 12, sm: 4, md: 3, lg: 3 }}
                  sx={{ minWidth: 0 }}
                >
                  <ExercisesSortSelect
                    value={sortBy}
                    onChange={(value) => {
                      setSortBy(value);
                      pagination.onChangePage(undefined, 1);
                    }}
                  />
                </Grid>

                <Grid
                  size={{ xs: 12, sm: 8, md: 5, lg: 5 }}
                  sx={{ minWidth: 0 }}
                >
                  <SearchBar
                    value={keyword}
                    onChange={setKeyword}
                    label={t("SEARCH_EXERCISE")}
                    isLoading={!!keyword && isFetching}
                    slotProps={{
                      root: {
                        px: { xs: 0, sm: 2 },
                        direction: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        sx: { minWidth: 0 },
                      },
                      button: {
                        sx: { width: { xs: 1, sm: 130 } },
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4, lg: 4 }} sx={{ minWidth: 0 }}>
                  <ExercisesRoutineActions />
                </Grid>
              </Grid>
            </Box>

            <Drawer
              open={categoriesDrawerOpen}
              onClose={() => setCategoriesDrawerOpen(false)}
              PaperProps={{
                sx: {
                  width: { xs: "85vw", sm: 360 },
                  maxWidth: 360,
                },
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6">{t("CATEGORIES")}</Typography>
                <IconButton
                  onClick={() => setCategoriesDrawerOpen(false)}
                  aria-label="Close categories"
                >
                  <Iconify icon="eva:close-fill" />
                </IconButton>
              </Box>

              <Divider />

              <Box sx={{ p: 2, minWidth: 0, ...hideScrollY }}>
                <ExercisesNav
                  data={categoriesData as Array<Categories>}
                  source={isFavorite ? "favorites" : "exercises"}
                  onItemClick={() => setCategoriesDrawerOpen(false)}
                />
              </Box>
            </Drawer>

            <Box
              sx={{
                mt: 3,
                display: { xs: "block", md: "flex" },
                alignItems: "flex-start",
                gap: 3,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                  flexShrink: 0,
                  width: { md: 280, lg: 300 },
                  minWidth: 0,
                  ...hideScrollY,
                }}
              >
                <ExercisesNav
                  data={categoriesData as Array<Categories>}
                  source={isFavorite ? "favorites" : "exercises"}
                />
              </Box>

              <Grid container spacing={3} sx={{ flex: 1, minWidth: 0 }}>
                <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
                  <ExercisesMainSection>
                    {isLoading ? (
                      <LoadingScreen sx={{ height: "60svh" }} />
                    ) : data?.length ? (
                      <Droppable
                        droppableId="exercises-droppable"
                        type="EXERCISE"
                        isDropDisabled={true}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{ width: 1, minWidth: 0 }}
                          >
                            <Grid container spacing={2.5} sx={{ minWidth: 0 }}>
                              {data?.map((item: any, index) => (
                                <Grid
                                  key={`exercise-${item.exercise?.id}`}
                                  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                  sx={{ minWidth: 0 }}
                                >
                                  <Draggable
                                    draggableId={`exercise-${item.exercise?.id}`}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <ExerciseCard
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        isFavorite={isFavorite}
                                        data={item as ExerciseDto}
                                        style={{
                                          ...provided.draggableProps.style,
                                          transform: snapshot.isDragging
                                            ? provided.draggableProps.style
                                                ?.transform
                                            : "none",
                                          opacity: snapshot.isDragging ? 0.5 : 1,
                                          zIndex: snapshot.isDragging
                                            ? 9999
                                            : "auto",
                                        }}
                                      />
                                    )}
                                  </Draggable>
                                </Grid>
                              ))}
                            </Grid>
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    ) : (
                      <EmptyExercisesList
                        isFilterApplied={!!keyword}
                        onResetFilters={onResetFilters}
                      />
                    )}

                    <Pagination
                      shape="rounded"
                      variant="outlined"
                      count={totalCount}
                      page={pagination.page}
                      onChange={pagination.onChangePage}
                      sx={{ my: 4, alignSelf: "center" }}
                    />
                  </ExercisesMainSection>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }} sx={{ minWidth: 0 }}>
                  <Droppable droppableId="routine-droppable" type="EXERCISE">
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          position: "relative",
                          width: 1,
                          minWidth: 0,
                          minHeight: { xs: 240, sm: 320, md: 480 },
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            zIndex: 1,
                            height: "100%",
                            display: "flex",
                            minWidth: 0,
                          }}
                        >
                          <ExercisesRoutine />
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                          }}
                        >
                          {provided.placeholder}
                        </Box>
                      </Box>
                    )}
                  </Droppable>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </DragDropContext>
  );
}
