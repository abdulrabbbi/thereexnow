import { fetcher } from "@/graphql/fetcher";
import {
  CustomizedExercise_GetCustomizedExerciseDocument,
  CustomizedExercise_GetCustomizedExerciseQuery,
  CustomizedExercise_GetCustomizedExerciseQueryVariables,
  Exercise_GetExercisesDocument,
  Exercise_GetExercisesQuery,
  Exercise_GetExercisesQueryVariables,
  Exercise_GetProductsDocument,
  Exercise_GetProductsQuery,
  Exercise_GetProductsQueryVariables,
  ExerciseDtoFilterInput,
  FavoriteExercise_GetFavoriteExercisesDocument,
  FavoriteExercise_GetFavoriteExercisesQuery,
  FavoriteExercise_GetFavoriteExercisesQueryVariables,
  Plan_GetPlansDocument,
  Plan_GetPlansQuery,
  Plan_GetPlansQueryVariables,
  Product_GetProductsDocument,
  Product_GetProductsQuery,
  Product_GetProductsQueryVariables,
  Product_GetSimilarProductsDocument,
  Product_GetSimilarProductsQuery,
  Product_GetSimilarProductsQueryVariables,
  Routine_GetRoutineDocument,
  Routine_GetRoutineQuery,
  Routine_GetRoutineQueryVariables,
  Routine_GetRoutinesDocument,
  Routine_GetRoutinesQuery,
  Routine_GetRoutinesQueryVariables,
  Routines,
  ShoppingCart_GetShoppingCartsDocument,
  ShoppingCart_GetShoppingCartsQuery,
  ShoppingCart_GetShoppingCartsQueryVariables,
  SortEnumType,
} from "@/graphql/generated";
import { ExercisesSortType } from "@/sections/exercises/exercises-sort-select";
import { exerciseNoteParser, getOtherMedia } from "@/utils";
import { SUBSCRIPTIONS, TRANSLATE_SEPARATOR } from "@/utils/constants";
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "../use-auth";
import useLocales from "../use-locales";
import { useTranslate } from "../use-translate";
import { useUser } from "../use-user";
import {
  Notification_GetNotificationsWithSetReadDocument,
  Notification_GetNotificationsWithSetReadQuery,
  Notification_GetNotificationsWithSetReadQueryVariables,
  NotificationType,
} from "./../../graphql/generated";

type PageParam = number;

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

export function useGetTranslatedExercises(props: useGetExercisesProps) {
  const {
    where,
    enabled,
    page = 0,
    categoryId,
    keyword = "",
    subCategoryId,
    sort = ExercisesSortType.DEFAULT,
    take,
  } = props;

  const whereKey = where ? JSON.stringify(where) : "";
  const resolvedTake = take || 9;

  const { data, isLoading, isFetching } = useQuery({
    enabled: enabled,
    placeholderData: (previousData) => previousData, // Use previous data as placeholder
    queryKey: [
      "exercise_getExercises",
      page,
      resolvedTake,
      keyword,
      sort,
      categoryId ?? null,
      subCategoryId ?? null,
      whereKey,
    ],
    queryFn: async () => {
      const res = await fetcher<
        Exercise_GetExercisesQuery,
        Exercise_GetExercisesQueryVariables
      >(Exercise_GetExercisesDocument, {
        take: resolvedTake,
        skip: page * 9,
        where: {
          ...where,
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
            ...where?.exercise,
          },
        },
        order:
          sort === "POPULAR"
            ? [{ favoriteCount: SortEnumType.Desc }]
            : sort === "A-Z"
              ? [{ exercise: { name: SortEnumType.Asc } }]
              : [],
      })();

      const exercises = res.exercise_getExercises?.result?.items ?? [];

      return {
        exercise_getExercises: {
          result: {
            ...res.exercise_getExercises?.result,
            items: exercises,
          },
        },
      }; // Return the fully translated data
    },
  });

  const totalPages: number = useMemo(() => {
    const totalCount = Number(data?.exercise_getExercises?.result?.totalCount);

    return Math.ceil(totalCount / 9);
  }, [data]);

  return {
    exercisesFetching: isFetching,
    exercisesTotalCount: totalPages,
    exercisesLoading: isLoading,
    exercisesData: data?.exercise_getExercises?.result?.items,
  };
}

export function useGetTranslatedFavoriteExercises(props: useGetExercisesProps) {
  const {
    enabled,
    page = 0,
    categoryId,
    keyword = "",
    subCategoryId,
    sort = ExercisesSortType.DEFAULT,
  } = props;

  const { data, isLoading, isFetching } = useQuery({
    enabled: enabled,
    placeholderData: (previousData) => previousData, // Use previous data as placeholder
    queryKey: [
      "favoriteExercise_getFavoriteExercises",
      page,
      keyword,
      sort,
      categoryId ?? null,
      subCategoryId ?? null,
    ],
    queryFn: async () => {
      const res = await fetcher<
        FavoriteExercise_GetFavoriteExercisesQuery,
        FavoriteExercise_GetFavoriteExercisesQueryVariables
      >(FavoriteExercise_GetFavoriteExercisesDocument, {
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
      })();

      const exercises =
        res.favoriteExercise_getFavoriteExercises?.result?.items ?? [];

      return {
        favoriteExercise_getFavoriteExercises: {
          result: {
            ...res.favoriteExercise_getFavoriteExercises?.result,
            items: exercises,
          },
        },
      }; // Return the fully translated data
    },
  });

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
      data?.favoriteExercise_getFavoriteExercises?.result?.items,
  };
}

export function useGetTranslatedExercise(exerciseId: number) {
  const { translate } = useTranslate();
  const { currentLang } = useLocales();

  const { data, isLoading } = useQuery({
    enabled: !!exerciseId,
    queryKey: [
      "exercise_getExercises",
      "translatedTo",
      currentLang.value,
      exerciseId,
    ],
    queryFn: async () => {
      const res = await fetcher<
        Exercise_GetExercisesQuery,
        Exercise_GetExercisesQueryVariables
      >(Exercise_GetExercisesDocument, {
        where: { exercise: { id: { eq: exerciseId } } },
      })();

      const exercises = res.exercise_getExercises?.result?.items ?? [];

      // Concatenate all exercise names with a separator
      const exerciseNames = exercises
        .map((item) => item?.exercise?.name)
        .join(TRANSLATE_SEPARATOR);

      // Concatenate all product names with a separator
      const productNames = exercises
        .flatMap((item) => item?.products?.map((product) => product?.name))
        .join(TRANSLATE_SEPARATOR);

      // Concatenate all exercise content notes and workout moves with a separator
      const exerciseNotes = exercises
        .map((item) => exerciseNoteParser(item?.exercise?.note as string).note)
        .join(TRANSLATE_SEPARATOR);

      const exerciseWorkoutMoves = exercises
        .flatMap(
          (item) =>
            exerciseNoteParser(item?.exercise?.note as string).workoutMove
        )
        .join(TRANSLATE_SEPARATOR);

      // Concatenate all subCategory names and category names with a separator
      const subCategoryNames = exercises
        .map((item) => item?.exercise?.subCategory?.name)
        .join(TRANSLATE_SEPARATOR);
      const categoryNames = exercises
        .map((item) => item?.exercise?.subCategory?.category?.name)
        .join(TRANSLATE_SEPARATOR);

      // Translate the concatenated exercise and product names
      const [
        translatedExerciseNamesArray,
        translatedProductNamesArray,
        translatedExerciseNotesArray,
        translatedExerciseWorkoutMovesArray,
        translatedSubCategoryNamesArray,
        translatedCategoryNamesArray,
      ] = await Promise.all([
        translate(exerciseNames),
        translate(productNames),
        translate(exerciseNotes),
        translate(exerciseWorkoutMoves),
        translate(subCategoryNames),
        translate(categoryNames),
      ]);

      // Reconstruct the translated data
      let productNameIndex = 0; // Track the current index in the translatedProductNamesArray
      let workoutMoveIndex = 0; // Track the current index in the translatedExerciseWorkoutMovesArray

      const translatedData = exercises?.map((item, index) => {
        // Get the translated exercise name
        const translatedExerciseName = translatedExerciseNamesArray?.[index];

        // Get the translated exercise content
        const parsedContent = exerciseNoteParser(
          item?.exercise?.note as string
        );
        const translatedContent = {
          note: translatedExerciseNotesArray?.[index],
          workoutMove: parsedContent.workoutMove.map(() => {
            const translatedMove =
              translatedExerciseWorkoutMovesArray?.[workoutMoveIndex];
            workoutMoveIndex++; // Move to the next workout move
            return translatedMove;
          }),
        };

        // Get the translated product names for this item
        const translatedProducts = item?.products?.map((product) => {
          const translatedProductName =
            translatedProductNamesArray?.[productNameIndex];
          productNameIndex++; // Move to the next product name
          return {
            ...product,
            name: translatedProductName,
          };
        });

        // Get the translated subCategory and category names
        const translatedSubCategory = {
          ...item?.exercise?.subCategory,
          name: translatedSubCategoryNamesArray?.[index],
          category: {
            ...item?.exercise?.subCategory?.category,
            name: translatedCategoryNamesArray?.[index],
          },
        };

        // Return the translated item
        return {
          ...item,
          products: translatedProducts,
          exercise: {
            ...item?.exercise,
            name: translatedExerciseName,
            subCategory: translatedSubCategory,
            note: translatedContent.note,
            workoutMove: translatedContent.workoutMove,
            otherMedia: getOtherMedia(item?.exercise?.otherMediaUrl),
          },
        };
      });

      return {
        exercise_getExercises: {
          result: {
            ...res.exercise_getExercises?.result,
            items: translatedData,
          },
        },
      }; // Return the fully translated data
    },
  });

  return {
    exerciseLoading: isLoading,
    exerciseData: data?.exercise_getExercises?.result?.items?.[0],
  };
}

export function useGetTranslatedRoutines<
  TData = Array<Routines>,
  TError = unknown,
>(
  variables?: Routine_GetRoutinesQueryVariables,
  options?: UseInfiniteQueryOptions<Routine_GetRoutinesQuery, TError, TData>
) {
  const { authenticated } = useAuth();

  // @ts-ignore
  return useInfiniteQuery<
    Routine_GetRoutinesQuery,
    TError,
    TData,
    any,
    PageParam
  >({
    ...options,
    initialPageParam: 0,
    enabled: authenticated,
    queryKey: ["routine_getRoutines", variables],
    getNextPageParam: (
      lastPage: Routine_GetRoutinesQuery,
      allPages: Routine_GetRoutinesQuery[]
    ) => {
      if (lastPage?.routine_getRoutines?.result?.pageInfo?.hasNextPage) {
        return allPages.length;
      }

      return undefined;
    },
    queryFn: async ({ pageParam }) => {
      const res = await fetcher<
        Routine_GetRoutinesQuery,
        Routine_GetRoutinesQueryVariables
      >(Routine_GetRoutinesDocument, {
        take: 999,
        skip: pageParam * 999,
        ...variables,
      })();

      const routines = res.routine_getRoutines?.result?.items ?? [];

      return {
        routine_getRoutines: {
          result: {
            ...res.routine_getRoutines?.result,
            items: routines,
          },
        },
      }; // Return the fully translated data
    },

    // @ts-ignore
    select: (data) => {
      if (!data?.pages?.[0]?.routine_getRoutines?.result) return [];

      return data.pages.flatMap(
        (page) => page.routine_getRoutines?.result?.items
      );
    },
  });
}

export function useGetTranslatedRoutine(routineId: number) {
  const { authenticated } = useAuth();

  const { data, isLoading } = useQuery({
    enabled: authenticated && !!routineId,
    queryKey: ["routine_getRoutine", routineId],
    queryFn: async () => {
      const res = await fetcher<
        Routine_GetRoutineQuery,
        Routine_GetRoutineQueryVariables
      >(Routine_GetRoutineDocument, {
        entityId: routineId,
      })();

      const routine = res.routine_getRoutine?.result;

      const exerciseNotes = routine?.routineExercises
        ?.map((item) => exerciseNoteParser(item?.note as string).note)
        .join(TRANSLATE_SEPARATOR);

      const exerciseWorkoutMoves = routine?.routineExercises?.flatMap(
        (item) => exerciseNoteParser(item?.note as string).workoutMove
      );

      let workoutMoveIndex = 0; // Track the current index in the exerciseWorkoutMoves
      // Reconstruct the translated data
      const translatedRoutineExercises = routine?.routineExercises?.map(
        (item, index) => {
          // Get the translated exercise content
          const parsedContent = exerciseNoteParser(item?.note as string);

          return {
            ...item,
            name: item?.exercise?.name,
            photoUrl: item?.exercise?.photoUrl,
            note: exerciseNotes?.[index],
            otherMedia: getOtherMedia(item?.exercise?.otherMediaUrl),
            workoutMove: parsedContent.workoutMove.map(() => {
              const translatedMove = exerciseWorkoutMoves?.[workoutMoveIndex];
              workoutMoveIndex++; // Move to the next workout move
              return translatedMove;
            }),
            exercise: {
              ...item?.exercise,
            },
          };
        }
      );

      // Return the translated routine
      return {
        ...routine,
        name: routine?.name,
        description: routine?.description,
        routineExercises: translatedRoutineExercises,
      };
    },
  });

  return {
    routineData: data,
    routineLoading: isLoading,
  };
}

type useGetProductsProps = {
  page?: number;
  keyword?: string;
  enabled?: boolean;
  categoryId?: number;
  subCategoryId?: number;
};

export function useGetTranslatedProducts(variables: useGetProductsProps) {
  const { page = 1, keyword = "", categoryId, subCategoryId } = variables;

  const { translate } = useTranslate();
  const { currentLang } = useLocales();

  const { data, isLoading, isFetching } = useQuery({
    placeholderData: (previousData) => previousData, // Use previous data as placeholder
    queryKey: [
      "product_getProducts",
      "translatedTo",
      currentLang.value,
      variables,
    ],
    queryFn: async () => {
      const res = await fetcher<
        Product_GetProductsQuery,
        Product_GetProductsQueryVariables
      >(Product_GetProductsDocument, {
        take: 9,
        skip: page * 9,
        where: {
          isActive: { eq: true },
          ...(keyword.length && { name: { contains: keyword } }),

          ...((categoryId || subCategoryId) && {
            exerciseProducts: {
              some: {
                exercise: {
                  subCategory: {
                    ...(categoryId && {
                      category: {
                        id: { eq: categoryId },
                      },
                    }),
                    ...(subCategoryId && {
                      id: { eq: subCategoryId },
                    }),
                  },
                },
              },
            },
          }),
        },
      })();

      const products = res.product_getProducts?.result?.items ?? [];

      // Concatenate all products names with a separator
      const productsNames = products
        .map((item) => item?.name)
        .join(TRANSLATE_SEPARATOR);

      // Translate the concatenated exercise and product names
      const [translatedProductsNamesArray] = await Promise.all([
        translate(productsNames),
      ]);

      const translatedData = products?.map((item, index) => {
        // Get the translated exercise name
        const translatedProductsName = translatedProductsNamesArray?.[index];

        // Return the translated item
        return {
          ...item,
          name: translatedProductsName,
        };
      });

      return {
        product_getProducts: {
          result: {
            ...res.product_getProducts?.result,
            items: translatedData,
          },
        },
      }; // Return the fully translated data
    },
  });

  const totalPages: number = useMemo(() => {
    const totalCount = Number(data?.product_getProducts?.result?.totalCount);

    return Math.ceil(totalCount / 9);
  }, [data]);

  return {
    productsLoading: isLoading,
    productsFetching: isFetching,
    productsTotalCount: totalPages,
    productsData: data?.product_getProducts?.result?.items,
  };
}

export function useGetTranslatedProduct(productId: number) {
  const { translate } = useTranslate();
  const { currentLang } = useLocales();

  const { data, isLoading } = useQuery({
    queryKey: [
      "product_getProduct",
      "translatedTo",
      currentLang.value,
      productId,
    ],
    queryFn: async () => {
      const res = await fetcher<
        Product_GetProductsQuery,
        Product_GetProductsQueryVariables
      >(Product_GetProductsDocument, {
        where: {
          id: { eq: productId },
        },
      })();

      const product = res.product_getProducts?.result?.items?.[0];

      // Concatenate product name and description with a separator
      const rootFields = [product?.name, product?.description].join(
        TRANSLATE_SEPARATOR
      );

      // Concatenate all exercise names fields with a separator
      const productsExerciseNames = product?.exerciseProducts
        ?.map((item) => item?.exercise?.name)
        .join(TRANSLATE_SEPARATOR);

      // Translate the concatenated fields
      const [translatedRootFields, translatedProductsExerciseNamesArray] =
        await Promise.all([
          translate(rootFields),
          translate(productsExerciseNames!),
        ]);

      // Split the translated fields back into individual values
      const [translatedName, translatedDescription] =
        translatedRootFields as Array<string>;

      // Reconstruct the translated data
      const translatedProductExercises = product?.exerciseProducts?.map(
        (item, index) => ({
          ...item,
          exercise: {
            ...item?.exercise,
            name: translatedProductsExerciseNamesArray?.[index], // Assign translated name
          },
        })
      );

      return {
        ...product,
        name: translatedName,
        description: translatedDescription,
        exerciseProducts: translatedProductExercises,
      };
    },
  });

  return {
    productData: data,
    productLoading: isLoading,
  };
}

export function useGetTranslatedSimilarProducts(productId: number) {
  const { translate } = useTranslate();
  const { currentLang } = useLocales();

  const { data, isLoading } = useQuery({
    queryKey: [
      "product_getSimilarProducts",
      "translatedTo",
      currentLang.value,
      productId,
    ],
    queryFn: async () => {
      const res = await fetcher<
        Product_GetSimilarProductsQuery,
        Product_GetSimilarProductsQueryVariables
      >(Product_GetSimilarProductsDocument, {
        productId,
        where: {
          isActive: { eq: true },
          isDeleted: { eq: false },
        },
      })();

      const products = res.product_getSimilarProducts?.result?.items ?? [];

      // Concatenate all products names with a separator
      const productsNames = products
        .map((item) => item?.name)
        .join(TRANSLATE_SEPARATOR);

      // Translate the concatenated exercise and product names
      const [translatedProductsNamesArray] = await Promise.all([
        translate(productsNames),
      ]);

      const translatedData = products?.map((item, index) => {
        // Get the translated exercise name
        const translatedProductsName = translatedProductsNamesArray?.[index];

        // Return the translated item
        return {
          ...item,
          name: translatedProductsName,
        };
      });

      return {
        product_getSimilarProducts: {
          result: {
            ...res.product_getSimilarProducts?.result,
            items: translatedData,
          },
        },
      }; // Return the fully translated data
    },
  });

  return {
    similarProductsLoading: isLoading,
    similarProductsData: data?.product_getSimilarProducts.result.items,
  };
}

export function useGetTranslatedShoppingCart(
  variables?: ShoppingCart_GetShoppingCartsQueryVariables
) {
  const { userData } = useUser();
  const { authenticated } = useAuth();
  const { translate } = useTranslate();
  const { currentLang } = useLocales();

  const { data, isLoading } = useQuery({
    enabled: !!authenticated && !!userData?.id,
    queryKey: [
      "shoppingCart_getShoppingCarts",
      "translatedTo",
      currentLang.value,
      variables,
    ],
    queryFn: async () => {
      const res = await fetcher<
        ShoppingCart_GetShoppingCartsQuery,
        ShoppingCart_GetShoppingCartsQueryVariables
      >(ShoppingCart_GetShoppingCartsDocument, variables)();

      const products = res.shoppingCart_getShoppingCarts?.result?.items ?? [];

      // Concatenate all products names with a separator
      const productsNames = products
        .map((item) => item?.product?.name)
        .join(TRANSLATE_SEPARATOR);

      // Translate the concatenated exercise and product names
      const [translatedProductsNamesArray] = await Promise.all([
        translate(productsNames),
      ]);

      const translatedData = products?.map((item, index) => {
        // Get the translated exercise name
        const translatedProductsName = translatedProductsNamesArray?.[index];

        // Return the translated item
        return {
          ...item,
          product: {
            ...item?.product,
            name: translatedProductsName,
          },
        };
      });

      return {
        shoppingCart_getShoppingCarts: {
          result: {
            ...res.shoppingCart_getShoppingCarts?.result,
            items: translatedData,
          },
        },
      };
    },
  });

  return { data, isLoading };
}

export function useGetTranslatedCustomizedExercise(exerciseId: number) {
  const { translate } = useTranslate();
  const { currentLang } = useLocales();

  const { data, isLoading } = useQuery({
    enabled: !!exerciseId,
    queryKey: [
      "customizedExercise_getCustomizedExercise",
      "translatedTo",
      currentLang.value,
      exerciseId,
    ],
    queryFn: async () => {
      const res = await fetcher<
        CustomizedExercise_GetCustomizedExerciseQuery,
        CustomizedExercise_GetCustomizedExerciseQueryVariables
      >(CustomizedExercise_GetCustomizedExerciseDocument, {
        exerciseId,
      })();

      const exercise = res.customizedExercise_getCustomizedExercise?.result;

      const exerciseNote = exerciseNoteParser(exercise?.note as string).note;

      const exerciseWorkoutMove = exerciseNoteParser(
        exercise?.note as string
      ).workoutMove.join(TRANSLATE_SEPARATOR);

      // Translate the concatenated exercise and product names
      const [translatedExerciseNote, translatedExerciseWorkoutMovesArray] =
        await Promise.all([
          translate(exerciseNote, { convert: false }),
          translate(exerciseWorkoutMove),
        ]);

      return {
        customizedExercise_getCustomizedExercise: {
          result: {
            ...exercise,
            note: translatedExerciseNote,
            workoutMove: translatedExerciseWorkoutMovesArray,
          },
        },
      }; // Return the fully translated data
    },
  });

  return {
    customizedExerciseLoading: isLoading,
    customizedExerciseData:
      data?.customizedExercise_getCustomizedExercise?.result,
  };
}

export function useGetTranslatedNotifications(
  variables?: Notification_GetNotificationsWithSetReadQueryVariables
) {
  const { translate } = useTranslate();
  const { currentLang } = useLocales();

  function formatText(input: string): string {
    // Split at uppercase letters or numbers
    const words = input.split(/(?=[A-Z0-9])/);

    // Join the words with spaces and convert to lowercase (except the first word)
    const formattedText = words
      .map((word, index) => (index === 0 ? word : word.toLowerCase()))
      .join(" ");

    return formattedText;
  }

  function getNotificationText(key: NotificationType) {
    switch (key) {
      case "RequestCreated":
        return "Your order has been created and will send it to you as soon as possible";
      case "MaxTryFreePlanForRoutine":
        return "To add more routines, you need to upgrade your plan";
      case "RequestAccepted":
        return "Your order has been accepted and will send it to you as soon as possible";
      case "RequestRejected":
        return "Your order has been rejected.";
      case "FreePlanPurchased":
        return "Your current plan is free. You can upgrade it to pro.";
      case "PlanUpgraded":
        return "Your current plan is pro.";
      case "MaxTryFreePlanForEmail":
        return "To share more exercises by email, you need to upgrade your plan";
      case "MaxTryFreePlanForSms":
        return "To share more exercises by sms, you need to upgrade your plan";
      case "ExerciseDeleted":
        return "The test exercise has been deleted by the admin";
      case "RequestAccepted":
        return "Your order has been accepted by the admin";
      case "RequestRejected":
        return "Your order has been rejected by the admin";
      default:
        return "";
    }
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "notification_getNotificationsWithSetRead",
      "translatedTo",
      currentLang.value,
      variables,
    ],
    queryFn: async () => {
      const res = await fetcher<
        Notification_GetNotificationsWithSetReadQuery,
        Notification_GetNotificationsWithSetReadQueryVariables
      >(Notification_GetNotificationsWithSetReadDocument, variables)();

      const notifications =
        res.notification_getNotificationsWithSetRead?.result?.items ?? [];

      // Translate each notification individually
      const translatedData = await Promise.all(
        notifications.map(async (item) => {
          const title = await translate(
            formatText(item?.notificationType || "")
          );
          const description = await translate(
            getNotificationText(item?.notificationType as NotificationType)
          );

          return {
            ...item,
            title,
            description,
          };
        })
      );

      return {
        notification_getNotificationsWithSetRead: {
          result: {
            ...res.notification_getNotificationsWithSetRead?.result,
            items: translatedData,
          },
        },
      };
    },
  });

  return { data, isLoading, refetch };
}

export function useGetTranslatedPlans() {
  const { translate } = useTranslate();
  const { currentLang } = useLocales();

  const { data, isLoading } = useQuery({
    queryKey: ["plan_getPlans", "translatedTo", currentLang.value],
    queryFn: async () => {
      const res = await fetcher<
        Plan_GetPlansQuery,
        Plan_GetPlansQueryVariables
      >(Plan_GetPlansDocument)();

      const plans = res.plan_getPlans?.result?.items ?? [];

      // Translate each notification individually
      const translatedData = await Promise.all(
        plans.map(async (item, index) => {
          const title = await translate(
            SUBSCRIPTIONS[index].title || item?.title || ""
          );

          const description = await translate(item?.description || "");

          const features = SUBSCRIPTIONS[index].features.map(
            async (el) => await translate(el, { convert: false })
          );

          return {
            ...item,
            title,
            features,
            description,
          };
        })
      );

      return {
        plan_getPlans: {
          result: {
            ...res.plan_getPlans?.result,
            items: translatedData,
          },
        },
      };
    },
  });

  return {
    data,
    isLoading,
  };
}

export function useGetTranslatedExerciseProducts(exerciseId: number) {
  const { translate } = useTranslate();
  const { currentLang } = useLocales();

  const { data, isLoading, isFetching } = useQuery({
    placeholderData: (previousData) => previousData, // Use previous data as placeholder
    queryKey: [
      "exercise_getProducts",
      "translatedTo",
      currentLang.value,
      exerciseId,
    ],
    queryFn: async () => {
      const res = await fetcher<
        Exercise_GetProductsQuery,
        Exercise_GetProductsQueryVariables
      >(Exercise_GetProductsDocument, {
        take: 99,
        exerciseId: Number(exerciseId),
        where: {
          isActive: { eq: true },
          isDeleted: { eq: false },
        },
      })();

      const products = res.exercise_getProducts?.result?.items ?? [];

      // Concatenate all products names with a separator
      const productsNames = products
        .map((item) => item?.name)
        .join(TRANSLATE_SEPARATOR);

      // Translate the concatenated exercise and product names
      const [translatedProductsNamesArray] = await Promise.all([
        translate(productsNames),
      ]);

      const translatedData = products?.map((item, index) => {
        // Get the translated exercise name
        const translatedProductsName = translatedProductsNamesArray?.[index];

        // Return the translated item
        return {
          ...item,
          name: translatedProductsName,
        };
      });

      return {
        exercise_getProducts: {
          result: {
            ...res.exercise_getProducts?.result,
            items: translatedData,
          },
        },
      }; // Return the fully translated data
    },
  });

  const totalPages: number = useMemo(() => {
    const totalCount = Number(data?.exercise_getProducts?.result?.totalCount);

    return Math.ceil(totalCount / 9);
  }, [data]);

  return {
    exerciseProductsLoading: isLoading,
    exerciseProductsFetching: isFetching,
    exerciseProductsTotalCount: totalPages,
    exerciseProductsData: data?.exercise_getProducts?.result?.items,
  };
}
