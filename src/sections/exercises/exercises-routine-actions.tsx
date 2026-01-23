import { useLoginModal } from "@/components/login-modal/use-login-modal";
import { useBoard } from "@/hooks/use-board";
import { useBoolean } from "@/hooks/use-boolean";
import useLocales from "@/hooks/use-locales";
import { useUser } from "@/hooks/use-user";
import { RouterLink } from "@/routes/components";
import { getBoardDetailsRoute } from "@/routes/paths";
import { Button, Stack } from "@mui/material";
import { SaveRoutineModal } from "../board/save-routine";
import * as HomeConfig from "./home-config";
import { SaveNoteDialog } from "./save-note-dialog";

export function ExercisesRoutineActions() {
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

  return (
    <>
      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        sx={{ width: HomeConfig.ROUTINE_WIDTH }}
      >
        <Button
          fullWidth
          size="medium"
          color="inherit"
          variant="outlined"
          onClick={onAddNote}
          disabled={disabled}
        >
          {t("ADD_NOTE")}
        </Button>

        <Button
          fullWidth
          size="medium"
          color="inherit"
          variant="outlined"
          disabled={disabled}
          sx={{ minWidth: 160 }}
          onClick={onSaveRoutine}
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
          sx={{ textAlign: "center" }}
        >
          {t("SEE_DETAILS")}
        </Button>
      </Stack>

      <SaveNoteDialog
        open={addNoteDialog.value}
        onClose={addNoteDialog.onFalse}
      />

      <SaveRoutineModal
        open={saveRoutine.value}
        onClose={saveRoutine.onFalse}
      />
    </>
  );
}
