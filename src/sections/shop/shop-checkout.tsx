"use client";

import { ShoppingCart } from "@/graphql/generated";
import { useShop } from "@/hooks/helpers/shop";
import useLocales from "@/hooks/use-locales";
import { RouterLink } from "@/routes/components";
import { getCheckoutRoute } from "@/routes/paths";
import { hideScrollY } from "@/theme/styles";
import { Button, Stack } from "@mui/material";
import { ShopCard } from "./shop-card";

export function ShopCheckout() {
  const { t } = useLocales();
  const { shoppingCartData } = useShop();

  return (
    <Stack spacing={2} sx={{ pb: 2, width: 420, minWidth: 420 }}>
      <Stack
        flex={1}
        spacing={1.5}
        sx={{
          p: 1.5,
          borderRadius: 2,
          border: "1px dashed grey",
          ...hideScrollY,
        }}
      >
        {shoppingCartData?.map((item) => (
          <ShopCard key={item?.id} data={item as ShoppingCart} />
        ))}
      </Stack>

      <Button
        href={getCheckoutRoute()}
        LinkComponent={RouterLink}
        disabled={!shoppingCartData?.length}
      >
        {t("CONTINUE")}
      </Button>
    </Stack>
  );
}
