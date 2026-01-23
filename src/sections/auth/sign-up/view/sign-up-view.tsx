"use client";

import { Field, Form } from "@/components/hook-form";
import { schemaHelper } from "@/components/hook-form/schema-helper";
import { Iconify } from "@/components/iconify";
import { useSignUp } from "@/hooks/helpers/user";
import { useAuth } from "@/hooks/use-auth";
import useLocales from "@/hooks/use-locales";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputAdornment, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { AuthForm } from "../../auth-form";

const SignInSchema = Yup.object().shape({
  email: schemaHelper.email,
  password: schemaHelper.password,
  confirmPassword: schemaHelper.confirmPassword,
});

const defaultValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignInView() {
  const { t } = useLocales();
  const { onSignUp } = useSignUp();
  const { signUpWithEmailAndPassword } = useAuth();

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
      const firebaseUser = await signUpWithEmailAndPassword(data);

      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();

        await onSignUp({ token, email: data.email, isSocial: false });
      }
    } catch (error) {
      console.error(error);
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

      <Field.Text
        name="confirmPassword"
        placeholder="123456789"
        label={t("CONFIRM_PASSWORD")}
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

      <Button fullWidth type="submit" loading={isSubmitting}>
        {t("SIGN_UP2")}
      </Button>
    </Stack>
  );

  return (
    <AuthForm title="Sign up">
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </AuthForm>
  );
}
