"use client";

import EmptyContent from "@/components/empty-content";
import { ShoppingCart } from "@/graphql/generated";
import { useShop } from "@/hooks/helpers/shop";
import useLocales from "@/hooks/use-locales";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ShopCard } from "../shop-card";

export function CheckoutProductList() {
  const { t } = useLocales();
  const { shoppingCartData } = useShop();

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        sx={{ mb: 3 }}
        title={<Typography variant="h6">{t("CART")}</Typography>}
      />

      {shoppingCartData?.length ? (
        <Stack flex={1} p={1.5} spacing={1.5}>
          {shoppingCartData?.map((item) => (
            <ShopCard
              key={item?.id}
              data={item as ShoppingCart}
              sx={{
                boxShadow: "none",
                border: (theme) => ` 1px solid ${theme.palette.grey[200]}`,
              }}
            />
          ))}
        </Stack>
      ) : (
        <EmptyContent
          title="Cart is empty!"
          sx={{ pt: 5, pb: 10 }}
          description="Look like you have no items in your shopping cart."
        />
      )}
    </Card>
  );
}
