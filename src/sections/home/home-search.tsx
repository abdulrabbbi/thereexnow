import useLocales from "@/hooks/use-locales";
import { useRouter } from "@/routes/hooks";
import { getCategoriesRoute } from "@/routes/paths";
import { Container } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchBar } from "../common/search-bar";

const SEARCH_DEBOUNCE_MS = 400;

export function HomeSearch() {
  const { t } = useLocales();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const lastNavigatedKeywordRef = useRef("");

  const navigateByKeyword = useCallback(
    (value: string) => {
      const keyword = value.trim();

      if (!keyword.length || keyword === lastNavigatedKeywordRef.current) {
        return;
      }

      lastNavigatedKeywordRef.current = keyword;
      router.push(getCategoriesRoute({ keyword }));
    },
    [router]
  );

  const onChange = useCallback(
    (keyword: string) => {
      navigateByKeyword(keyword);
    },
    [navigateByKeyword]
  );

  useEffect(() => {
    if (!searchValue.trim().length) {
      lastNavigatedKeywordRef.current = "";
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigateByKeyword(searchValue);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [navigateByKeyword, searchValue]);

  return (
    <Container maxWidth="sm" sx={{ px: 0 }}>
      <SearchBar
        value={searchValue}
        onChange={onChange}
        onInputChange={setSearchValue}
        label={t("SEARCH_EXERCISE")}
        slotProps={{
          root: {
            px: 0,
            mb: 0,
          },
          button: { sx: { width: { xs: 110, sm: 130 } } },
        }}
      />
    </Container>
  );
}
