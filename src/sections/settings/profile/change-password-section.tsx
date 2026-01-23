import { Field, Form } from "@/components/hook-form";
import { schemaHelper } from "@/components/hook-form/schema-helper";
import { useAuth } from "@/hooks/use-auth";
import useLocales from "@/hooks/use-locales";
import { useUser } from "@/hooks/use-user";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, Stack } from "@mui/material";
import { FirebaseError } from "firebase/app";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

const defaultValues = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

const formSchema = Yup.object().shape({
  currentPassword: schemaHelper.password,
  password: schemaHelper.password,
  confirmPassword: schemaHelper.confirmPassword,
});

export function ChangePasswordSection() {
  const { t } = useLocales();
  const { userData } = useUser();
  const { user, reloadUser } = useAuth();

  const methods = useForm({ defaultValues, resolver: yupResolver(formSchema) });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (params) => {
    if (user && userData.email) {
      try {
        const credential = EmailAuthProvider.credential(
          userData?.email!,
          params.currentPassword
        );

        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, params.password);

        await reloadUser();

        toast.success("Password changed.");

        methods.reset(defaultValues);
      } catch (error) {
        if (error instanceof FirebaseError) {
          toast.error(error.message);
        }
      }
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Container maxWidth="xs" component={Stack} spacing={3} sx={{ py: 8 }}>
        <Field.Text name="currentPassword" label={t("CURRENT_PASSWORD")} />
        <Field.Text name="password" label={t("PASSWORD2")} />
        <Field.Text name="confirmPassword" label={t("CONFIRM_PASSWORD")} />

        <Button type="submit" loading={isSubmitting}>
          {t("SAVE")}
        </Button>
      </Container>
    </Form>
  );
}
