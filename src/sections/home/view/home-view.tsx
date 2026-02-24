"use client";

import { BodyShape } from "@/assets/illustrations/body-shape";
import { LoadingScreen } from "@/components/loading-screen";
import { Categories } from "@/graphql/generated";
import { useGetAllCategories } from "@/hooks/helpers/category";
import { useResponsive } from "@/hooks/use-responsive";
import { HEADER } from "@/layouts/config-layout";
import { useRouter } from "@/routes/hooks";
import { getCategoriesRoute } from "@/routes/paths";
import { Container, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCallback, useMemo, useState } from "react";
import { CategoriesNode } from "../categories-node";
import { MobileCategoryButton } from "../category-button";

const leftCategoriesMargin = [10, 30, 45, 66, 88];
const rightCategoriesMargin = [18, 41, 53, 85];

export default function HomeView() {
  const router = useRouter();
  const mdUp = useResponsive("up", "md");

  const { categoriesData, categoriesLoading } = useGetAllCategories();

  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null,
  );

  const leftCategories = useMemo(() => {
    return categoriesData?.filter((_, index) => index % 2 === 0);
  }, [categoriesData]);

  const rightCategories = useMemo(() => {
    return categoriesData?.filter((_, index) => index % 2 !== 0);
  }, [categoriesData]);

  const handleNavigateCategory = useCallback(
    (categoryId: number) => {
      router.push(getCategoriesRoute({ categoryId }));
      setExpandedCategoryId(null);
    },
    [router],
  );

  const handleNavigateSubCategory = useCallback(
    (categoryId: number, subCategoryId: number) => {
      router.push(getCategoriesRoute({ categoryId, subCategoryId }));
      setExpandedCategoryId(null);
    },
    [router],
  );

  const handleToggleExpanded = useCallback((categoryId: number) => {
    setExpandedCategoryId((currentExpandedCategoryId) =>
      currentExpandedCategoryId === categoryId ? null : categoryId,
    );
  }, []);

  return (
    <Container
      sx={{
        pt: {
          xs: `${HEADER.H_MOBILE + 12}px`,
          md: `${HEADER.H_DESKTOP + 12}px`,
        },
        pb: { xs: 10, md: 4 },
        minWidth: 0,
      }}
    >
      {categoriesLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : mdUp ? (
        <Stack direction="row" sx={{ width: 1 }}>
          <Stack
            flex={1}
            zIndex={10}
            mr="-50px"
            alignItems="flex-start"
            justifyContent="start"
            position="relative"
          >
            {leftCategories?.map((item, index) => (
              <CategoriesNode
                key={item.id}
                index={index}
                direction="LTR"
                category={item as Categories}
                top={leftCategoriesMargin[index]}
              />
            ))}
          </Stack>

          <BodyShape sx={{ mx: "auto", maxWidth: "450px" }} />

          <Stack
            flex={1}
            zIndex={10}
            ml="-50px"
            alignItems="flex-start"
            justifyContent="start"
            position="relative"
          >
            {rightCategories?.map((item, index) => (
              <CategoriesNode
                key={item.id}
                index={index}
                direction="RTL"
                category={item as Categories}
                top={rightCategoriesMargin[index]}
              />
            ))}
          </Stack>
        </Stack>
      ) : (
        <Grid
          container
          spacing={1.25}
          sx={{ pb: { xs: 8, sm: 10 }, minWidth: 0, overflowX: "clip" }}
        >
          {categoriesData?.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6 }} sx={{ minWidth: 0 }}>
              <MobileCategoryButton
                category={item as Categories}
                isExpanded={expandedCategoryId === item.id}
                onToggleExpand={handleToggleExpanded}
                onClickCategory={handleNavigateCategory}
                onClickSubCategory={handleNavigateSubCategory}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
