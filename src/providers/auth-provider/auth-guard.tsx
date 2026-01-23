"use client";

import { Iconify } from "@/components/iconify";
import { SplashScreen } from "@/components/loading-screen";
import { useAuth } from "@/hooks/use-auth";
import useLocales from "@/hooks/use-locales";
import { HEADER } from "@/layouts/config-layout";
import { usePathname, useRouter, useSearchParams } from "@/routes/hooks";
import { getSignInRoute } from "@/routes/paths";
import { Button, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const { authenticated, loading } = useAuth();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  if (!authenticated) {
    return <GuardContainer />;
  }

  return <>{children}</>;
}

function GuardContainer() {
  const { t } = useLocales();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const onRedirectToLogin = () => {
    const href = `${getSignInRoute()}?${createQueryString("returnTo", pathname)}`;
    router.replace(href);
  };

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        height: `calc(100vh - ${HEADER.H_DESKTOP}px)`,
      }}
    >
      <Typography variant="h5">{t("LOG_IN_TO_USE_FEATURES")}</Typography>

      <Button
        variant="text"
        onClick={onRedirectToLogin}
        startIcon={<Iconify icon="solar:login-2-line-duotone" />}
      >
        {t("SIGN_IN")}
      </Button>
    </Stack>
  );
}
