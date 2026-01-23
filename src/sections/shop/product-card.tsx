"use client";

import AnimateMarquee from "@/components/animate/animate-marquee";
import { Iconify } from "@/components/iconify";
import { Image, imageClasses, ImageProps } from "@/components/image";
import { useLoginModal } from "@/components/login-modal/use-login-modal";
import { NumberInput } from "@/components/number-input";
import { Products } from "@/graphql/generated";
import { useShop } from "@/hooks/helpers/shop";
import useLocales from "@/hooks/use-locales";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "@/routes/hooks";
import { getProductRoute } from "@/routes/paths";
import { getAssetsUrl } from "@/utils";
import { fCurrency } from "@/utils/format-number";
import {
  alpha,
  Box,
  Button,
  Paper,
  PaperProps,
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  data: Products;
};

export function ProductCard({ data }: Props) {
  const router = useRouter();

  const onClickHandler = () => {
    router.push(getProductRoute(data.id as number));
  };

  return (
    <CustomPaper>
      <Box onClick={onClickHandler}>
        <Box pt={2} px={2} sx={{ bgcolor: "grey.100" }}>
          <CustomImage src={getAssetsUrl(data.photoUrl)} />
        </Box>

        <Stack
          px={2}
          py={0.2}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ bgcolor: "grey.100" }}
        >
          <Stack flex={1} overflow="hidden">
            <AnimateMarquee
              text={data.name ?? ""}
              slotProps={{ typography: { sx: { p: 1.5 } } }}
            />
          </Stack>

          <Typography>{fCurrency(data.price)}</Typography>
        </Stack>
      </Box>

      <ProductCounter data={data} />
    </CustomPaper>
  );
}

const CustomPaper = ({ children, onClick }: PaperProps) => (
  <Paper
    component="div"
    onClick={onClick}
    variant="outlined"
    sx={{
      borderRadius: 2,
      cursor: "pointer",
      overflow: "hidden",
      userSelect: "none",
      position: "relative",
      textDecoration: "none",
      borderColor: (theme) => alpha(theme.palette.grey[500], 0.12),

      "&:hover": {
        [`& .${imageClasses.img}`]: { transform: "scale(1.06)" },
      },
    }}
  >
    {children}
  </Paper>
);

const CustomImage = ({ alt, src }: ImageProps) => (
  <Image
    src={src}
    ratio="1/1"
    alt={alt ?? ""}
    sx={{
      maxWidth: 1,
      width: "100%",
      borderRadius: 1,
      objectFit: "contain",
      border: "0.5px solid #EAEAEA",
      [`& .${imageClasses.img}`]: {
        transition: (theme) =>
          theme.transitions.create(["transform"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.short,
          }),
      },
    }}
  />
);

function ProductCounter({ data }: { data: Products }) {
  const { t } = useLocales();
  const { userData } = useUser();
  const withLoginModal = useLoginModal();

  const {
    shoppingCartData,
    createShoppingCart,
    updateShoppingCart,
    deleteShoppingCart,
  } = useShop();

  const count = shoppingCartData?.find(
    (item) => item?.productId === data.id
  )?.count;

  const onAddToCart = () => {
    if (!userData) {
      return withLoginModal.run();
    }

    createShoppingCart.mutate({
      input: {
        count: 1,
        productId: data.id,
        color: JSON.parse(data.colors!)[0],
      },
    });
  };

  const onUpdateCart = (value: number) => {
    if (!userData) {
      return withLoginModal.run();
    }

    const productInCart = shoppingCartData?.find(
      (item) => item?.productId === data.id
    );

    if (value === 0) {
      deleteShoppingCart.mutate({ id: productInCart?.id as number });
    } else {
      updateShoppingCart.mutate({
        input: {
          count: value,
          productId: data.id,
          id: productInCart?.id,
          color: productInCart?.color,
        },
      });
    }
  };

  if (count! >= 1) {
    return (
      <Stack
        height={48}
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
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
      </Stack>
    );
  }

  return (
    <Button
      fullWidth
      variant="text"
      color="inherit"
      sx={{ borderRadius: 0 }}
      loading={createShoppingCart.isPending}
      startIcon={<Iconify icon="solar:cart-plus-line-duotone" />}
      onClick={(e) => {
        e.stopPropagation();
        console.log("Test");
        onAddToCart();
      }}
    >
      {t("ADD_TO_CART")}
    </Button>
  );
}
