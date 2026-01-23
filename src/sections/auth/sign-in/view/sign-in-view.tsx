"use client";

import { Field, Form } from "@/components/hook-form";
import { schemaHelper } from "@/components/hook-form/schema-helper";
import { Iconify } from "@/components/iconify";
import { fetcher } from "@/graphql/fetcher";
import {
  User_GetEmailVerifiedDocument,
  User_GetEmailVerifiedQuery,
  User_GetEmailVerifiedQueryVariables,
} from "@/graphql/generated";
import { useSignIn } from "@/hooks/helpers/user";
import { useAuth } from "@/hooks/use-auth";
import useLocales from "@/hooks/use-locales";
import { useSearchParams } from "@/routes/hooks";
import { getResponseError } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputAdornment, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";
import { AuthForm } from "../../auth-form";
import { ForgotPasswordSection } from "../forgot-password-section";

const SignInSchema = Yup.object().shape({
  email: schemaHelper.email,
  password: schemaHelper.password,
});

const defaultValues = {
  email: "",
  password: "",
};

export default function SignInView() {
  const { t } = useLocales();
  const { onSignIn } = useSignIn();
  const searchParams = useSearchParams();
  const { signInWithPassword } = useAuth();

  const returnTo = searchParams.get("returnTo");

  const methods = useForm({
    resolver: yupResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const firebaseUser = await signInWithPassword(data);

      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();

        const res = await fetcher<
          User_GetEmailVerifiedQuery,
          User_GetEmailVerifiedQueryVariables
        >(User_GetEmailVerifiedDocument, {
          userIdInFirebase: firebaseUser.uid,
        })();

        if (res.user_getEmailVerified?.status.code === 1) {
          const response = res.user_getEmailVerified.result;

          if (response?.verifiedInDatabase && response?.verifiedInDatabase) {
            await onSignIn(token);
          } else {
            return toast.info("Email not verified!");
          }
        }
      }
    } catch (error) {
      toast.error(getResponseError(error));
    }
  });

  const renderForm = (
    <Stack spacing={2.5}>
      <Field.Text
        name="email"
        label={t("EMAIL_ADDRESS")}
        placeholder="example@gmail.com"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:letter-bold-duotone" color="info.main" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Field.Text
        name="password"
        label={t("PASSWORD")}
        placeholder="123456789"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:key-bold-duotone" color="warning.main" />
              </InputAdornment>
            ),
          },
        }}
      />

      <ForgotPasswordSection />

      <Button fullWidth type="submit" loading={isSubmitting}>
        {t("SIGN_IN")}
      </Button>
    </Stack>
  );

  return (
    <AuthForm title="Sign in">
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </AuthForm>
  );
}
