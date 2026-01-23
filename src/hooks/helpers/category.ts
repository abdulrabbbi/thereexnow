import { fetcher } from "@/graphql/fetcher";
import {
  Category_GetCategoriesDocument,
  Category_GetCategoriesQuery,
  Category_GetCategoriesQueryVariables,
  SortEnumType,
} from "@/graphql/generated";
import { TRANSLATE_SEPARATOR } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import useLocales from "../use-locales";
import { useTranslate } from "../use-translate";

export type MinimalSubCategory = {
  id: number;
  name: string;
};

export type MinimalCategory = {
  id: number;
  name: string;
  subCategories: Array<MinimalSubCategory>;
};

export function useGetAllCategories() {
  const { translate } = useTranslate();
  const { currentLang } = useLocales();

  const { data, isLoading } = useQuery({
    queryKey: ["category_getCategories", "translatedTo", currentLang.value],
    queryFn: async () => {
      const res = await fetcher<
        Category_GetCategoriesQuery,
        Category_GetCategoriesQueryVariables
      >(Category_GetCategoriesDocument, { take: 200, order:{order: SortEnumType.Asc} })();

      const categories = res.category_getCategories?.result?.items ?? [];

      // Translate each category and its subcategories individually
      const translatedData = await Promise.all(
        categories.map(async (item) => {
          const translatedName = await translate(item?.name || "");

          const translatedSub = item?.subCategories
            ? await Promise.all(
                item.subCategories.map(async (subItem) => ({
                  ...subItem,
                  name: await translate(subItem?.name || ""),
                }))
              )
            : undefined;

          return {
            ...item,
            name: translatedName,
            subCategories: translatedSub,
          };
        })
      );

      return translatedData;
    },
  });

  return {
    categoriesData: data,
    categoriesLoading: isLoading,
  };
}
