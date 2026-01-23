import {
  ExerciseDto,
  ExerciseDtoFilterInput,
  SortEnumType,
  useExercise_CreateFavoriteExerciseMutation,
  useExercise_DeleteFavoriteExerciseMutation,
  useExercise_GetExercisesQuery,
  useFavoriteExercise_GetFavoriteExercisesQuery,
} from "@/graphql/generated";
import { ExercisesSortType } from "@/sections/exercises/exercises-sort-select";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

type useGetExercisesProps = {
  page?: number;
  keyword?: string;
  enabled?: boolean;
  categoryId?: number;
  subCategoryId?: number;
  sort?: ExercisesSortType;
  where?: ExerciseDtoFilterInput;
  take?: number;
};

export function useGetExercises({
  enabled,
  page = 1,
  categoryId,
  keyword = "",
  subCategoryId,
  sort = ExercisesSortType.DEFAULT,
  where,
  take = 9,
}: useGetExercisesProps) {
  const { data, isLoading, isFetching } = useExercise_GetExercisesQuery(
    {
      take,
      skip: page * 9,
      where: {
        exercise: {
          name: { contains: keyword },
          ...((categoryId || subCategoryId) && {
            subCategory: {
              ...(categoryId && {
                category: { id: { eq: categoryId } },
              }),
              ...(subCategoryId && {
                id: { eq: Number(subCategoryId) },
              }),
            },
          }),
        },
        ...(where || {}),
      },
      order:
        sort === "POPULAR"
          ? [{ favoriteCount: SortEnumType.Desc }]
          : sort === "A-Z"
            ? [{ exercise: { name: SortEnumType.Asc } }]
            : [],
    },
    {
      enabled,
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData, // Use previous data as placeholder
    }
  );

  const totalPages: number = useMemo(() => {
    const totalCount = Number(data?.exercise_getExercises?.result?.totalCount);

    return Math.ceil(totalCount / 9);
  }, [data]);

  return {
    exercisesLoading: isLoading,
    exercisesFetching: isFetching,
    exercisesTotalCount: totalPages,
    exercisesData: data?.exercise_getExercises?.result?.items,
  };
}

export function useGetExercise(exerciseId?: number) {
  const { data, isLoading } = useExercise_GetExercisesQuery(
    {
      where: { exercise: { id: { eq: exerciseId } } },
    },
    { enabled: !!exerciseId }
  );

  const exerciseData = data?.exercise_getExercises?.result?.items?.[0];

  return {
    exerciseData,
    exerciseLoading: isLoading,
  };
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { mutate: addMutation, isPending: addLoading } =
    useExercise_CreateFavoriteExerciseMutation();
  const { mutate: removeMutation, isPending: removeLoading } =
    useExercise_DeleteFavoriteExerciseMutation();

  const toggleFavorite = (exerciseId: number, isFavorite: boolean) => {
    const input = { id: exerciseId };

    if (isFavorite) {
      removeMutation(input, {
        onSuccess: (res) => {
          if (res.favoriteExercise_deleteFavoriteExercise?.status.code === 1) {
            queryClient.invalidateQueries({
              queryKey: ["exercise_getExercises"],
            });
            queryClient.invalidateQueries({
              queryKey: ["favoriteExercise_getFavoriteExercises"],
            });
          }
        },
      });
    } else {
      addMutation(input, {
        onSuccess: (res) => {
          if (res.favoriteExercise_createFavoriteExercise?.status.code === 1) {
            queryClient.invalidateQueries({
              queryKey: ["exercise_getExercises"],
            });
            queryClient.invalidateQueries({
              queryKey: ["favoriteExercise_getFavoriteExercises"],
            });
          }
        },
      });
    }
  };

  return { toggleFavorite, toggleFavoriteLoading: addLoading || removeLoading };
}

export function useGetFavoriteExercises({
  enabled,
  page = 1,
  categoryId,
  keyword = "",
  subCategoryId,
  sort = ExercisesSortType.DEFAULT,
}: useGetExercisesProps) {
  const { data, isLoading, isFetching } =
    useFavoriteExercise_GetFavoriteExercisesQuery(
      {
        take: 9,
        skip: page * 9,
        where: {
          exercise: {
            name: { contains: keyword },
            ...((categoryId || subCategoryId) && {
              subCategory: {
                ...(categoryId && {
                  category: { id: { eq: categoryId } },
                }),
                ...(subCategoryId && {
                  id: { eq: Number(subCategoryId) },
                }),
              },
            }),
          },
        },
        order: sort === "A-Z" ? [{ exercise: { name: SortEnumType.Asc } }] : [],
      },
      {
        enabled,
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData, // Use previous data as placeholder
      }
    );

  const totalPages: number = useMemo(() => {
    const totalCount = Number(
      data?.favoriteExercise_getFavoriteExercises?.result?.totalCount
    );

    return Math.ceil(totalCount / 9);
  }, [data]);

  return {
    favoriteExercisesLoading: isLoading,
    favoriteExercisesFetching: isFetching,
    favoriteExercisesTotalCount: totalPages,
    favoriteExercisesData:
      data?.favoriteExercise_getFavoriteExercises?.result?.items?.map(
        (item) => ({
          products: [],
          isFavorite: true,
          favoriteCount: 1,
          exercise: item?.exercise,
        })
      ) as Array<ExerciseDto>,
  };
}
