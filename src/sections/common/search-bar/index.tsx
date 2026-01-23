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
  isLoading,
  slotProps,
}: Props) {
  const { t } = useLocales();

  const [search, setSearch] = useState<string>(value ?? "");

  useEffect(() => {
    if (!search.length && value && value.length) {
      onChange("");
    }
  }, [search]);

  useEffect(() => {
    if (value !== search) {
      setSearch(value ?? "");
    }
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
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            endAdornment: search.length ? (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearch("")}>
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
