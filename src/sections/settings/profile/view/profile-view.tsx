"use client";

import { Iconify } from "@/components/iconify";
import { LoadingScreen } from "@/components/loading-screen";
import useLocales from "@/hooks/use-locales";
import { useResponsive } from "@/hooks/use-responsive";
import { useTabs } from "@/hooks/use-tabs";
import { useUser } from "@/hooks/use-user";
import CompleteProfileView from "@/sections/auth/complete-profile/view";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import { parsePhoneNumberWithError, PhoneNumber } from "libphonenumber-js";
import { useMemo } from "react";
import { ChangePasswordSection } from "../change-password-section";

export default function ProfileView() {
  const { t } = useLocales();
  const tabs = useTabs("profile");
  const isDesktop = useResponsive("up", "sm");

  const { userData, userLoading } = useUser();

  const initialValues = useMemo(() => {
    if (userData) {
      let parsedPhoneNumber: PhoneNumber;

      try {
        parsedPhoneNumber = parsePhoneNumberWithError(
          userData?.phoneNumber as string
        );
      } catch (error) {}

      return {
        state: userData?.state,
        gender: userData?.gender,
        address: userData?.address,
        country: userData?.country,
        zipCode: userData?.zipCode,
        fullName: userData?.fullName,
        photoUrl: userData?.photoUrl,
        occupation: userData?.occupation,
        phoneNumber: parsedPhoneNumber?.number ?? userData.phoneNumber,
        countryName: parsedPhoneNumber?.country,
        yearsOfExperience: userData?.yearsOfExperience,
        countryCode: parsedPhoneNumber?.countryCallingCode ?? "+1",
      };
    }
  }, [userData]);

  const TABS = [
    {
      value: "profile",
      label: t("PROFILE"),
      component: <CompleteProfileView initialValues={initialValues as any} />,
      icon: <Iconify icon="solar:user-bold-duotone" width={24} />,
    },
    {
      value: "password",
      label: t("CHNAGE_PASSWORD"),
      component: <ChangePasswordSection />,
      icon: <Iconify icon="solar:key-minimalistic-2-bold-duotone" width={24} />,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
      <Typography mb={4} variant="h3">
        {t("EDIT_PROFILE")}
      </Typography>

      {userLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : (
        <>
          <Tabs
            value={tabs.value}
            onChange={tabs.onChange}
            variant={isDesktop ? "standard" : "fullWidth"}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                icon={tab.icon}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>

          {TABS.map(
            (tab) =>
              tab.value === tabs.value && (
                <Box key={tab.value}>{tab.component}</Box>
              )
          )}
        </>
      )}
    </Container>
  );
}
