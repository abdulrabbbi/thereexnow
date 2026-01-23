"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { SharedExercisesList } from "@/components/share-dialogs/exercises-list";
import {
  usePrintData_GetAllQuery,
  useUser_IncrementPrintCountMutation,
} from "@/graphql/generated";
import { useSetState } from "@/hooks/use-set-state";
import { useSearchParams } from "@/routes/hooks";
import { HtmlStateType } from "@/types";
import { Button, Container, Stack } from "@mui/material";
import { useEffect, useRef } from "react";

export default function HtmlView() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const { state, setState } = useSetState<HtmlStateType>({
    note: "",
    author: "",
    exercises: [],
    user: undefined,
  });

  const { data, isLoading } = usePrintData_GetAllQuery({
    where: { id: { eq: Number(id) } },
  });

  const result = data?.printData_getAll?.result?.items;

  useEffect(() => {
    if (result?.length! > 0) {
      const parsedData = JSON.parse(result?.[0]?.data!) as HtmlStateType;

      setState({
        user: parsedData.user,
        note: parsedData.note ?? "",
        author: parsedData.author ?? "",
        exercises: parsedData.exercises ?? [],
      });
    }
  }, [result]);

  const {
    mutate: incrementPrintCountMutation,
    isPending: incrementPrintCountLoading,
  } = useUser_IncrementPrintCountMutation();

  const contentRef = useRef<HTMLDivElement>(null);

  const onPrint = () => {
    incrementPrintCountMutation(
      {},
      {
        onSuccess: (data) => {
          window.print();
        },
      }
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }} className="print-area-Container">
      {isLoading ? (
        <LoadingScreen sx={{ height: "90svh" }} />
      ) : (
        <Stack>
          <SharedExercisesList
            ref={contentRef}
            note={state.note}
            author={state.author}
            exercises={state.exercises}
          />

          <Button
            color="inherit"
            onClick={onPrint}
            variant="outlined"
            sx={{ width: 120, ml: "auto" }}
            loading={incrementPrintCountLoading}
            className="hide-in-print"
          >
            Print
          </Button>
        </Stack>
      )}
    </Container>
  );
}
