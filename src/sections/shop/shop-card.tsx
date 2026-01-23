"use client";

import { Iconify } from "@/components/iconify";
import { Image } from "@/components/image";
import { NumberInput } from "@/components/number-input";
import { ShoppingCart } from "@/graphql/generated";
import { useShop } from "@/hooks/helpers/shop";
import { RouterLink } from "@/routes/components";
import { getProductRoute } from "@/routes/paths";
import { getAssetsUrl } from "@/utils";
import { fCurrency } from "@/utils/format-number";
import { Box, Card, CardProps, IconButton, Typography } from "@mui/material";

type ProductItemProps = CardProps & {
  data: ShoppingCart;
};

export function ShopCard({ data, sx, ...other }: ProductItemProps) {
  const { deleteShoppingCart, updateShoppingCart } = useShop();

  const onUpdateCart = (value: number) => {
    if (value === 0) {
      deleteShoppingCart.mutate({ id: data?.id });
    } else {
      updateShoppingCart.mutate({
        input: {
          id: data?.id,
          count: value,
          color: data.color,
          productId: Number(data.productId),
        },
      });
    }
  };

  const onRemove = async () => {
    deleteShoppingCart.mutateAsync({ id: data.id });
  };

  return (
    <Card
      {...other}
      sx={{
        p: 1.5,
        display: "flex",
        minHeight: 109,
        position: "relative",
        alignItems: "stretch",
        ...sx,
      }}
    >
      <Image
        alt={data.product?.name ?? ""}
        src={getAssetsUrl(data.product?.photoUrl)}
        disablePlaceholder
        sx={{
          mr: 2,
          width: 85,
          height: 85,
          flexShrink: 0,
          borderRadius: 1.5,
          bgcolor: "background.neutral",
        }}
      />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography
          noWrap
          variant="body2"
          color="text.primary"
          component={RouterLink}
          href={getProductRoute(data.productId)}
          sx={{
            fontWeight: "fontWeightMedium",
            textDecorationLine: "none",
            "&:hover": { textDecorationLine: "underline" },
          }}
        >
          {data.product?.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle2">
            {fCurrency(data.product?.price)}
          </Typography>

          <Box
            sx={{
              width: 24,
              height: 24,
              bgcolor: data.color,
              borderRadius: "50%",
            }}
          />

          <NumberInput
            value={data.count}
            sx={{ width: 110 }}
            disabled={
              updateShoppingCart.isPending || deleteShoppingCart.isPending
            }
            onChange={(event, value) => {
              event.stopPropagation();

              onUpdateCart(value);
            }}
          />
        </Box>
      </Box>

      <Box sx={{ top: 4, right: 4, position: "absolute" }}>
        <IconButton onClick={onRemove} disabled={deleteShoppingCart.isPending}>
          <Iconify
            icon={
              deleteShoppingCart.isPending
                ? "svg-spinners:12-dots-scale-rotate"
                : "ic:round-close"
            }
          />
        </IconButton>
      </Box>
    </Card>
  );
}
