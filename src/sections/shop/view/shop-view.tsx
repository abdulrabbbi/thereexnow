"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { Categories, Products } from "@/graphql/generated";
import { useGetAllCategories } from "@/hooks/helpers/category";
import { useGetTranslatedProducts } from "@/hooks/helpers/translated-hooks";
import useLocales from "@/hooks/use-locales";
import { usePagination } from "@/hooks/use-pagination";
import { HEADER } from "@/layouts/config-layout";
import { SearchBar } from "@/sections/common/search-bar";
import { ExercisesNav } from "@/sections/exercises/exercises-nav";
import * as HomeConfig from "@/sections/exercises/home-config";
import { hideScrollY } from "@/theme/styles";
import { Box, BoxProps, Container, Pagination, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { EmptyShopList } from "../empty-shop-list";
import { ProductCard } from "../product-card";
import { ShopCheckout } from "../shop-checkout";
import { ShopMainSection } from "../shop-main-section";

export default function ShopView() {
  const { t } = useLocales();
  const pagination = usePagination();
  const [keyword, setKeyword] = useState("");

  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId");
  const subCategoryId = searchParams.get("subCategoryId");

  const { categoriesData, categoriesLoading } = useGetAllCategories();

  const variables = {
    keyword,
    page: pagination.page - 1,
    categoryId: Number(categoryId),
    subCategoryId: Number(subCategoryId),
  };

  const {
    productsData,
    productsLoading,
    productsFetching,
    productsTotalCount,
  } = useGetTranslatedProducts(variables);

  return (
    <Container maxWidth="xl">
      {categoriesLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : (
        <>
          <Box
            sx={{
              mt: 12,
              display: "flex",
              height: `calc(100vh - ${HEADER.H_DESKTOP + 16}px)`,
              maxHeight: `calc(100vh - ${HEADER.H_DESKTOP + 16}px)`,
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
                source="shop"
                data={categoriesData as Array<Categories>}
              />
            </Box>

            <Stack alignItems="stretch" spacing={0} flex={1}>
              <SearchBar
                value={keyword}
                onChange={setKeyword}
                label={t("SEARCH_PRODUCT")}
                isLoading={!!keyword && productsFetching}
              />

              <ShopMainSection>
                {productsLoading || productsFetching ? (
                  <LoadingScreen sx={{ height: "60svh" }} />
                ) : productsData?.length ? (
                  <GridLayout>
                    {productsData?.map((item) => (
                      <ProductCard key={item?.id} data={item as Products} />
                    ))}
                  </GridLayout>
                ) : (
                  <EmptyShopList />
                )}

                <Pagination
                  shape="rounded"
                  variant="outlined"
                  page={pagination.page}
                  count={productsTotalCount}
                  onChange={pagination.onChangePage}
                  sx={{ my: 4, alignSelf: "center" }}
                />
              </ShopMainSection>
            </Stack>

            <ShopCheckout />
          </Box>
        </>
      )}
    </Container>
  );
}

function GridLayout({ children }: BoxProps) {
  return (
    <Box
      pt={2}
      rowGap={3}
      display="grid"
      columnGap={2.5}
      gridTemplateColumns={{
        xs: "repeat(2, 1fr)",
        sm: "repeat(3, 1fr)",
      }}
    >
      {children}
    </Box>
  );
}
