import { Iconify } from "@/components/iconify";
import useLocales from "@/hooks/use-locales";
import {
  Button,
  ButtonProps,
  IconButton,
  InputAdornment,
  Stack,
  StackProps,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { useEffect, useState } from "react";

type Props = Omit<TextFieldProps, "value" | "onChange" | "slotProps"> & {
  value?: string;
  isLoading?: boolean;
  onChange: (value: string) => void;
  onInputChange?: (value: string) => void;
  slotProps?: {
    root?: StackProps;
    button?: ButtonProps;
    input?: TextFieldProps;
  };
};

export function SearchBar({
  label,
  value,
  onChange,
  onInputChange,
  isLoading,
  slotProps,
}: Props) {
  const { t } = useLocales();

  const [search, setSearch] = useState<string>(value ?? "");

  useEffect(() => {
    if (typeof value === "undefined") {
      return;
    }

    setSearch(value);
  }, [value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onChange(search);
    }
  };

  return (
    <Stack
      px={3}
      flexGrow={1}
      spacing={2}
      direction="row"
      alignItems="center"
      {...slotProps?.root}
    >
      <TextField
        fullWidth
        size="small"
        value={search}
        label={label ?? t("SEARCH")}
        onKeyDown={handleKeyDown}
        onChange={(event) => {
          const nextValue = event.target.value;
          setSearch(nextValue);
          onInputChange?.(nextValue);
        }}
        slotProps={{
          input: {
            endAdornment: search.length ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearch("");
                    onInputChange?.("");
                  }}
                >
                  <Iconify icon="ic:round-close" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        {...slotProps?.input}
      />

      <Button
        size="medium"
        sx={{ width: 130 }}
        loading={isLoading}
        onClick={() => onChange(search)}
        {...slotProps?.button}
      >
        {t("SEARCH")}
      </Button>
    </Stack>
  );
}
