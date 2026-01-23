"use client";

import { Iconify } from "@/components/iconify";
import { useShop } from "@/hooks/helpers/shop";
import { useCheckout } from "@/hooks/use-checkout";
import useLocales from "@/hooks/use-locales";
import { HEADER } from "@/layouts/config-layout";
import { RouterLink } from "@/routes/components";
import { getShopRoute } from "@/routes/paths";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CheckoutProductList } from "./checkout-product-list";
import { CheckoutSummary } from "./checkout-summary";

export function CheckoutCart() {
  const { t } = useLocales();

  const checkout = useCheckout();
  const { shoppingCartData } = useShop();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={{ position: "sticky", top: HEADER.H_DESKTOP + 24 }}>
          <CheckoutSummary />

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={checkout.onNextStep}
            disabled={!shoppingCartData?.length}
          >
            {t("CHECK_OUT")}
          </Button>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <CheckoutProductList />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            color="inherit"
            variant="text"
            href={getShopRoute()}
            component={RouterLink}
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
          >
            {t("ADD_MORE_PRODUCT")}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
