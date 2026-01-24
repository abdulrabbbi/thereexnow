"use client";

import { Iconify } from "@/components/iconify";
import { useUser_ConfirmUserMutation } from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { useRouter, useSearchParams } from "@/routes/hooks";
import { getSignInRoute } from "@/routes/paths";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect } from "react";

// Avoid double-confirm in React StrictMode (dev) where effects run twice on mount.
const confirmedKeys = new Set<string>();

export default function EmailVerifiedView() {
  const { t } = useLocales();
  const router = useRouter();
  const searchParam = useSearchParams();

  const confirmKey = searchParam.get("ConfirmKey");

  const { mutate, isPending, data: response } = useUser_ConfirmUserMutation();

  useEffect(() => {
    if (!confirmKey) return;
    if (confirmedKeys.has(confirmKey)) return;

    confirmedKeys.add(confirmKey);
    mutate({ confirmKey });
  }, [confirmKey, mutate]);

  const isChecking = isPending || !response?.user_confirmUser?.result;

  return (
    <Stack
      spacing={4}
      alignItems="center"
      justifyContent="center"
      sx={{ width: 1, minHeight: "100svh", bgcolor: "#FAF0FA", p: { xs: 2, sm: 3, md: 4 } }}
    >
      <Box
        component="img"
        src="/images/logo.png"
        sx={{ width: { xs: 88, sm: 100 }, height: { xs: 88, sm: 100 }, alignSelf: "center" }}
      />

      <Stack
        p={{ xs: 3, sm: 4 }}
        width={1}
        maxWidth={{ xs: 420, sm: 520, md: 620 }}
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
        fullWidth
        size="large"
        sx={{ height: 48, maxWidth: { xs: 420, sm: 520, md: 620 } }}
        loading={isChecking}
        loadingIndicator="Verifying ..."
        onClick={() => router.replace(getSignInRoute())}
      >
        {t("SIGN_IN2")}
      </Button>
    </Stack>
  );
}
