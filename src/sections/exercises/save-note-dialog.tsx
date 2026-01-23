import { ConfirmDialog } from "@/components/custom-dialog";
import TextareaTranslate from "@/components/textarea-translate";
import { useBoard } from "@/hooks/use-board";
import useLocales from "@/hooks/use-locales";
import { Button, Stack } from "@mui/material";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export function SaveNoteDialog({ open, onClose }: Props) {
  const board = useBoard();
  const { t } = useLocales();

  const [boardNote, setBoardNote] = useState(board.note);

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={t("BOARD_NOTE")}
      cancelProps={{ fullWidth: true, color: "inherit" }}
      content={
        <Stack pt={1}>
          <TextareaTranslate
            description={boardNote}
            onUpdateValue={setBoardNote}
            placeholder={t("NOTE")}
          />
        </Stack>
      }
      action={
        <Button
          fullWidth
          variant="contained"
          disabled={!boardNote.length}
          onClick={() => {
            toast.info(t("NOTE_SUCCSSFULLY_SAVED"));

            board.onAddNote(boardNote);

            onClose();
          }}
        >
          {t("SAVE")}
        </Button>
      }
    />
  );
}
