"use client";

import CdnIcon from "@/assets/icons/cdn-icon";
import OrdersIcon from "@/assets/icons/orders-icon";
import PlansIcon from "@/assets/icons/plans-icon";
import SupportIcon from "@/assets/icons/support-icon";
import { Iconify } from "@/components/iconify";
import useLocales from "@/hooks/use-locales";
import MiniNavLayout from "@/layouts/mini-nav-layout";
import { MiniNavItemsType } from "@/layouts/mini-nav-layout/types";
import { AuthGuard } from "@/providers/auth-provider/auth-guard";
import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  const { t } = useLocales();

  const navItems: Array<MiniNavItemsType> = [
    {
      title: t("EDIT_PROFILE"),
      link: "/settings/profile",
      icon: <Iconify width={38} icon="solar:user-bold-duotone" />,
    },
    {
      title: t("SUBSCRIPTION_PLANS"),
      link: "/settings/plans",
      icon: (
        <Stack
          sx={{
            p: 1.2,
            width: 1,
            height: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PlansIcon />
        </Stack>
      ),
    },
    {
      title: t("SUPPORT"),
      link: "/settings/support",
      icon: <SupportIcon />,
    },
    {
      title: t("TERMS_AND_CONDITION"),
      link: "/settings/terms",
      icon: <CdnIcon />,
    },
    {
      title: t("ORDER"),
      link: "/settings/orders",
      icon: <OrdersIcon />,
    },
  ];

  return (
    <AuthGuard>
      <MiniNavLayout navItems={navItems}>{children}</MiniNavLayout>
    </AuthGuard>
  );
}
