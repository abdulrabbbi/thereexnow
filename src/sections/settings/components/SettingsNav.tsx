"use client";

import CdnIcon from "@/assets/icons/cdn-icon";
import OrdersIcon from "@/assets/icons/orders-icon";
import PlansIcon from "@/assets/icons/plans-icon";
import SupportIcon from "@/assets/icons/support-icon";
import { Iconify } from "@/components/iconify";
import useLocales from "@/hooks/use-locales";
import { usePathname } from "@/routes/hooks";
import {
  alpha,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { ReactNode, useMemo } from "react";

type Props = {
  title?: string;
  onNavigate?: VoidFunction;
  onClose?: VoidFunction;
};

type NavItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

export function SettingsNavContent({ onNavigate, onClose, title }: Props) {
  const { t } = useLocales();
  const pathname = usePathname();

  const navItems = useMemo<Array<NavItem>>(
    () => [
      {
        title: t("EDIT_PROFILE"),
        href: "/settings/profile",
        icon: <Iconify icon="solar:user-bold-duotone" />,
      },
      {
        title: t("SUBSCRIPTION_PLANS"),
        href: "/settings/plans",
        icon: <PlansIcon />,
      },
      {
        title: t("SUPPORT"),
        href: "/settings/support",
        icon: <SupportIcon />,
      },
      {
        title: t("TERMS_AND_CONDITION"),
        href: "/settings/terms",
        icon: <CdnIcon />,
      },
      {
        title: t("ORDER"),
        href: "/settings/orders",
        icon: <OrdersIcon />,
      },
    ],
    [t],
  );

  return (
    <Box
      sx={{
        height: 1,
        minWidth: 0,
        color: "common.white",
        display: "flex",
        flexDirection: "column",
        bgcolor: "primary.main",
        backgroundImage: (theme) =>
          `linear-gradient(155deg, ${alpha(theme.palette.common.white, 0.16)} 0%, ${alpha(theme.palette.common.black, 0.18)} 100%)`,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.75, minHeight: 64 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title ?? t("SETTING")}
        </Typography>

        {onClose ? (
          <IconButton
            onClick={onClose}
            aria-label={t("CLOSE")}
            sx={{ color: "common.white" }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
        ) : null}
      </Stack>

      <Box sx={{ px: 1.25, pb: 1.25, flex: 1, minHeight: 0, overflow: "auto" }}>
        <List sx={{ p: 0, display: "grid", gap: 0.75 }}>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                selected={isActive}
                onClick={onNavigate}
                sx={{
                  px: 1.25,
                  py: 0.75,
                  gap: 1.25,
                  minWidth: 0,
                  borderRadius: 999,
                  color: "common.white",
                  alignItems: "center",
                  transition: (theme) =>
                    theme.transitions.create(["background-color"], {
                      duration: theme.transitions.duration.shorter,
                    }),
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.14),
                  },
                  "&.Mui-selected": {
                    bgcolor: alpha("#fff", 0.22),
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.28),
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 999,
                    bgcolor: alpha("#fff", 0.18),
                    "& svg": {
                      width: 22,
                      height: 22,
                      fontSize: 22,
                    },
                    "& img": {
                      width: 22,
                      height: 22,
                      objectFit: "contain",
                    },
                    "& > *": {
                      width: 22,
                      height: 22,
                    },
                  }}
                >
                  {item.icon}
                </Box>

                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontSize: 15,
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
