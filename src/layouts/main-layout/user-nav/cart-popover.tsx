"use client";

import { varHover } from "@/components/animate";
import { CustomPopover, usePopover } from "@/components/custom-popover";
import { Iconify } from "@/components/iconify";
import { useShop } from "@/hooks/helpers/shop";
import useLocales from "@/hooks/use-locales";
import { usePathname, useRouter } from "@/routes/hooks";
import { getCheckoutRoute } from "@/routes/paths";
import { ShopCard } from "@/sections/shop/shop-card";
import { scrollbarStyle } from "@/theme/styles";
import {
  Badge,
  Button,
  IconButton,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import { m } from "framer-motion";

export function CartPopover() {
  const { t } = useLocales();
  const router = useRouter();
  const popover = usePopover();
  const pathname = usePathname();
  const { shoppingCartData, shoppingCartLoading } = useShop();

  const onOpenCart = () => {
    popover.onClose();
    router.push(getCheckoutRoute());
  };

  const isCheckoutPage = pathname === "/shop/checkout";

  return (
    <>
      <IconButton
        component={m.button}
        onClick={popover.onOpen}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.09)}
        sx={{ p: 0.5 }}
      >
        <Badge
          color="error"
          variant="dot"
          invisible={!shoppingCartData?.length}
        >
          <Iconify
            icon="solar:cart-large-2-bold-duotone"
            sx={{ width: 28, height: 28 }}
          />
        </Badge>
      </IconButton>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          arrow: { offset: 17 },
          root: { sx: { mt: 1.5 } },
          paper: { sx: { p: 1, width: 360 } },
        }}
      >
        <MenuList
          spacing={1}
          component={Stack}
          sx={{
            py: 1,
            pr: 1,
            pl: 0.1,
            mb: 1,
            maxHeight: 450,
            overflowY: "scroll",
            ...scrollbarStyle(),
          }}
        >
          {shoppingCartLoading ? (
            <></>
          ) : shoppingCartData?.length === 0 ? (
            <Typography>Your cart is empty</Typography>
          ) : (
            shoppingCartData?.map((item) => (
              <ShopCard key={item?.id} data={item} />
            ))
          )}
        </MenuList>

        {!isCheckoutPage && shoppingCartData?.length ? (
          <Button fullWidth onClick={onOpenCart}>
            {t("CART")}
          </Button>
        ) : null}
      </CustomPopover>
    </>
  );
}
