"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { useAppSettings } from "@/hooks/helpers/app-settings";
import { useResponsive } from "@/hooks/use-responsive";
import { useTabs } from "@/hooks/use-tabs";
import { Box, Container, Tab, Tabs } from "@mui/material";

export default function TermsView() {
  const tabs = useTabs("terms");
  const isDesktop = useResponsive("up", "sm");

  const { appSettingsData, appSettingsLoading } = useAppSettings();

  const TABS = [
    {
      value: "terms",
      label: "Terms and condition",
      content: appSettingsData?.termsAndConditions,
    },
    {
      value: "privacy",
      label: "Privacy policy",
      content: appSettingsData?.privacyPolicy,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
      {appSettingsLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : (
        <>
          <Tabs
            value={tabs.value}
            onChange={tabs.onChange}
            variant={isDesktop ? "standard" : "fullWidth"}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>

          {TABS.map(
            (tab) =>
              tab.value === tabs.value && (
                <Box
                  key={tab.value}
                  component="div"
                  dangerouslySetInnerHTML={{ __html: tab.content as string }}
                />
              )
          )}
        </>
      )}
    </Container>
  );
}
