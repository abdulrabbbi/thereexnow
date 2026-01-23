"use client";

import { useShop } from "@/hooks/helpers/shop";
import useLocales from "@/hooks/use-locales";
import { fCurrency } from "@/utils/format-number";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function CheckoutSummary() {
  const { t } = useLocales();
  const { cartPrices } = useShop();

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={<Typography variant="h6">{t("ORDER_SUMMARY")}</Typography>}
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: "text.secondary" }}
          >
            {t("TOTAL_INCLOUDING")}
          </Typography>

          <Typography component="span" variant="subtitle2">
            {fCurrency(cartPrices?.subtotal)}
          </Typography>
        </Box>

        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: "text.secondary" }}
          >
            Shipping cost
          </Typography>

          <Typography component="span" variant="subtitle2">
            {fCurrency(cartPrices?.shippingCost)}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box display="flex">
          <Typography
            component="span"
            variant="subtitle1"
            sx={{ fontWeight: 600, flexGrow: 1 }}
          >
            {t("TOTAL")}
          </Typography>

          <Typography
            component="span"
            variant="subtitle1"
            sx={{ fontWeight: 600, display: "block", color: "error.main" }}
          >
            {fCurrency(cartPrices?.total)}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
