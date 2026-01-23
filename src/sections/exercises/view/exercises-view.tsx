"use client";

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
import { Box, BoxProps, Container, Pagination, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import * as HomeConfig from "../home-config";

type Props = {
  isFavorite?: boolean;
};

export function ExercisesView({ isFavorite = false }: Props) {
  const board = useBoard();
  const { t } = useLocales();
  const pagination = usePagination();
  const { authenticated } = useAuth();
  const searchParams = useSearchParams();

  const searchParam = searchParams.get("keyword");
  const categoryId = searchParams.get("categoryId");
  const subCategoryId = searchParams.get("subCategoryId");

  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState<ExercisesSortType>(
    ExercisesSortType.DEFAULT
  );

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
    categoryId: Number(categoryId),
    subCategoryId: Number(subCategoryId),
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
        (item:any) => item.exercise?.id === exerciseId
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
      <Container maxWidth="xl">
        {categoriesLoading ? (
          <LoadingScreen sx={{ height: "60svh" }} />
        ) : (
          <>
            <Stack
              py={2}
              direction="row"
              alignItems="center"
              sx={{
                zIndex: 99,
                bgcolor: "white",
                position: "sticky",
                top: HEADER.H_DESKTOP,
              }}
            >
              <ExercisesSortSelect
                value={sortBy}
                sx={{ width: HomeConfig.CATEGORY_WIDTH }}
                onChange={(value) => {
                  setSortBy(value);
                  pagination.onChangePage(undefined, 1);
                }}
              />

              <SearchBar
                value={keyword}
                onChange={setKeyword}
                label={t("SEARCH_EXERCISE")}
                isLoading={!!keyword && isFetching}
              />

              <ExercisesRoutineActions />
            </Stack>

            <Box
              sx={{
                mt: 10,
                display: "flex",
                height: `calc(100vh - ${HomeConfig.HEADERS_HEIGHT}px)`,
                maxHeight: `calc(100vh - ${HomeConfig.HEADERS_HEIGHT}px)`,
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: HomeConfig.CATEGORY_WIDTH,
                  ...hideScrollY,
                }}
              >
                <ExercisesNav
                  data={categoriesData as Array<Categories>}
                  source={isFavorite ? "favorites" : "exercises"}
                />
              </Box>

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
                      <GridLayout
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {data?.map((item:any, index) => (
                          <Draggable
                            key={`exercise-${item.exercise?.id}`}
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
                                    ? provided.draggableProps.style?.transform
                                    : "none",
                                  opacity: snapshot.isDragging ? 0.5 : 1,
                                  zIndex: snapshot.isDragging ? 9999 : "auto",
                                }}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </GridLayout>
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

              <Droppable droppableId="routine-droppable" type="EXERCISE">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        height: "100%",
                        display: "flex",
                      }}
                    >
                      <ExercisesRoutine />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                      }}
                    >
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </Box>
          </>
        )}
      </Container>
    </DragDropContext>
  );
}

const GridLayout = React.forwardRef(({ children, ...props }: BoxProps, ref) => {
  return (
    <Box
      ref={ref}
      rowGap={3}
      display="grid"
      columnGap={2.5}
      gridTemplateColumns={{
        xs: "repeat(2, 1fr)",
        sm: "repeat(3, 1fr)",
      }}
      {...props}
    >
      {children}
    </Box>
  );
});

GridLayout.displayName = "GridLayout";
