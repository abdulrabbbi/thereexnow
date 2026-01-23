import useLocales from "@/hooks/use-locales";
import { useRouter } from "@/routes/hooks";
import { getCategoriesRoute } from "@/routes/paths";
import { Container } from "@mui/material";
import { SearchBar } from "../common/search-bar";

export function HomeSearch() {
  const { t } = useLocales();
  const router = useRouter();

  const onChange = (keyword: string) => {
    if (keyword.length) {
      router.push(getCategoriesRoute({ keyword }));
    }
  };

  return (
    <Container maxWidth="sm">
      <SearchBar
        onChange={onChange}
        label={t("SEARCH_EXERCISE")}
        slotProps={{
          root: { px: 0, mb: 2 },
        }}
      />
    </Container>
  );
}
