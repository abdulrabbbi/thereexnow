"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { useShop } from "@/hooks/helpers/shop";
import { useCheckout } from "@/hooks/use-checkout";
import { PRODUCT_CHECKOUT_STEPS } from "@/providers/checkout-provider";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect } from "react";
import { CheckoutCart } from "../checkout-cart";
import { CheckoutPayment } from "../checkout-payment";
import { CheckoutShippingAddress } from "../checkout-shipping-address";
import { CheckoutSteps } from "../checkout-steps";

export default function CheckoutView() {
  const checkout = useCheckout();
  const { shoppingCartLoading } = useShop();

  useEffect(() => {
    checkout.initialStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container sx={{ pt: 15, pb: 10 }}>
      {shoppingCartLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : (
        <>
          <Grid
            container
            justifyContent={checkout.completed ? "center" : "flex-start"}
          >
            <Grid size={{ xs: 12, md: 4 }} />
            <Grid size={{ xs: 12, md: 8 }}>
              <CheckoutSteps
                steps={PRODUCT_CHECKOUT_STEPS}
                activeStep={checkout.activeStep}
              />
            </Grid>
          </Grid>

          <>
            {checkout.activeStep === 0 && <CheckoutCart />}

            {checkout.activeStep === 1 && <CheckoutShippingAddress />}

            {checkout.activeStep === 2 && <CheckoutPayment />}
          </>
        </>
      )}
    </Container>
  );
}
