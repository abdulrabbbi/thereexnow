"use client";

import { Iconify } from "@/components/iconify";
import { RouterLink } from "@/routes/components";
import { useActiveLink } from "@/routes/hooks";
import {
  alpha,
  Box,
  BoxProps,
  Button,
  Container,
  ContainerProps,
  Divider,
  Drawer,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { HEADER } from "../config-layout";
import { MiniNavContent } from "./mini-nav-content";
import { MiniNavSidebar } from "./mini-nav-sidebar";
import { MiniNavItemsType } from "./types";

type Props = PropsWithChildren<{
  navItems: Array<MiniNavItemsType>;
  mobileMenuButtonLabel?: string;
  mobileMenuTitle?: string;
  slotProps?: {
    wrapper?: BoxProps;
    container?: ContainerProps;
    sidebar?: React.ComponentProps<typeof MiniNavSidebar>;
    content?: React.ComponentProps<typeof MiniNavContent>;
  };
}>;

export default function MiniNavLayout({
  navItems,
  children,
  mobileMenuButtonLabel,
  mobileMenuTitle,
  slotProps,
}: Props) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [openSidebar, setOpenSidebar] = useState(false);

  const buttonLabel = mobileMenuButtonLabel ?? "Menu";
  const drawerTitle = mobileMenuTitle ?? "Menu";

  useEffect(() => {
    if (mdUp) setOpenSidebar(false);
  }, [mdUp]);

  return (
    <Container
      maxWidth="xl"
      {...slotProps?.container}
      sx={{
        px: { xs: 2, sm: 3 },
        pt: { xs: `${HEADER.H_MOBILE + 12}px`, md: `${HEADER.H_DESKTOP + 12}px` },
        pb: { xs: 4, md: 6 },
        ...(slotProps?.container?.sx || {}),
      }}
    >
      <Box
        {...slotProps?.wrapper}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
          minWidth: 0,
          ...slotProps?.wrapper?.sx,
        }}
      >
        <MiniNavSidebar
          navItems={navItems}
          {...slotProps?.sidebar}
          sx={{
            display: { xs: "none", md: "block" },
            flexShrink: 0,
            ...(slotProps?.sidebar?.sx || {}),
          }}
        />

        <MiniNavContent {...slotProps?.content} sx={{ minWidth: 0, ...(slotProps?.content?.sx || {}) }}>
          <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
            <Button
              fullWidth
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="eva:menu-2-fill" />}
              onClick={() => setOpenSidebar(true)}
              sx={{ justifyContent: "flex-start" }}
            >
              {buttonLabel}
            </Button>
          </Box>

          {children}
        </MiniNavContent>

        <Drawer
          open={openSidebar}
          onClose={() => setOpenSidebar(false)}
          PaperProps={{
            sx: {
              width: 280,
              mt: { xs: `${HEADER.H_MOBILE}px`, md: `${HEADER.H_DESKTOP}px` },
              height: {
                xs: `calc(100% - ${HEADER.H_MOBILE}px)`,
                md: `calc(100% - ${HEADER.H_DESKTOP}px)`,
              },
              bgcolor: "secondary.light",
              color: "common.white",
            },
          }}
        >
          <Stack sx={{ height: 1, minWidth: 0 }}>
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">{drawerTitle}</Typography>
              <IconButton
                onClick={() => setOpenSidebar(false)}
                aria-label="Close menu"
                sx={{ color: "common.white" }}
              >
                <Iconify icon="eva:close-fill" />
              </IconButton>
            </Box>

            <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.24) }} />

            <Box sx={{ flex: 1, overflow: "auto", p: 1, minWidth: 0 }}>
              {navItems.map((item, index) => (
                <DrawerNavItem
                  key={index}
                  item={item}
                  onItemClick={() => setOpenSidebar(false)}
                />
              ))}
            </Box>
          </Stack>
        </Drawer>
      </Box>
    </Container>
  );
}

function DrawerNavItem({
  item,
  onItemClick,
}: {
  item: MiniNavItemsType;
  onItemClick: VoidFunction;
}) {
  const theme = useTheme();
  const active = useActiveLink(item.link ?? "");
  const isLink = typeof item.link === "string";

  return (
    <ListItemButton
      disabled={item.isLoading}
      sx={{
        borderRadius: 1.5,
        color: "common.white",
        ...(item.link &&
          active && {
            backgroundColor: alpha(theme.palette.common.black, 0.14),
            "&:hover": { backgroundColor: alpha(theme.palette.common.black, 0.22) },
          }),
      }}
      {...(isLink
        ? { LinkComponent: RouterLink, href: item.link, onClick: onItemClick }
        : {
            onClick: () => {
              onItemClick();
              item.onClick();
            },
          })}
    >
      <ListItemIcon sx={{ minWidth: 44 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            display: "grid",
            placeItems: "center",
            borderRadius: 1,
            bgcolor: "secondary.lighter",
          }}
        >
          {item.isLoading ? (
            <Iconify icon="svg-spinners:90-ring-with-bg" width={22} />
          ) : (
            item.icon
          )}
        </Box>
      </ListItemIcon>

      <ListItemText
        primary={item.title}
        primaryTypographyProps={{ noWrap: true }}
      />
    </ListItemButton>
  );
}
