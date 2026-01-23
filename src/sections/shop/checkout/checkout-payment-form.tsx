"use client";

import { useRequest_CreateRequestMutation } from "@/graphql/generated";
import { useShop } from "@/hooks/helpers/shop";
import { useCheckout } from "@/hooks/use-checkout";
import useLocales from "@/hooks/use-locales";
import { useRouter } from "@/routes/hooks";
import { getOrdersRoute } from "@/routes/paths";
import { primaryFont } from "@/theme/core";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function CheckoutPaymentForm() {
  const theme = useTheme();
  const { t } = useLocales();
  const router = useRouter();
  const stripe = useStripe();
  const checkout = useCheckout();
  const elements = useElements();
  const queryClient = useQueryClient();
  const { shoppingCartData, deleteShoppingCart } = useShop();

  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const {
    isPending: createRequestLoading,
    mutateAsync: createRequestMutation,
  } = useRequest_CreateRequestMutation();

  const onSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    if (error) {
      elements?.getElement("card")?.focus();
      return;
    }

    await createRequestMutation(
      {
        input: {
          city: checkout.shipping?.city,
          state: checkout.shipping?.state,
          address: checkout.shipping?.address,
          zipCode: checkout.shipping?.zipCode,
          countryCode: checkout.shipping?.country,
          requestProducts: shoppingCartData?.map((item) => ({
            count: item?.count as number,
            color: item?.color as string,
            productId: item?.productId as number,
          })),
        },
      },
      {
        onSuccess: async (res) => {
          if (res.request_createRequest?.status.code === 1) {
            const result = await stripe.confirmCardPayment(
              checkout.paymentIntent?.clientSecret as string,
              {
                payment_method: {
                  card: elements.getElement(CardElement)!,
                },
              }
            );

            if (result?.paymentIntent?.status === "succeeded") {
              shoppingCartData?.map(async (data) => {
                if (data?.id) await deleteShoppingCart.mutate({ id: data?.id });
              });

              queryClient.invalidateQueries({
                queryKey: ["shoppingCart_getShoppingCarts"],
              });
              queryClient.invalidateQueries({
                queryKey: ["product_getProducts"],
              });
              queryClient.invalidateQueries({
                queryKey: ["request_getRequests"],
              });

              toast.info("Your purchase was successful!");

              router.replace(getOrdersRoute());
            } else {
              toast.warning(
                result?.paymentIntent?.status || result?.error?.message
              );
            }
          } else {
            toast.warning(res.request_createRequest?.status?.value);
          }
        },
      }
    );
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        sx={{ mb: 3 }}
        title={<Typography variant="h6">{t("PAYMENT")}</Typography>}
      />

      <Box px={3} pb={3}>
        <Stack pt={3} pb={2} spacing={2} direction="row" alignItems="center">
          <Box
            sx={{
              p: 1.5,
              mt: 0.5,
              flexGrow: 1,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.300",
            }}
          >
            <CardElement
              onChange={(e) => {
                setError(e.error?.message);
                setIsCompleted(e.complete);
              }}
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: theme.palette.text.primary,
                    fontFamily: primaryFont.style.fontFamily,

                    "::placeholder": {
                      color: theme.palette.text.secondary,
                    },
                  },
                  invalid: {
                    color: theme.palette.error.main,
                    iconColor: theme.palette.error.dark,
                  },
                },
              }}
            />
          </Box>
          <Button
            onClick={onSubmit}
            sx={{ width: 100 }}
            disabled={!isCompleted}
            loading={createRequestLoading}
          >
            {t("PAY")}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
