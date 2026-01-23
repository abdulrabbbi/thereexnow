"use client";

import { states } from "@/assets/data";
import { Field, Form } from "@/components/hook-form";
import { useMembership_CreateIntentForPaymentMutation } from "@/graphql/generated";
import { useShop } from "@/hooks/helpers/shop";
import { useCheckout } from "@/hooks/use-checkout";
import useLocales from "@/hooks/use-locales";
import { useUser } from "@/hooks/use-user";
import { HEADER } from "@/layouts/config-layout";
import { CheckoutShippingType } from "@/providers/checkout-provider";
import { yupResolver } from "@hookform/resolvers/yup";
import { Container, MenuItem, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";
import { CheckoutSummary } from "./checkout-summary";

const RADIO_OPTIONS = [
  { label: "CURRENT_ADDRESS", value: "current" },
  { label: "NEW_ADDRESS", value: "new" },
];

const ShippingAddressSchema = Yup.object().shape({
  variant: Yup.string().oneOf(RADIO_OPTIONS.map((el) => el.value)),
  address: Yup.string().when(["variant"], (variant, schema) => {
    if (String(variant) === "new") {
      return schema.required("Address is required");
    }
    return schema.notRequired();
  }),
  country: Yup.string().when(["variant"], (variant, schema) => {
    if (String(variant) === "new") {
      return schema.required("Country is required");
    }
    return schema.notRequired();
  }),
  city: Yup.string().when(["country"], (country, schema) => {
    if (String(country) === "United States") {
      return schema.required("City is required for US users");
    }
    return schema.notRequired();
  }),
  state: Yup.string().when(["country"], (country, schema) => {
    if (String(country) === "United States") {
      return schema.required("State is required for US users");
    }
    return schema.notRequired();
  }),
  zipCode: Yup.string().when(["country"], (country, schema) => {
    if (String(country) === "United States") {
      return schema.required("Zipcode is required for US users");
    }
    return schema.notRequired();
  }),
});

const defaultValues = {
  variant: RADIO_OPTIONS[0].value,
  city: "",
  state: "",
  address: "",
  country: "",
  zipCode: "",
};

export function CheckoutShippingAddress() {
  const { t } = useLocales();
  const checkout = useCheckout();
  const { userData } = useUser();
  const { cartPrices, shoppingCartData } = useShop();

  const { isPending: createIntentLoading, mutateAsync: createIntentMutation } =
    useMembership_CreateIntentForPaymentMutation();

  const currentAddress = [
    userData?.country,
    userData?.state,
    userData?.city,
    userData?.zipCode,
    userData?.address,
  ].filter(Boolean);

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(ShippingAddressSchema),
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const formValues = watch();

  useEffect(() => {
    if (formValues.variant === "current") {
      reset(defaultValues);
    }
  }, [formValues.variant]);

  const onSubmit = handleSubmit(async (data) => {
    const isCurrentAddress = formValues.variant === "current";

    const address: CheckoutShippingType = {
      city: (isCurrentAddress ? userData.city : data.city) as string,
      state: (isCurrentAddress ? userData.state : data.state) as string,
      address: (isCurrentAddress ? userData.address : data.address) as string,
      country: (isCurrentAddress ? userData.country : data.country) as string,
      zipCode: (isCurrentAddress ? userData.zipCode : data.zipCode) as string,
    };

    createIntentMutation(
      { amount: cartPrices.total },
      {
        onSuccess: (res) => {
          if (res.membership_createIntentForPayment?.status.code === 1) {
            const intent = res.membership_createIntentForPayment?.result;

            checkout.onChangeShipping(address);

            checkout.onSetIntent({
              intentId: intent?.intentId,
              clientSecret: intent?.clientSecret,
              publishableKey: intent?.publishableKey,
            });

            checkout.onNextStep();
          } else {
            toast.warning(res.membership_createIntentForPayment?.status.value);
          }
        },
      }
    );
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: "sticky", top: HEADER.H_DESKTOP + 24 }}>
            <CheckoutSummary />

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={createIntentLoading}
              disabled={!shoppingCartData?.length}
            >
              {t("PAY")}
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Container
            maxWidth="xs"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Field.RadioGroup
              row
              name="variant"
              sx={{ gap: 3 }}
              options={RADIO_OPTIONS.map((item) => ({
                value: item.value,
                label: t(item.label),
              }))}
            />

            {formValues.variant === "current" ? (
              <Box
                sx={{
                  p: 2,
                  mt: 3,
                  minHeight: 48,
                  borderRadius: 1,
                  bgcolor: "background.neutral",
                }}
              >
                <Typography sx={{ fontWeight: 500, span: { fontWeight: 400 } }}>
                  Shipping address:{" "}
                  <span>
                    {currentAddress.length ? currentAddress.join(", ") : "-"}
                  </span>
                </Typography>
              </Box>
            ) : (
              <Stack mt={3} spacing={2}>
                <Field.CountrySelect
                  fullWidth
                  name="country"
                  sx={{ flex: 1 }}
                  placeholder={t("Country")}
                />

                {formValues.country === "United States" ? (
                  <>
                    <Field.Text
                      select
                      fullWidth
                      name="state"
                      label={t("STATE")}
                    >
                      {states.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field.Text>

                    <Field.Text name="city" label={t("CITY2")} />

                    <Field.Text name="zipCode" label={t("ZIP_CODE2")} />
                  </>
                ) : null}

                <Field.Text
                  rows={3}
                  multiline
                  name="address"
                  label={t("ADDRESS")}
                />
              </Stack>
            )}
          </Container>
        </Grid>
      </Grid>
    </Form>
  );
}
