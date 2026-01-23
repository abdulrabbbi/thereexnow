"use client";

import { ColorPicker } from "@/components/color-utils";
import { useLoginModal } from "@/components/login-modal/use-login-modal";
import { NumberInput } from "@/components/number-input";
import { Products } from "@/graphql/generated";
import { useShop } from "@/hooks/helpers/shop";
import useLocales from "@/hooks/use-locales";
import { useUser } from "@/hooks/use-user";
import { RouterLink } from "@/routes/components";
import { getExerciseRoute } from "@/routes/paths";
import { fCurrency } from "@/utils/format-number";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";

type Props = {
  product: Products;
};

export function ProductInfo({ product }: Props) {
  const { t } = useLocales();
  const { userData } = useUser();
  const withLoginModal = useLoginModal();

  const {
    shoppingCartData,
    createShoppingCart,
    deleteShoppingCart,
    updateShoppingCart,
  } = useShop();

  let colors = [] as Array<string>;

  if (product?.colors) {
    colors = JSON.parse(product?.colors as string);
  }

  const [selectedColor, setSelectedColor] = useState(0);

  const count = shoppingCartData?.find(
    (item) =>
      item?.productId === product.id && item.color === colors[selectedColor]
  )?.count;

  const onAddToCart = () => {
    if (!userData) {
      return withLoginModal.run();
    } else
      createShoppingCart.mutate({
        input: {
          count: 1,
          productId: product.id,
          color: colors[selectedColor],
        },
      });
  };

  const onUpdateCart = (value: number) => {
    const productInCart = shoppingCartData?.find(
      (item) =>
        item?.productId === product.id && item.color === colors[selectedColor]
    );

    if (value === 0) {
      deleteShoppingCart.mutate({ id: productInCart?.id as number });
    } else {
      updateShoppingCart.mutate({
        input: {
          count: value,
          productId: product.id,
          id: productInCart?.id,
          color: productInCart?.color,
        },
      });
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{product?.name}</Typography>

        <Typography variant="h4">{fCurrency(product?.price)}</Typography>
      </Stack>

      <Typography mt={2} fontSize={18} variant="body1">
        {product?.description}
      </Typography>

      <Stack
        mt={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <ColorPicker
          limit="auto"
          colors={colors}
          selected={colors[selectedColor]}
          onSelectColor={(color) => {
            const index = colors.findIndex((el) => el === color);

            setSelectedColor(index);
          }}
        />

        {count! >= 1 ? (
          <NumberInput
            value={count}
            sx={{ width: 110 }}
            disabled={
              updateShoppingCart.isPending || deleteShoppingCart.isPending
            }
            onChange={(event, value) => {
              event.stopPropagation();

              onUpdateCart(value);
            }}
          />
        ) : null}
      </Stack>

      {product?.exerciseProducts?.length ? (
        <Box mt={3}>
          <Typography mb={2} variant="h5">
            {t("HOME")}:
          </Typography>

          <Grid container spacing={1}>
            {product?.exerciseProducts?.map((item) => (
              <Chip
                key={item?.exerciseId}
                component={RouterLink}
                sx={{ cursor: "pointer" }}
                label={item?.exercise?.name}
                href={getExerciseRoute(item?.exerciseId!)}
              />
            ))}
          </Grid>
        </Box>
      ) : null}

      <Button
        fullWidth
        disabled={!!count}
        onClick={onAddToCart}
        loading={createShoppingCart.isPending}
        sx={{ mt: 5 }}
      >
        {t("ADD_TO_CART")}
      </Button>
    </Box>
  );
}
