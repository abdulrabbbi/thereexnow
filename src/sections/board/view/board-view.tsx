"use client";

import { RoutineIcon } from "@/assets/icons/routine-icon";
import { useLoginModal } from "@/components/login-modal/use-login-modal";
import { useBoard } from "@/hooks/use-board";
import { useBoolean } from "@/hooks/use-boolean";
import useLocales from "@/hooks/use-locales";
import { useShare } from "@/hooks/use-share";
import { useUser } from "@/hooks/use-user";
import MiniNavLayout from "@/layouts/mini-nav-layout";
import { MiniNavItemsType } from "@/layouts/mini-nav-layout/types";
import { SimplifiedExercise } from "@/types";
import { Container, Divider, Stack, TextField } from "@mui/material";
import { BoardCard } from "../board-card";
import { EmptyBoard } from "../empty-board";
import { SaveRoutineModal } from "../save-routine";

export default function BoardView() {
  const board = useBoard();
  const share = useShare();
  const { t } = useLocales();
  const { userData } = useUser();
  const saveRoutine = useBoolean();
  const withLoginModal = useLoginModal();

  const boardExercises = board.data.map(
    (item) => item.exercise
  ) as Array<SimplifiedExercise>;

  const navItems: Array<MiniNavItemsType> = [
    {
      title: "Routine",
      icon: <RoutineIcon size={38} />,
      onClick: () => {
        if (!userData) {
          return withLoginModal.run();
        }

        saveRoutine.onTrue();
      },
    },
    {
      ...share.email,
      onClick: () =>
        share.email.onClick({
          note: board.note,
          exercises: boardExercises,
        }),
    },
    {
      ...share.print,
      onClick: () =>
        share.print.onClick({
          note: board.note,
          exercises: boardExercises,
        }),
    },
    {
      ...share.qrCode,
      onClick: () =>
        share.qrCode.onClick({
          note: board.note,
          exercises: boardExercises,
        }),
    },
  ];

  if (!board.data.length) {
    return <EmptyBoard />;
  }

  return (
    <MiniNavLayout navItems={navItems}>
      <Container maxWidth="lg">
        <TextField
          rows={4}
          fullWidth
          multiline
          value={board.note}
          label={t("BOARD_NOTE")}
          onChange={(e) => board.onAddNote(e.target.value)}
        />

        <Stack
          mt={3}
          divider={<Divider orientation="horizontal" sx={{ my: 1 }} />}
        >
          {board.data.map((item) => (
            <BoardCard key={item.exercise?.id} item={item} />
          ))}
        </Stack>
      </Container>

      <SaveRoutineModal
        open={saveRoutine.value}
        onClose={saveRoutine.onFalse}
      />
    </MiniNavLayout>
  );
}
