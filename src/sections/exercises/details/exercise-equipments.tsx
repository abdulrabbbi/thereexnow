"use client";

import { Products } from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { ProductCard } from "@/sections/shop/product-card";
import { Box, Typography } from "@mui/material";

type Props = {
  data: Array<Products>;
};

export function ExerciseEquipments({ data }: Props) {
  const { t } = useLocales();
  return (
    <Box mt={8}>
      <Typography variant="h4">{t("EQUIPMENT")}:</Typography>

      <Box
        pt={2}
        rowGap={3}
        display="grid"
        columnGap={2.5}
        gridTemplateColumns={{
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(5, 1fr)",
        }}
      >
        {data?.map((item) => (
          <ProductCard key={item?.id} data={item as Products} />
        ))}
      </Box>
    </Box>
  );
}
