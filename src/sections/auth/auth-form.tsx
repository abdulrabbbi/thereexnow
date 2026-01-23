import AppStoreButtons from "@/components/app-store-buttons";
import useLocales from "@/hooks/use-locales";
import { RouterLink } from "@/routes/components";
import { getSignInRoute, getSignUpRoute } from "@/routes/paths";
import { Box, Link, Stack, Typography } from "@mui/material";
import { PropsWithChildren } from "react";
import { FormDivider } from "./auth-form-divider";
import { FormSocials } from "./auth-form-socials";

type Props = PropsWithChildren<{
  title: "Sign in" | "Sign up";
}>;

export function AuthForm({ title, children }: Props) {
  const { t } = useLocales();

  return (
    <Stack alignItems="stretch">
      <Box
        component="img"
        src="/images/logo.png"
        sx={{ width: 120, height: 120, alignSelf: "center" }}
      />

      <Typography mb={2.5} variant="h5" sx={{ alignSelf: "center" }}>
        {t(title === "Sign in" ? "SIGN_IN" : "SIGN_UP2")}
      </Typography>

      {children}

      <FormDivider label={t("OR")} />

      <FormSocials isSignUp={title === "Sign up"} />

      <Typography
        my={2}
        variant="body2"
        textAlign="center"
        sx={{ color: "text.primary" }}
      >
        {t(title === "Sign in" ? "DONT_HAVE_ACCOUNT" : "ALREADY_HAVE_ACCOUNT")}
        &nbsp;
        <Link
          variant="subtitle2"
          component={RouterLink}
          href={title === "Sign in" ? getSignUpRoute() : getSignInRoute()}
          sx={{ color: "info.main" }}
        >
          {t(title === "Sign in" ? "CREATE_ACCOUNT" : "SIGN_IN")}
        </Link>
      </Typography>

      {title === "Sign in" ? <AppStoreButtons /> : null}
    </Stack>
  );
}
