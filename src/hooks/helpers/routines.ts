import { fetcher } from "@/graphql/fetcher";
import {
  Routine_GetRoutinesDocument,
  Routine_GetRoutinesQuery,
  Routine_GetRoutinesQueryVariables,
  Routines,
} from "@/graphql/generated";
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useAuth } from "../use-auth";

type PageParam = number;

export const useGetRoutines = <TData = Array<Routines>, TError = unknown>(
  variables?: Routine_GetRoutinesQueryVariables,
  options?: UseInfiniteQueryOptions<Routine_GetRoutinesQuery, TError, TData>
) => {
  const { authenticated } = useAuth();

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
    queryKey:
      variables === undefined
        ? ["routine_getRoutines"]
        : ["routine_getRoutines", variables],
    getNextPageParam: (
      lastPage: Routine_GetRoutinesQuery,
      allPages: Routine_GetRoutinesQuery[]
    ) => {
      if (lastPage?.routine_getRoutines?.result?.pageInfo?.hasNextPage) {
        return allPages.length;
      }

      return undefined;
    },
    queryFn: ({ pageParam }) => {
      return fetcher<
        Routine_GetRoutinesQuery,
        Routine_GetRoutinesQueryVariables
      >(Routine_GetRoutinesDocument, {
        take: 15,
        skip: pageParam * 15,
        ...variables,
      })();
    },
    // @ts-ignore
    select: (data) => {
      if (!data?.pages?.[0]?.routine_getRoutines?.result) return [];

      return data.pages.flatMap(
        (page) => page.routine_getRoutines?.result?.items
      );
    },
  });
};
