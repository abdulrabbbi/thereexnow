"use client";

import { BodyShape } from "@/assets/illustrations/body-shape";
import { LoadingScreen } from "@/components/loading-screen";
import { Categories } from "@/graphql/generated";
import { useGetAllCategories } from "@/hooks/helpers/category";
import { useResponsive } from "@/hooks/use-responsive";
import { Container, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useMemo } from "react";
import { CategoriesNode } from "../categories-node";
import { CategoryButton } from "../category-button";
import { HomeSearch } from "../home-search";

const leftCategoriesMargin = [10,30, 45,66, 88 ]
const rightCategoriesMargin = [18,41, 53,85 ]

export default function HomeView() {
  const isDesktop = useResponsive("up", "md");

  const { categoriesData, categoriesLoading } = useGetAllCategories();

  const leftCategories = useMemo(() => {
    return categoriesData?.filter((el, index) => index % 2 === 0);
  }, [categoriesData]);

  const rightCategories = useMemo(() => {
    return categoriesData?.filter((el, index) => index % 2 !== 0);
  }, [categoriesData]);

  return (
    <Container sx={{ pb: 2, pt: 12 }}>
      {!categoriesLoading && <HomeSearch />}

      {categoriesLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : isDesktop ? (
        <Stack direction="row" sx={{ width: 1 }}>
          <Stack
            flex={1}
            zIndex={10}
            mr={"-50px"}
            alignItems="flex-start"
            justifyContent="start"
            position={'relative'}
          >
            {leftCategories?.map((item, index) => (
              <CategoriesNode
                key={index}
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
            ml={"-50px"}
            alignItems="flex-start"
            justifyContent="start"
            position={'relative'}
          >
            {rightCategories?.map((item, index) => (
              <CategoriesNode
                key={index}
                index={index}
                direction="RTL"
                category={item as Categories}
                top={rightCategoriesMargin[index]}
              />
            ))}
          </Stack>
        </Stack>
      ) : (
        <Grid container spacing={2} sx={{ pb: 15 }}>
          {categoriesData?.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
              <CategoryButton category={item as Categories} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
