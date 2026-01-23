import useLocales from "@/hooks/use-locales";
import { MenuItem, TextField, TextFieldProps } from "@mui/material";

export enum ExercisesSortType {
  "A-Z" = "A-Z",
  "POPULAR" = "POPULAR",
  "DEFAULT" = "DEFAULT",
}

type Props = Omit<TextFieldProps, "onChange"> & {
  onChange: (value: ExercisesSortType) => void;
};

export function ExercisesSortSelect({ value, onChange, ...rest }: Props) {
  const { t } = useLocales();

  const SORTS = [
    { label: t("DEFAULT"), value: ExercisesSortType.DEFAULT },
    { label: t("A_Z"), value: ExercisesSortType["A-Z"] },
    { label: t("POPULAR"), value: ExercisesSortType.POPULAR },
  ];

  return (
    <TextField
      select
      fullWidth
      size="small"
      value={value}
      label={t("SORT")}
      onChange={(e) => onChange(e.target.value as ExercisesSortType)}
      {...rest}
    >
      {SORTS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
