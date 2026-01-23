"use client";

import { Iconify } from "@/components/iconify";
import { useUser_ConfirmUserMutation } from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { useRouter, useSearchParams } from "@/routes/hooks";
import { getSignInRoute } from "@/routes/paths";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect } from "react";

export default function EmailVerifiedView() {
  const { t } = useLocales();
  const router = useRouter();
  const searchParam = useSearchParams();

  const confirmKey = searchParam.get("ConfirmKey");

  const { mutate, isPending, data: response } = useUser_ConfirmUserMutation();

  const onConfirm = () => {
    mutate({ confirmKey });
  };

  useEffect(() => {
    if (confirmKey) {
      onConfirm();
    }
  }, []);

  const isChecking = isPending || !response?.user_confirmUser?.result;

  return (
    <Stack
      alignItems="center"
      justifyContent="space-evenly"
      sx={{ width: 1, minHeight: "100vh", bgcolor: "#FAF0FA" }}
    >
      <Box
        component="img"
        src="/images/logo.png"
        sx={{ width: 100, height: 100, alignSelf: "center" }}
      />

      <Stack
        p={4}
        width={320}
        alignItems="center"
        sx={{ bgcolor: "white", borderRadius: 2 }}
      >
        <Iconify
          sx={{
            color: "secondary.main",
            width: { xs: 56, md: 80 },
            height: { xs: 56, md: 80 },
          }}
          icon={
            isChecking
              ? "svg-spinners:12-dots-scale-rotate"
              : "solar:check-circle-bold"
          }
        />

        <Typography
          mt={1}
          fontWeight={500}
          textAlign="center"
          fontSize={{ xs: 18, md: 24 }}
        >
          {isChecking
            ? "We are setting things up for you, please wait ..."
            : t("EMAIL_CONFIRM")}
        </Typography>
      </Stack>

      <Button
        sx={{ width: 320 }}
        loading={isChecking}
        loadingIndicator="Verifying ..."
        onClick={() => router.replace(getSignInRoute())}
      >
        {t("SIGN_IN2")}
      </Button>
    </Stack>
  );
}
