import { Gender } from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { MenuItem, TextFieldProps } from "@mui/material";
import { RHFTextField } from "./rhf-text-field";

type Props = TextFieldProps & {
  name: string;
};

export default function RHFGenderSelect({ name, ...other }: Props) {
  const { t } = useLocales();

  const GENDERS = [
    { label: t("MALE"), value: Gender.Male },
    { label: t("FEMALE"), value: Gender.Female },
    { label: t("NON_BINARY"), value: Gender.NonBinary },
    { label: t("PREFER_NOT_TO_SAY"), value: Gender.PreferNotToSay },
    { label: t("OTHER"), value: Gender.Other },
  ];

  return (
    <RHFTextField select fullWidth name={name} label="Gender" {...other}>
      {GENDERS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </RHFTextField>
  );
}
