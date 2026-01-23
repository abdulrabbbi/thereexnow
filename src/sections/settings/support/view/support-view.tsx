"use client";

import { Field, Form } from "@/components/hook-form";
import { GLOBAL_CONFIG } from "@/global-config";
import { useUser_SendEmailForSupportMutation } from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { useUser } from "@/hooks/use-user";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

const formSchema = Yup.object().shape({
  title: Yup.string().required(),
  message: Yup.string().required(),
});

const defaultValues = {
  title: "",
  message: "",
};

export default function SupportView() {
  const { t } = useLocales();
  const { userData } = useUser();
  const { mutate, isPending } = useUser_SendEmailForSupportMutation();

  const methods = useForm({ defaultValues, resolver: yupResolver(formSchema) });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (values) => {
    mutate(
      {
        input: {
          subject: values.title,
          to: GLOBAL_CONFIG.supportMail,
          content: `${values.message} <br /><br /> from: ${userData.email}`,
        },
      },
      {
        onSuccess: (res) => {
          if (res.user_sendEmailForSupport?.status.code === 1) {
            toast.info("Your message has been sent.");
            reset(defaultValues);
          } else {
            toast.warning(res.user_sendEmailForSupport?.status.value);
          }
        },
      }
    );
  });

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, md: 2 } }}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography mb={1} variant="h3">
            {t("SUPPORT")}
          </Typography>
          <Typography mb={4} variant="subtitle1" color="grey.700">
            {t("WE_CARE")}
          </Typography>

          <Form methods={methods} onSubmit={onSubmit}>
            <Field.Text name="title" label={t("TITLE")} />

            <Field.Text
              rows={4}
              multiline
              name="message"
              sx={{ my: 3 }}
              label={t("MESSAGE")}
            />

            <Button fullWidth type="submit" loading={isPending}>
              {t("SEND2")}
            </Button>
          </Form>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            alt="Support"
            component="img"
            sx={{ width: 1 }}
            src={`/images/support.svg`}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
