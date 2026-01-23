import type { AutocompleteProps } from "@mui/material/Autocomplete";
import type { TextFieldProps } from "@mui/material/TextField";

import useLocales from "@/hooks/use-locales";
import { Field } from "../hook-form";

type Value = string;

export type AutocompleteBaseProps = Omit<
  AutocompleteProps<any, boolean, boolean, boolean>,
  "options" | "renderOption" | "renderInput" | "renderTags" | "getOptionLabel"
>;

export type LanguageSelectProps = AutocompleteBaseProps & {
  label?: string;
  error?: boolean;
  placeholder?: string;
  hiddenLabel?: boolean;
  helperText?: React.ReactNode;
  variant?: TextFieldProps["variant"];
};

export default function LanguageSelect({ ...rest }: LanguageSelectProps) {
  const { t, allLang } = useLocales();

  const options = allLang.map((lang) => lang.label);

  return (
    <Field.Autocomplete
      name="language"
      label={t("LANGUAGE")}
      options={options.map((option) => option)}
      renderOption={(props, option) => (
        <li {...props} key={option}>
          {option}
        </li>
      )}
      {...rest}
    />
  );
}
