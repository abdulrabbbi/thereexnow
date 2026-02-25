"use client";

import { Iconify } from "@/components/iconify";
import useLocales from "@/hooks/use-locales";
import { useResponsive } from "@/hooks/use-responsive";
import { HEADER } from "@/layouts/config-layout";
import { AuthGuard } from "@/providers/auth-provider/auth-guard";
import { SettingsNavContent } from "@/sections/settings/components/SettingsNav";
import SettingsNavDrawer from "@/sections/settings/components/SettingsNavDrawer";
import { Box, Button, Container } from "@mui/material";
import { PropsWithChildren, useEffect, useState } from "react";

export default function Layout({ children }: PropsWithChildren) {
  const { t } = useLocales();
  const mdUp = useResponsive("up", "md");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (mdUp) {
      setMobileNavOpen(false);
    }
  }, [mdUp]);

  return (
    <AuthGuard>
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3 },
          pt: { xs: `${HEADER.H_MOBILE + 12}px`, md: `${HEADER.H_DESKTOP + 12}px` },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 3 },
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 332,
              flexShrink: 0,
              display: { xs: "none", md: "block" },
            }}
          >
            <Box
              sx={{
                top: `${HEADER.H_DESKTOP + 12}px`,
                height: `calc(100vh - ${HEADER.H_DESKTOP + 24}px)`,
                position: "sticky",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <SettingsNavContent />
            </Box>
          </Box>

          <Box component="main" sx={{ minWidth: 0, flex: 1, overflowX: "hidden" }}>
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
              <Button
                fullWidth
                color="inherit"
                variant="outlined"
                startIcon={<Iconify icon="eva:menu-2-fill" />}
                onClick={() => setMobileNavOpen(true)}
                sx={{ justifyContent: "flex-start" }}
              >
                {t("SETTING")} menu
              </Button>
            </Box>

            {children}
          </Box>
        </Box>
      </Container>

      <SettingsNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </AuthGuard>
  );
}
