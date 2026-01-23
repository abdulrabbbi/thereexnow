"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { Logo } from "@/components/logo";
import { Iconify } from "@/components/iconify";
import { useAuth } from "@/hooks/use-auth";
import useLocales from "@/hooks/use-locales";
import { RouterLink } from "@/routes/components";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Stack,
  IconButton,
  Drawer,
  Divider,
} from "@mui/material";

import { HEADER, NAV } from "../config-layout";
import MainNav from "./nav";
import * as Styled from "./styles";
import { LanguagePopover } from "./user-nav/language-popover";

const UserNav = dynamic(() => import("./user-nav").then((mod) => mod.UserNav), {
  ssr: false,
});

const DESKTOP_BREAKPOINT = "md";

export function MainHeader() {
  const { t } = useLocales();
  const { authenticated } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          disableGutters
          sx={(theme) => ({
            px: 0,
            height: {
              xs: HEADER.H_MOBILE,
              [DESKTOP_BREAKPOINT]: HEADER.H_DESKTOP,
            },
            borderBottomLeftRadius: {
              xs: 18,
              sm: 24,
              [DESKTOP_BREAKPOINT]: 30,
            },
            borderBottomRightRadius: {
              xs: 18,
              sm: 24,
              [DESKTOP_BREAKPOINT]: 30,
            },
            bgcolor: "secondary.lighter",
            transition: theme.transitions.create(["height"], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.shorter,
            }),
          })}
        >
          <Styled.DesktopNavRoot maxWidth="xl">
            <Box
              sx={{
                display: {
                  xs: "flex",
                  [DESKTOP_BREAKPOINT]: "none",
                },
                alignItems: "center",
                gap: 1.5,
                flexShrink: 0,
              }}
            >
              <IconButton
                onClick={openMobile}
                sx={{
                  display: {
                    xs: "inline-flex",
                    [DESKTOP_BREAKPOINT]: "none",
                  },
                }}
                aria-label="Open menu"
              >
                <Iconify icon="eva:menu-2-fill" />
              </IconButton>

              {!authenticated ? (
                <Button
                  size="medium"
                  href="/sign-in"
                  LinkComponent={RouterLink}
                >
                  {t("SIGN_IN2")}
                </Button>
              ) : null}
            </Box>

            <Box
              sx={{
                position: {
                  xs: "absolute",
                  [DESKTOP_BREAKPOINT]: "static",
                },
                left: { xs: "50%" },
                transform: {
                  xs: "translateX(-50%)",
                  [DESKTOP_BREAKPOINT]: "none",
                },
                zIndex: { xs: 1, [DESKTOP_BREAKPOINT]: "auto" },
                pointerEvents: "none",
              }}
            >
              <Box
                sx={{
                  width: { xs: 110, sm: 130, [DESKTOP_BREAKPOINT]: 150 },
                  pointerEvents: "auto",
                }}
              >
                <Logo />
              </Box>
            </Box>

            <MainNav
              display={{
                xs: "none",
                [DESKTOP_BREAKPOINT]: "flex",
              }}
              onItemClick={closeMobile}
              sx={{
                flexGrow: 1,
                px: { [DESKTOP_BREAKPOINT]: 3 },
                mx: { [DESKTOP_BREAKPOINT]: 2 },
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  display: { xs: "flex", [DESKTOP_BREAKPOINT]: "none" },
                }}
              >
                <LanguagePopover />
              </Box>

              <Box
                sx={{
                  display: { xs: "none", [DESKTOP_BREAKPOINT]: "flex" },
                  alignItems: "center",
                }}
              >
                {authenticated ? (
                  <UserNav />
                ) : (
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ py: 0 }}
                  >
                    <LanguagePopover />
                    <Button
                      size="medium"
                      href="/sign-in"
                      LinkComponent={RouterLink}
                      sx={{
                        width: 150,
                      }}
                    >
                      {t("SIGN_IN2")}
                    </Button>
                  </Stack>
                )}
              </Box>
            </Box>
          </Styled.DesktopNavRoot>
        </Toolbar>
      </AppBar>

      <Drawer
        open={mobileOpen}
        onClose={closeMobile}
        PaperProps={{
          sx: {
            width: NAV.W_VERTICAL,
            mt: { xs: `${HEADER.H_MOBILE}px`, md: `${HEADER.H_DESKTOP}px` },
            height: {
              xs: `calc(100% - ${HEADER.H_MOBILE}px)`,
              md: `calc(100% - ${HEADER.H_DESKTOP}px)`,
            },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Logo />
            <IconButton onClick={closeMobile} aria-label="Close menu">
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Box>

          <Divider />

          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              px: 1.5,
              py: 1,
            }}
          >
            <MainNav display="flex" onItemClick={closeMobile} />
          </Box>

          <Divider />

          <Box sx={{ p: 2, display: "grid", gap: 1.5 }}>
            <LanguagePopover />
            {!authenticated && (
              <Button
                fullWidth
                variant="contained"
                href="/sign-in"
                LinkComponent={RouterLink}
              >
                {t("SIGN_IN2")}
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
