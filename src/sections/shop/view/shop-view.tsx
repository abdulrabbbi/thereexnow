"use client";

import { Iconify } from "@/components/iconify";
import { LoadingScreen } from "@/components/loading-screen";
import { Categories, Products } from "@/graphql/generated";
import { useGetAllCategories } from "@/hooks/helpers/category";
import { useShop } from "@/hooks/helpers/shop";
import { useGetTranslatedProducts } from "@/hooks/helpers/translated-hooks";
import useLocales from "@/hooks/use-locales";
import { usePagination } from "@/hooks/use-pagination";
import { HEADER } from "@/layouts/config-layout";
import { SearchBar } from "@/sections/common/search-bar";
import { ExercisesNav } from "@/sections/exercises/exercises-nav";
import { hideScrollY } from "@/theme/styles";
import { fCurrency } from "@/utils/format-number";
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Pagination,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EmptyShopList } from "../empty-shop-list";
import { ProductCard } from "../product-card";
import { ShopCheckout } from "../shop-checkout";
import { ShopMainSection } from "../shop-main-section";

export default function ShopView() {
  const { t } = useLocales();
  const pagination = usePagination();
  const [keyword, setKeyword] = useState("");
  const [categoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const searchParams = useSearchParams();

  const categoryId = searchParams?.get("categoryId") ?? undefined;
  const subCategoryId = searchParams?.get("subCategoryId") ?? undefined;

  const { categoriesData, categoriesLoading } = useGetAllCategories();
  const { shoppingCartData, cartPrices } = useShop();

  const variables = {
    keyword,
    page: pagination.page - 1,
    categoryId: categoryId ? Number(categoryId) : undefined,
    subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
  };

  const {
    productsData,
    productsLoading,
    productsFetching,
    productsTotalCount,
  } = useGetTranslatedProducts(variables);

  const cartCount = useMemo(() => {
    return (
      shoppingCartData?.reduce(
        (total, item) => total + (item?.count ?? 0),
        0
      ) ?? 0
    );
  }, [shoppingCartData]);

  useEffect(() => {
    if (mdUp) {
      setCategoriesDrawerOpen(false);
      setCartDrawerOpen(false);
    }
  }, [mdUp]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 2, sm: 3 },
        pt: {
          xs: `${HEADER.H_MOBILE + 12}px`,
          md: `${HEADER.H_DESKTOP + 12}px`,
        },
        pb: { xs: 12, md: 6 },
      }}
    >
      {categoriesLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : (
        <>
          <Grid container spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
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

            <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
              <SearchBar
                value={keyword}
                onChange={setKeyword}
                label={t("SEARCH_PRODUCT")}
                isLoading={!!keyword && productsFetching}
                slotProps={{
                  root: {
                    px: 0,
                    direction: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" },
                    sx: { minWidth: 0 },
                  },
                  button: { sx: { width: { xs: 1, sm: 130 } } },
                }}
              />
            </Grid>
          </Grid>

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
                source="shop"
                data={categoriesData as Array<Categories>}
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
                position: "sticky",
                top: HEADER.H_DESKTOP + 16,
                maxHeight: `calc(100vh - ${HEADER.H_DESKTOP + 16}px - 24px)`,
                ...hideScrollY,
              }}
            >
              <ExercisesNav
                source="shop"
                data={categoriesData as Array<Categories>}
              />
            </Box>

            <Grid container spacing={3} sx={{ flex: 1, minWidth: 0 }}>
              <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
                <ShopMainSection>
                  {productsLoading || productsFetching ? (
                    <LoadingScreen sx={{ height: "60svh" }} />
                  ) : productsData?.length ? (
                    <Grid container spacing={2.5} sx={{ minWidth: 0 }}>
                      {productsData?.map((item) => (
                        <Grid
                          key={item?.id}
                          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                          sx={{ minWidth: 0 }}
                        >
                          <ProductCard data={item as Products} />
                        </Grid>
                      ))}
                    </Grid>
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
              </Grid>

              <Grid
                size={{ xs: 12, md: 4 }}
                sx={{ minWidth: 0, display: { xs: "none", md: "block" } }}
              >
                <Box
                  sx={{
                    position: "sticky",
                    top: HEADER.H_DESKTOP + 16,
                    height: `calc(100vh - ${HEADER.H_DESKTOP + 16}px - 24px)`,
                    minWidth: 0,
                  }}
                >
                  <ShopCheckout />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Drawer
            anchor="bottom"
            open={cartDrawerOpen}
            onClose={() => setCartDrawerOpen(false)}
            PaperProps={{
              sx: {
                height: { xs: "80vh", sm: "75vh" },
                display: "flex",
                flexDirection: "column",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
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
              <Typography variant="h6">{t("CART")}</Typography>
              <IconButton
                onClick={() => setCartDrawerOpen(false)}
                aria-label="Close cart"
              >
                <Iconify icon="eva:close-fill" />
              </IconButton>
            </Box>

            <Divider />

            <Box
              sx={{
                p: 2,
                flex: 1,
                minHeight: 0,
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <ShopCheckout />
            </Box>
          </Drawer>

          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: (theme) => theme.zIndex.appBar,
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              py: 1.5,
            }}
          >
            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setCartDrawerOpen(true)}
                startIcon={<Iconify icon="solar:cart-large-2-bold-duotone" />}
              >
                {t("CART")} {cartCount ? `(${cartCount})` : ""} -{" "}
                {fCurrency(cartPrices.total)}
              </Button>
            </Container>
          </Box>
        </>
      )}
    </Container>
  );
}
