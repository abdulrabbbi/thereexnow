"use client";

import useLocales from "@/hooks/use-locales";
import { Button, Stack, TextField } from "@mui/material";
import { KeyboardEvent } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  onAdd: () => void;
  loading?: boolean;
};

export function RoutinesToolbar({
  value,
  onChange,
  onSearch,
  onAdd,
  loading,
}: Props) {
  const { t } = useLocales();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch();
    }
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      gap={2}
      alignItems={{ md: "center" }}
      sx={{ width: 1, minWidth: 0 }}
    >
      <TextField
        type="text"
        variant="outlined"
        hiddenLabel
        size="small"
        fullWidth
        value={value}
        placeholder={t("SEARCH_ROUTINE")}
        onKeyDown={handleKeyDown}
        onChange={(event) => onChange(event.target.value)}
        InputProps={{
          sx: {
            minHeight: 44,
            bgcolor: "background.paper",
          },
        }}
        sx={{ flex: 1, minWidth: 0, width: "100%" }}
      />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={2}
        sx={{
          width: { xs: 1, md: "auto" },
          minWidth: 0,
          flexShrink: 0,
        }}
      >
        <Button
          variant="contained"
          disabled={loading}
          onClick={onSearch}
          sx={{
            whiteSpace: "nowrap",
            minWidth: 0,
            width: { xs: "100%", sm: "auto" },
            flex: { sm: 1, md: "0 0 auto" },
          }}
        >
          {t("SEARCH")}
        </Button>

        <Button
          variant="contained"
          onClick={onAdd}
          sx={{
            whiteSpace: "nowrap",
            minWidth: 0,
            width: { xs: "100%", sm: "auto" },
            flex: { sm: 1, md: "0 0 auto" },
          }}
        >
          {t("ADD_A_NEW_ROUTINE")}
        </Button>
      </Stack>
    </Stack>
  );
}
