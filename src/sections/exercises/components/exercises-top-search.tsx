"use client";

import { Iconify } from "@/components/iconify";
import useLocales from "@/hooks/use-locales";
import { SearchBar } from "@/sections/common/search-bar";
import { Box, Collapse, IconButton, Stack } from "@mui/material";
import { ReactNode, useCallback, useState } from "react";

type Props = {
  value: string;
  isLoading?: boolean;
  leftSlot?: ReactNode;
  onSearchChange: (keyword: string) => void;
  onSearchSubmit: (keyword: string) => void;
};

export function ExercisesTopSearch({
  value,
  isLoading,
  leftSlot,
  onSearchChange,
  onSearchSubmit,
}: Props) {
  const { t } = useLocales();
  const [open, setOpen] = useState(false);

  const handleToggleOpen = useCallback(() => {
    setOpen((currentOpen) => !currentOpen);
  }, []);

  const handleSubmit = useCallback(
    (keyword: string) => {
      onSearchSubmit(keyword);
      setOpen(false);
    },
    [onSearchSubmit],
  );

  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", gap: 1, alignItems: "center" }}>
          {leftSlot}
        </Box>

        <IconButton
          size="small"
          aria-label={open ? t("CLOSE") : t("SEARCH")}
          onClick={handleToggleOpen}
        >
          <Iconify icon={open ? "eva:close-fill" : "eva:search-fill"} />
        </IconButton>
      </Stack>

      <Collapse in={open} unmountOnExit>
        <SearchBar
          value={value}
          isLoading={isLoading}
          onChange={handleSubmit}
          onInputChange={onSearchChange}
          slotProps={{
            root: { px: 0, spacing: 1, minWidth: 0 },
            button: { sx: { width: { xs: 100, sm: 120 } } },
          }}
        />
      </Collapse>
    </Stack>
  );
}
