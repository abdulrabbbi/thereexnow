import { useCheckout } from "@/hooks/use-checkout";
import useLocales from "@/hooks/use-locales";
import { HEADER } from "@/layouts/config-layout";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";
import { CheckoutAddress } from "./checkout-address";
import { CheckoutPaymentForm } from "./checkout-payment-form";
import { CheckoutSummary } from "./checkout-summary";

export function CheckoutPayment() {
  const { t } = useLocales();
  const checkout = useCheckout();

  const options = useMemo(
    () => ({
      clientSecret: checkout.paymentIntent?.clientSecret as string,
    }),
    [checkout.paymentIntent]
  );

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={{ position: "sticky", top: HEADER.H_DESKTOP + 24 }}>
          <CheckoutAddress />

          <CheckoutSummary />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Elements
          options={options}
          stripe={loadStripe(checkout?.paymentIntent?.publishableKey as string)}
        >
          <CheckoutPaymentForm />
        </Elements>
      </Grid>
    </Grid>
  );
}
