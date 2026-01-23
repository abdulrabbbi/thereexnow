import { ConfirmDialog } from "@/components/custom-dialog";
import {
  Routine_CreateRoutineMutationVariables,
  Routines,
  useRoutine_CreateRoutineMutation,
  useRoutine_UpdateRoutineMutation,
} from "@/graphql/generated";
import { useGetRoutines } from "@/hooks/helpers/routines";
import { useBoard } from "@/hooks/use-board";
import { useBoolean } from "@/hooks/use-boolean";
import useLocales from "@/hooks/use-locales";
import { HoldType, PerformType } from "@/hooks/use-mock-data";
import { exerciseNoteStrigify } from "@/utils";
import { Button, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export function SaveRoutineModal({ open, onClose }: Props) {
  const { t } = useLocales();
  const newRoutine = useBoolean();
  const existingRoutine = useBoolean();

  const { data: routinesData, isLoading: routinesLoading } = useGetRoutines({
    take: 999,
  });

  return (
    <>
      <ConfirmDialog
        open={open}
        onClose={onClose}
        title="Save as routine"
        cancelProps={{ color: "inherit", fullWidth: true, size: "medium" }}
        content={
          <Stack spacing={2}>
            <Button
              size="medium"
              loading={routinesLoading}
              loadingIndicator="Checking ..."
              disabled={!routinesData?.length}
              onClick={() => {
                onClose();
                existingRoutine.onTrue();
              }}
            >
              {t("Addtoexistingroutins")}
            </Button>

            <Button
              size="medium"
              onClick={() => {
                onClose();
                newRoutine.onTrue();
              }}
            >
              {t("SAVE_AZ_A_ROUTINE")}
            </Button>
          </Stack>
        }
      />

      <SaveExistingRoutine
        routines={routinesData}
        open={existingRoutine.value}
        onClose={existingRoutine.onFalse}
      />

      <SaveNewRoutine open={newRoutine.value} onClose={newRoutine.onFalse} />
    </>
  );
}

function SaveExistingRoutine({
  open,
  onClose,
  routines,
}: Props & { routines: Array<Routines> }) {
  const board = useBoard();
  const { t } = useLocales();
  const [routine, setRoutine] = useState<Routines | null>(null);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useRoutine_UpdateRoutineMutation();

  useEffect(() => {
    if (routine) {
      onSubmit(routine);
    }
  }, [routine]);

  const onSubmit = (routine: Routines) => {
    const oldExercises = routine?.routineExercises?.map((item) => {
      const exercise = item?.exercise;

      return {
        exerciseId: exercise?.id,
        set: Number(exercise?.set ?? 0),
        hold: Number(exercise?.hold ?? 0),
        reps: Number(exercise?.reps ?? 0),
        perform: Number(exercise?.perform ?? 0),
        holdType: exercise?.holdType ?? HoldType.Min,
        performType: exercise?.performType ?? PerformType.Day,
        note: exercise?.note,
      };
    });

    const newExercises: Routine_CreateRoutineMutationVariables["exercises"] =
      board.data.map((item) => {
        const exercise = item.exercise;

        return {
          exerciseId: exercise?.id,
          set: Number(exercise?.set),
          hold: Number(exercise?.hold),
          reps: Number(exercise?.reps),
          holdType: exercise?.holdType,
          perform: Number(exercise?.perform),
          performType: exercise?.performType,
          note: exerciseNoteStrigify(
            exercise?.note as string,
            exercise?.workoutMove as Array<string>
          ),
        };
      });

    mutate(
      {
        ...routine,
        fileUrl: "",
        note: routine.description ?? '',
        id: routine.id,
        name: routine.name as string,
        exercises: [...oldExercises!, ...newExercises],
      },
      {
        onSuccess: (res) => {
          if (res.routine_updateRoutine?.status.code === 1) {
            queryClient.invalidateQueries({
              queryKey: ["routine_getRoutines"],
            });

            // board.onReset();

            onClose();
          } else if (res.routine_updateRoutine?.status.code === 107) {
            toast.error(t("TO_ADD_MORER_ROUTINE"));
          } else {
            toast.warning(res.routine_updateRoutine?.status.value);
          }
        },
      }
    );
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={t("SAVE_AZ_A_ROUTINE")}
      cancelProps={{ fullWidth: true, color: "inherit" }}
      content={
        <Grid container spacing={2}>
          {routines?.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
              <Button
                fullWidth
                size="medium"
                color="inherit"
                variant="outlined"
                disabled={isPending}
                onClick={() => setRoutine(item)}
                loading={routine?.id === item.id && isPending}
              >
                {item.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      }
    />
  );
}

function SaveNewRoutine({ open, onClose }: Props) {
  const board = useBoard();
  const { t } = useLocales();
  const [name, setName] = useState("");

  const queryClient = useQueryClient();
  const { mutate, isPending } = useRoutine_CreateRoutineMutation();

  const onSubmit = () => {
    const exercises: Routine_CreateRoutineMutationVariables["exercises"] =
      board.data.map((item) => {
        const exercise = item.exercise;

        return {
          exerciseId: exercise?.id,
          set: Number(exercise?.set),
          hold: Number(exercise?.hold),
          reps: Number(exercise?.reps),
          holdType: exercise?.holdType,
          perform: Number(exercise?.perform),
          performType: exercise?.performType,
          note: exerciseNoteStrigify(
            exercise?.note as string,
            exercise?.workoutMove as Array<string>
          ),
        };
      });

    mutate(
      { fileUrl: "", name, note: board.note, exercises },
      {
        onSuccess: (res) => {
          if (res.routine_createRoutine?.status.code === 1) {
            queryClient.invalidateQueries({
              queryKey: ["routine_getRoutines"],
            });

            // board.onReset();

            setName("");

            onClose();
          } else if (res.routine_createRoutine?.status.code === 107) {
            toast.error(t("TO_ADD_MORER_ROUTINE"));
          } else {
            toast.warning(res.routine_createRoutine?.status.value);
          }
        },
      }
    );
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={t('saveasanewroutine')}
      cancelProps={{ fullWidth: true, color: "inherit" }}
      content={
        <Stack pt={1}>
          <TextField
            value={name}
            label="Routine name"
            onChange={(e) => setName(e.target.value)}
          />
        </Stack>
      }
      action={
        <Button
          fullWidth
          disabled={!name}
          onClick={onSubmit}
          variant="contained"
          loading={isPending}
        >
          Save
        </Button>
      }
    />
  );
}
