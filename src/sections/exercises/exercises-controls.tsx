"use client";

import { Iconify } from "@/components/iconify";
import { Categories } from "@/graphql/generated";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import useLocales from "@/hooks/use-locales";
import { useResponsive } from "@/hooks/use-responsive";
import { HEADER } from "@/layouts/config-layout";
import { SearchBar } from "@/sections/common/search-bar";
import { hideScrollY } from "@/theme/styles";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExercisesTopSearch } from "./components/exercises-top-search";
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
  const categoriesScrollRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearchInput = useDebouncedValue(searchInput.trim(), 400);
  const lastAppliedKeywordRef = useRef(keyword);

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
    lastAppliedKeywordRef.current = keyword;
  }, [keyword]);

  const applyKeyword = useCallback(
    (value: string) => {
      const nextKeyword = value.trim();

      if (nextKeyword === lastAppliedKeywordRef.current) {
        return;
      }

      lastAppliedKeywordRef.current = nextKeyword;
      onResetPage?.();
      onKeywordChange(nextKeyword);
    },
    [onKeywordChange, onResetPage],
  );

  useEffect(() => {
    applyKeyword(debouncedSearchInput);
  }, [applyKeyword, debouncedSearchInput]);

  // Close irrelevant drawers when resizing across breakpoints.
  useEffect(() => {
    if (mdUp) setMobileFiltersOpen(false);
    if (lgUp) setMdCategoriesOpen(false);
  }, [mdUp, lgUp]);

  useEffect(() => {
    if (!mobileFiltersOpen) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      categoriesScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });

    return () => cancelAnimationFrame(frameId);
  }, [mobileFiltersOpen]);

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

  const openMobileFilters = () => setMobileFiltersOpen(true);
  const closeMobileFilters = () => setMobileFiltersOpen(false);
  const openMdCategories = () => setMdCategoriesOpen(true);
  const closeMdCategories = () => setMdCategoriesOpen(false);

  const handleSortChange = (value: ExercisesSortType) => {
    onResetPage?.();
    onSortChange(value);
  };

  const handleSearchSubmit = useCallback(
    (value: string) => {
      const nextKeyword = value.trim();
      setSearchInput(nextKeyword);
      applyKeyword(nextKeyword);
    },
    [applyKeyword],
  );

  const desktopSearchField = (
    <SearchBar
      value={searchInput}
      onChange={handleSearchSubmit}
      onInputChange={setSearchInput}
      isLoading={!!keyword && isFetching}
      label={t("SEARCH_EXERCISE")}
      slotProps={{
        root: { px: 0, minWidth: 0 },
      }}
    />
  );

  if (!mdUp) {
    return (
      <>
        <ExercisesTopSearch
          value={searchInput}
          isLoading={!!keyword && isFetching}
          onSearchChange={setSearchInput}
          onSearchSubmit={handleSearchSubmit}
          leftSlot={
            <>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                startIcon={<Iconify icon="solar:filters-bold-duotone" />}
                onClick={openMobileFilters}
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
                  {sortBy !== ExercisesSortType.DEFAULT
                    ? ` • ${t("SORT")}: ${sortLabel}`
                    : ""}
                </Typography>
              </Box>
            </>
          }
        />

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
              overflow: "hidden",
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

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              minWidth: 0,
              p: 2,
              pb: "max(12px, env(safe-area-inset-bottom))",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
            }}
            ref={categoriesScrollRef}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t("CATEGORIES")}
            </Typography>
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                bgcolor: "background.paper",
                pt: 1,
                pb: 1.25,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <ExercisesSortSelect value={sortBy} onChange={handleSortChange} />
              <Box sx={{ mt: 1.5 }}>
                <ExercisesRoutineActions
                  variant="mobile"
                  onActionCompleted={closeMobileFilters}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <ExercisesNav
                data={categories}
                source={source}
                onItemClick={closeMobileFilters}
              />
            </Box>
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
          {desktopSearchField}
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
