import { useLoginModal } from "@/components/login-modal/use-login-modal";
import { useBoard } from "@/hooks/use-board";
import { useBoolean } from "@/hooks/use-boolean";
import useLocales from "@/hooks/use-locales";
import { useUser } from "@/hooks/use-user";
import { RouterLink } from "@/routes/components";
import { getBoardDetailsRoute } from "@/routes/paths";
import { Box, Button } from "@mui/material";
import { SaveRoutineModal } from "../board/save-routine";
import { SaveNoteDialog } from "./save-note-dialog";

type Props = {
  onActionCompleted?: VoidFunction;
};

export function ExercisesRoutineActions({ onActionCompleted }: Props) {
  const board = useBoard();
  const { t } = useLocales();
  const { userData } = useUser();
  const saveRoutine = useBoolean();
  const addNoteDialog = useBoolean();
  const withLoginModal = useLoginModal();

  const disabled = !board.data.length;

  const onAddNote = () => {
    if (!userData) {
      return withLoginModal.run();
    }

    addNoteDialog.onTrue();
  };

  const onSaveRoutine = () => {
    if (!userData) {
      return withLoginModal.run();
    }

    saveRoutine.onTrue();
  };

  const handleCloseNoteDialog = () => {
    addNoteDialog.onFalse();
    onActionCompleted?.();
  };

  const handleCloseSaveRoutineFlow = () => {
    saveRoutine.onFalse();
    onActionCompleted?.();
  };

  return (
    <>
      <Box
        sx={{
          minWidth: 0,
          width: 1,
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        <Button
          fullWidth
          size="medium"
          color="inherit"
          variant="outlined"
          onClick={onAddNote}
          disabled={disabled}
          sx={{ minWidth: 0 }}
        >
          {t("ADD_NOTE")}
        </Button>

        <Button
          fullWidth
          size="medium"
          color="inherit"
          variant="outlined"
          disabled={disabled}
          onClick={onSaveRoutine}
          sx={{ minWidth: 0 }}
        >
          {t("SAVE_AZ_A_ROUTINE")}
        </Button>

        <Button
          fullWidth
          size="medium"
          color="inherit"
          variant="outlined"
          disabled={disabled}
          LinkComponent={RouterLink}
          href={getBoardDetailsRoute()}
          onClick={onActionCompleted}
          sx={{ textAlign: "center", minWidth: 0 }}
        >
          {t("SEE_DETAILS")}
        </Button>
      </Box>

      <SaveNoteDialog
        open={addNoteDialog.value}
        onClose={handleCloseNoteDialog}
      />

      <SaveRoutineModal
        open={saveRoutine.value}
        onClose={saveRoutine.onFalse}
        onFlowEnd={handleCloseSaveRoutineFlow}
      />
    </>
  );
}
