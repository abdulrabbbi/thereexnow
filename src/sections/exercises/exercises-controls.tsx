"use client";

import { Iconify } from "@/components/iconify";
import { Categories } from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { useResponsive } from "@/hooks/use-responsive";
import { HEADER } from "@/layouts/config-layout";
import { hideScrollY } from "@/theme/styles";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ExercisesNav } from "./exercises-nav";
import { ExercisesRoutineActions } from "./exercises-routine-actions";
import { ExercisesSortSelect, ExercisesSortType } from "./exercises-sort-select";

type Props = {
  categories: Array<Categories>;
  source?: "exercises" | "favorites";
  categoryId?: string;
  subCategoryId?: string;
  keyword: string;
  sortBy: ExercisesSortType;
  isFetching?: boolean;
  onKeywordChange: (value: string) => void;
  onSortChange: (value: ExercisesSortType) => void;
  onResetPage?: VoidFunction;
};

export const ExercisesControls = memo(function ExercisesControls({
  categories,
  source = "exercises",
  categoryId,
  subCategoryId,
  keyword,
  sortBy,
  isFetching,
  onKeywordChange,
  onSortChange,
  onResetPage,
}: Props) {
  const { t } = useLocales();

  const mdUp = useResponsive("up", "md");
  const lgUp = useResponsive("up", "lg");
  const mdOnly = mdUp && !lgUp;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mdCategoriesOpen, setMdCategoriesOpen] = useState(false);

  const [searchInput, setSearchInput] = useState(keyword);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [focusSearchOnOpen, setFocusSearchOnOpen] = useState(false);

  const activeFiltersCount = useMemo(() => {
    return (
      Number(!!categoryId) +
      Number(!!subCategoryId) +
      Number(!!keyword) +
      Number(sortBy !== ExercisesSortType.DEFAULT)
    );
  }, [categoryId, subCategoryId, keyword, sortBy]);

  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

  useEffect(() => {
    const handle = setTimeout(() => {
      const next = searchInput.trim();
      if (next !== keyword) {
        onResetPage?.();
        onKeywordChange(next);
      }
    }, 400);

    return () => clearTimeout(handle);
  }, [searchInput, keyword, onKeywordChange, onResetPage]);

  // Close irrelevant drawers when resizing across breakpoints.
  useEffect(() => {
    if (mdUp) setMobileFiltersOpen(false);
    if (lgUp) setMdCategoriesOpen(false);
  }, [mdUp, lgUp]);

  useEffect(() => {
    if (!mobileFiltersOpen || !focusSearchOnOpen) return;
    // Allow Drawer mount + transition before focusing.
    const id = window.setTimeout(() => {
      searchInputRef.current?.focus();
      setFocusSearchOnOpen(false);
    }, 50);
    return () => window.clearTimeout(id);
  }, [mobileFiltersOpen, focusSearchOnOpen]);

  const sortLabel = useMemo(() => {
    switch (sortBy) {
      case ExercisesSortType["A-Z"]:
        return t("A_Z");
      case ExercisesSortType.POPULAR:
        return t("POPULAR");
      default:
        return t("DEFAULT");
    }
  }, [sortBy, t]);

  const openMobileFilters = (opts?: { focusSearch?: boolean }) => {
    if (opts?.focusSearch) setFocusSearchOnOpen(true);
    setMobileFiltersOpen(true);
  };

  const closeMobileFilters = () => setMobileFiltersOpen(false);
  const openMdCategories = () => setMdCategoriesOpen(true);
  const closeMdCategories = () => setMdCategoriesOpen(false);

  const handleSortChange = (value: ExercisesSortType) => {
    onResetPage?.();
    onSortChange(value);
  };

  const SearchField = (
    <TextField
      fullWidth
      size="small"
      value={searchInput}
      label={t("SEARCH_EXERCISE")}
      inputRef={searchInputRef}
      onChange={(e) => setSearchInput(e.target.value)}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              {isFetching && !!keyword ? (
                <Iconify icon="svg-spinners:90-ring-with-bg" width={18} />
              ) : null}
              {searchInput.length ? (
                <IconButton
                  edge="end"
                  aria-label="Clear search"
                  onClick={() => setSearchInput("")}
                  size="small"
                >
                  <Iconify icon="ic:round-close" width={18} />
                </IconButton>
              ) : null}
            </InputAdornment>
          ),
        },
      }}
    />
  );

  if (!mdUp) {
    return (
      <>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ minWidth: 0 }}
        >
          <Button
            size="small"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="solar:filters-bold-duotone" />}
            onClick={() => openMobileFilters()}
            sx={{ flexShrink: 0, justifyContent: "flex-start" }}
          >
            {t("FILTERS")}
          </Button>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
              noWrap
            >
              {activeFiltersCount ? `${activeFiltersCount} ${t("FILTERS")}` : ""}
              {sortBy !== ExercisesSortType.DEFAULT ? ` • ${t("SORT")}: ${sortLabel}` : ""}
            </Typography>
          </Box>

          <IconButton
            size="small"
            aria-label={t("SEARCH")}
            onClick={() => openMobileFilters({ focusSearch: true })}
          >
            <Iconify icon="eva:search-fill" />
          </IconButton>
        </Stack>

        <Drawer
          anchor="bottom"
          open={mobileFiltersOpen}
          onClose={closeMobileFilters}
          PaperProps={{
            sx: {
              maxHeight: "85svh",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">{t("FILTERS")}</Typography>
            <IconButton onClick={closeMobileFilters} aria-label={t("CLOSE")}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Box>

          <Divider />

          <Box sx={{ p: 2, flex: 1, minHeight: 0, overflow: "auto" }}>
            <Stack spacing={2} sx={{ minWidth: 0 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {t("CATEGORIES")}
                </Typography>
                <Box sx={{ minWidth: 0, ...hideScrollY }}>
                  <ExercisesNav
                    data={categories}
                    source={source}
                    onItemClick={closeMobileFilters}
                  />
                </Box>
              </Box>

              <ExercisesSortSelect value={sortBy} onChange={handleSortChange} />

              {SearchField}

              <ExercisesRoutineActions onActionCompleted={closeMobileFilters} />
            </Stack>
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <Grid container spacing={2} sx={{ minWidth: 0 }}>
        {mdOnly ? (
          <Grid size={{ xs: 12, md: 3 }} sx={{ minWidth: 0 }}>
            <Button
              fullWidth
              size="small"
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="eva:menu-2-fill" />}
              onClick={openMdCategories}
              sx={{ justifyContent: "flex-start" }}
            >
              {t("CATEGORIES")}
            </Button>
          </Grid>
        ) : null}

        <Grid size={{ xs: 12, md: 3 }} sx={{ minWidth: 0 }}>
          <ExercisesSortSelect value={sortBy} onChange={handleSortChange} />
        </Grid>

        <Grid size={{ xs: 12, md: mdOnly ? 6 : 9 }} sx={{ minWidth: 0 }}>
          {SearchField}
        </Grid>

        <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
          <ExercisesRoutineActions />
        </Grid>
      </Grid>

      <Drawer
        open={mdCategoriesOpen}
        onClose={closeMdCategories}
        PaperProps={{
          sx: {
            width: { xs: "85vw", sm: 360 },
            maxWidth: 360,
            display: "flex",
            flexDirection: "column",
            mt: { xs: `${HEADER.H_MOBILE}px`, md: `${HEADER.H_DESKTOP}px` },
            height: {
              xs: `calc(100% - ${HEADER.H_MOBILE}px)`,
              md: `calc(100% - ${HEADER.H_DESKTOP}px)`,
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">{t("CATEGORIES")}</Typography>
          <IconButton onClick={closeMdCategories} aria-label={t("CLOSE")}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={{ p: 2, flex: 1, minHeight: 0, minWidth: 0, ...hideScrollY }}>
          <ExercisesNav
            data={categories}
            source={source}
            onItemClick={closeMdCategories}
          />
        </Box>
      </Drawer>
    </>
  );
});
