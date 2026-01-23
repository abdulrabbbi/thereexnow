import { useCallback, useState } from "react";

export function usePagination() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);

  const onChangePerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPage(0);
      setPerPage(parseInt(event.target.value, 10));
    },
    []
  );

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    page,
    perPage,
    //
    onResetPage,
    onChangePage,
    onChangePerPage,
  };
}
