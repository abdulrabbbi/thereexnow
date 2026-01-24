"use client";

import { states } from "@/assets/data";
import { ConfirmDialog } from "@/components/custom-dialog";
import { Field, Form } from "@/components/hook-form";
import { clearHeader } from "@/graphql/fetcher";
import {
  Gender,
  PlatformType,
  useUser_DeleteUserMutation,
  useUser_UpdateUserMutation,
} from "@/graphql/generated";
import { useAuth } from "@/hooks/use-auth";
import { useBoolean } from "@/hooks/use-boolean";
import useLocales from "@/hooks/use-locales";
import { useUpload } from "@/hooks/use-upload";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "@/routes/hooks";
import { getSignInRoute } from "@/routes/paths";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";
import { clearCookie } from "@/utils/storage/cookieStorage";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useQueryClient } from "@tanstack/react-query";
import type { CountryCode } from "libphonenumber-js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

const defaultValues = {
  state: "",
  gender: "",
  address: "",
  country: "",
  zipCode: "",
  fullName: "",
  photoUrl: null,
  occupation: "",
  countryName: "",
  phoneNumber: "",
  countryCode: "",
  yearsOfExperience: "",
};

const CompleteProfileSchema = Yup.object().shape({
  address: Yup.string(),
  occupation: Yup.string(),
  countryCode: Yup.string(),
  countryName: Yup.string(),
  gender: Yup.string().required(),
  yearsOfExperience: Yup.string(),
  country: Yup.string().required(),
  fullName: Yup.string().required(),
  phoneNumber: Yup.string().required(),
  photoUrl: Yup.mixed<File | string>().nullable(),
  state: Yup.string().when(["country"], (country, schema) => {
    if (String(country) === "United States") {
      return schema.required("State is required for US users");
    }
    return schema.notRequired();
  }),
  zipCode: Yup.string().when(["country"], (country, schema) => {
    if (String(country) === "United States") {
      return schema.required("Zipcode is required for US users");
    }
    return schema.notRequired();
  }),
});

export default function CompleteProfileView({
  initialValues,
}: {
  initialValues?: Yup.InferType<typeof CompleteProfileSchema>;
}) {
  const { t } = useLocales();
  const router = useRouter();
  const deleteAccount = useBoolean();
  const queryClient = useQueryClient();
  const { uploadFile, isUploading } = useUpload();

  const { mutate: updateUserMutation, isPending: updateUserPending } =
    useUser_UpdateUserMutation();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(CompleteProfileSchema),
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (initialValues) {
      methods.reset(initialValues as any);
    }
  }, [initialValues]);

  const formValues = watch();

  const handleUpdateUser = async (
    params: Yup.InferType<typeof CompleteProfileSchema>
  ) => {
    // UPLOAD USER PHOTO
    let photoUrl: string | null;
    if (params.photoUrl instanceof File) {
      const res = await uploadFile(params.photoUrl);

      photoUrl = res as string;
    } else {
      photoUrl = params.photoUrl ?? null;
    }

    updateUserMutation(
      {
        input: {
          photoUrl,
          state: params.state,
          language: "English",
          address: params.address,
          zipCode: params.zipCode,
          country: params.country,
          fullName: params.fullName,
          occupation: params.occupation,
          platformType: PlatformType.Web,
          phoneNumber: params.phoneNumber,
          gender: params.gender as Gender,
          countryCode: params.countryCode,
          yearsOfExperience: Number(params.yearsOfExperience),
        },
      },
      {
        onSuccess: (res) => {
          if (res.user_updateUser?.status.code === 1) {
            queryClient.invalidateQueries({
              queryKey: ["user_getCurrentUser"],
            });

            if (initialValues) {
              toast.success(t("YOUR_PROFILE_UPDATED"));
            } else {
              router.replace("/");
            }
          } else {
            toast.warning(res.user_updateUser?.status.value);
          }
        },
      }
    );
  };

  const onSubmit = handleSubmit(async (data) => {
    if (data.zipCode) {
      await fetch(`https://ziptasticapi.com/${data.zipCode}`)
        .then((response) => response.json())
        .then(async (json) => {
          if (json.error) {
            toast.error(json.error || "Error in zip code");

            return;
          } else {
            await handleUpdateUser(data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      await handleUpdateUser(data);
    }
  });

  return (
    <Container
      maxWidth="md"
      sx={{
        pb: 10,
        pt: initialValues ? 2 : 10,
        px: { xs: initialValues ? 2 : 3, md: 3 },
      }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <Field.UploadAvatar name="photoUrl" sx={{ mb: 5 }} />

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="fullName" label={t("FULL_NAME")} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Gender name="gender" label={t("GENDER")} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="occupation" label={t("OCCUPATION")} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text name="address" label={t("ADDRESS")} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Field.Text
              name="yearsOfExperience"
              label={t("YEARS_OF_EXPERIENCE")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={1}
              sx={{ minWidth: 0 }}
            >
              <Field.CountrySelect
                fullWidth
                name="country"
                sx={{ flex: 1 }}
                label={t("Country")}
              />

              <Field.Phone
                fullWidth
                country={formValues.countryName as CountryCode | undefined}
                sx={{ flex: 1 }}
                name="phoneNumber"
                label={t("PHONE_NUMBER")}
              />
            </Stack>
          </Grid>

          {formValues.country === "United States" ? (
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={1}
                sx={{ minWidth: 0 }}
              >
                <Field.Text select fullWidth name="state" label={t("STATE")}>
                  {states.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Text>

                <Field.Text name="zipCode" label={t("ZIP_CODE2")} />
              </Stack>
            </Grid>
          ) : null}
        </Grid>
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          sx={{
            mt: 5,
            width: 1,
            justifyContent: { xs: "stretch", sm: "flex-start" },
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Button
            type="submit"
            sx={{ width: { xs: 1, sm: 240, md: 280 } }}
            loading={isUploading || isSubmitting || updateUserPending}
          >
            {t(initialValues ? "SAVE" : "SUBMIT")}
          </Button>

          {initialValues ? (
            <Button
              color="inherit"
              variant="outlined"
              onClick={deleteAccount.onTrue}
              sx={{ width: { xs: 1, sm: 240, md: 280 } }}
            >
              {t("DELETE_ACCOUNT")}
            </Button>
          ) : null}
        </Stack>
      </Form>

      {deleteAccount.value ? (
        <DeleteAccountDialog
          open={deleteAccount.value}
          onClose={deleteAccount.onFalse}
        />
      ) : null}
    </Container>
  );
}

function DeleteAccountDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: VoidFunction;
}) {
  const CONFIRM_KEYWORD = "Delete";

  const router = useRouter();
  const { signOut } = useAuth();
  const { userData } = useUser();
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState("");

  const { mutate, isPending } = useUser_DeleteUserMutation();

  const onDeleteAccount = () => {
    mutate(
      { userId: userData.id },
      {
        onSuccess: async (res) => {
          if (res.user_deleteUser?.status.code === 1) {
            await signOut();

            toast.info(`${userData.fullName} is successfully deleted!`);

            clearHeader();
            queryClient.clear();
            clearCookie(ACCESS_TOKEN_KEY);

            router.push(getSignInRoute());
          } else {
            toast.warning(res.user_deleteUser?.status.value);
          }
        },
      }
    );
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title="Delete account"
      cancelProps={{ color: "inherit" }}
      content={
        <Stack>
          <Typography>
            Please type{" "}
            <Box
              component="span"
              sx={{ fontWeight: 500, color: "primary.main" }}
            >
              {CONFIRM_KEYWORD}
            </Box>{" "}
            to confirm.
          </Typography>

          <TextField
            size="medium"
            sx={{ mt: 2 }}
            value={confirm}
            placeholder="Type here ..."
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Stack>
      }
      action={
        <Button
          color="primary"
          loading={isPending}
          onClick={onDeleteAccount}
          disabled={confirm !== CONFIRM_KEYWORD}
        >
          Delete
        </Button>
      }
    />
  );
}
