"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { useRoutine_UpdateRoutineMutation } from "@/graphql/generated";
import { useGetTranslatedRoutine } from "@/hooks/helpers/translated-hooks";
import { useResponsive } from "@/hooks/use-responsive";
import useLocales from "@/hooks/use-locales";
import { useRouter, useSearchParams } from "@/routes/hooks";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { RoutineRemoveDialog } from "../../routine-remove-dialog";
import { RoutineShareDialog } from "../../routine-share-dialog";
import { RoutineDetailsHeader } from "../components/routine-details-header";
import {
  RoutineExerciseCard,
  RoutineExerciseDraft,
} from "../components/routine-exercise-card";
import { RoutineNoteCard } from "../components/routine-note-card";
import { exerciseNoteStrigify } from "@/utils";

function toRoutineExerciseDraft(
  value: unknown,
): Array<RoutineExerciseDraft> {
  if (!Array.isArray(value)) return [];

  return value.filter(Boolean).map((item) => {
    const nextItem = item as RoutineExerciseDraft;

    return {
      ...nextItem,
      workoutMove: Array.isArray(nextItem.workoutMove)
        ? nextItem.workoutMove
        : [],
    };
  });
}

export default function RoutineDetailsView() {
  const { t } = useLocales();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParam = useSearchParams();
  const isMobile = useResponsive("down", "sm");
  const hydratedRoutineIdRef = useRef<number | null>(null);

  const routineId = Number(searchParam?.get("id") ?? 0);

  const [routineName, setRoutineName] = useState("");
  const [routineNote, setRoutineNote] = useState("");
  const [routineExercises, setRoutineExercises] = useState<Array<RoutineExerciseDraft>>(
    [],
  );
  const [expandedExerciseId, setExpandedExerciseId] = useState<number | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const { routineData: routine, routineLoading } = useGetTranslatedRoutine(routineId);

  const { mutate: updateRoutineMutation, isPending: updateRoutineLoading } =
    useRoutine_UpdateRoutineMutation();

  useEffect(() => {
    if (!routine?.id) return;
    if (hydratedRoutineIdRef.current === routine.id) return;

    const nextExercises = toRoutineExerciseDraft(routine.routineExercises);

    setRoutineName(routine.name ?? "");
    setRoutineNote(routine.description ?? "");
    setRoutineExercises(nextExercises);
    setExpandedExerciseId(isMobile ? null : (nextExercises[0]?.id ?? null));
    hydratedRoutineIdRef.current = routine.id;
  }, [isMobile, routine]);

  useEffect(() => {
    if (!routineExercises.length) {
      setExpandedExerciseId(null);
      return;
    }

    if (isMobile) {
      setExpandedExerciseId(null);
      return;
    }

    setExpandedExerciseId((currentExpandedExerciseId) => {
      if (currentExpandedExerciseId !== null) {
        const exists = routineExercises.some(
          (exercise) => exercise.id === currentExpandedExerciseId,
        );

        if (exists) return currentExpandedExerciseId;
      }

      return routineExercises[0]?.id ?? null;
    });
  }, [isMobile, routineExercises]);

  const updateExerciseAt = useCallback(
    (
      index: number,
      updater: (exercise: RoutineExerciseDraft) => RoutineExerciseDraft,
    ) => {
      setRoutineExercises((currentExercises) =>
        currentExercises.map((exercise, exerciseIndex) =>
          exerciseIndex === index ? updater(exercise) : exercise,
        ),
      );
    },
    [],
  );

  const handleAddWorkoutStep = useCallback(
    (index: number) => {
      updateExerciseAt(index, (exercise) => ({
        ...exercise,
        workoutMove: [...(exercise.workoutMove ?? []), ""],
      }));
    },
    [updateExerciseAt],
  );

  const handleRemoveWorkoutStep = useCallback(
    (index: number, stepIndex: number) => {
      updateExerciseAt(index, (exercise) => ({
        ...exercise,
        workoutMove: (exercise.workoutMove ?? []).filter(
          (_, currentStepIndex) => currentStepIndex !== stepIndex,
        ),
      }));
    },
    [updateExerciseAt],
  );

  const handleChangeWorkoutStep = useCallback(
    (index: number, stepIndex: number, value: string) => {
      updateExerciseAt(index, (exercise) => ({
        ...exercise,
        workoutMove: (exercise.workoutMove ?? []).map((step, currentStepIndex) =>
          currentStepIndex === stepIndex ? value : step,
        ),
      }));
    },
    [updateExerciseAt],
  );

  const handleChangeExerciseField = useCallback(
    (
      index: number,
      field: "hold" | "reps" | "holdType" | "set" | "perform" | "performType",
      value: string,
    ) => {
      updateExerciseAt(index, (exercise) => ({
        ...exercise,
        [field]: value as never,
      }));
    },
    [updateExerciseAt],
  );

  const handleRemoveExercise = useCallback(
    (index: number) => {
      setRoutineExercises((currentExercises) => {
        const removedExercise = currentExercises[index];
        const nextExercises = currentExercises.filter(
          (_, exerciseIndex) => exerciseIndex !== index,
        );

        if (removedExercise?.id === expandedExerciseId) {
          setExpandedExerciseId(isMobile ? null : (nextExercises[0]?.id ?? null));
        }

        return nextExercises;
      });
    },
    [expandedExerciseId, isMobile],
  );

  const handleToggleExercise = useCallback((exerciseId: number, expanded: boolean) => {
    setExpandedExerciseId((currentExpandedExerciseId) => {
      if (expanded) return exerciseId;
      return currentExpandedExerciseId === exerciseId
        ? null
        : currentExpandedExerciseId;
    });
  }, []);

  const handleAddWorkoutFromStickyAction = useCallback(() => {
    if (!routineExercises.length) return;

    const currentExerciseIndex = routineExercises.findIndex(
      (exercise) => exercise.id === expandedExerciseId,
    );
    const targetExerciseIndex =
      currentExerciseIndex >= 0 ? currentExerciseIndex : 0;

    handleAddWorkoutStep(targetExerciseIndex);

    const targetExercise = routineExercises[targetExerciseIndex];
    if (targetExercise) {
      setExpandedExerciseId(targetExercise.id);
    }
  }, [expandedExerciseId, handleAddWorkoutStep, routineExercises]);

  const handleSaveRoutine = useCallback(() => {
    if (!routineId) return;

    updateRoutineMutation(
      {
        id: routineId,
        fileUrl: routine?.fileUrl ?? "",
        name: routineName,
        note: routineNote,
        exercises: routineExercises.map((exercise) => ({
          id: exercise.id,
          set: Number(exercise.set),
          hold: Number(exercise.hold),
          reps: Number(exercise.reps),
          holdType: exercise.holdType,
          exerciseId: exercise.exerciseId,
          perform: Number(exercise.perform),
          performType: exercise.performType,
          note: exerciseNoteStrigify(exercise.note ?? "", exercise.workoutMove ?? []),
        })),
      },
      {
        onSuccess: (res) => {
          if (res.routine_updateRoutine?.status.code === 1) {
            queryClient.invalidateQueries({
              queryKey: ["routineDetail", routineId],
            });
            queryClient.invalidateQueries({
              queryKey: ["routine_getRoutines"],
            });

            router.replace("/routines");
          } else {
            toast.warning(res.routine_updateRoutine?.status.value);
          }
        },
      },
    );
  }, [queryClient, routine?.fileUrl, routineExercises, routineId, routineName, routineNote, router, updateRoutineMutation]);

  if (!routineId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6">Routine not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 1.5, md: 3 }, minWidth: 0 }}>
      {routineLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : (
        <>
          <RoutineDetailsHeader
            title={routineName}
            exerciseCount={routineExercises.length}
            updatedAt={null}
            isSaving={updateRoutineLoading}
            onBack={() => router.back()}
            onShare={() => setShareDialogOpen(true)}
            onDelete={() => setRemoveDialogOpen(true)}
            onSave={handleSaveRoutine}
          />

          <Box sx={{ maxWidth: 1100, mx: "auto", minWidth: 0 }}>
            <RoutineNoteCard value={routineNote} onChange={setRoutineNote} />

            <Stack spacing={1.5} sx={{ minWidth: 0 }}>
              {routineExercises.length ? (
                routineExercises.map((exercise, index) => (
                  <RoutineExerciseCard
                    key={exercise.id}
                    item={exercise}
                    isMobile={isMobile}
                    expanded={expandedExerciseId === exercise.id}
                    onToggleExpanded={(expanded) =>
                      handleToggleExercise(exercise.id, expanded)
                    }
                    onRemoveExercise={() => handleRemoveExercise(index)}
                    onAddWorkoutStep={() => handleAddWorkoutStep(index)}
                    onChangeWorkoutStep={(stepIndex, value) =>
                      handleChangeWorkoutStep(index, stepIndex, value)
                    }
                    onRemoveWorkoutStep={(stepIndex) =>
                      handleRemoveWorkoutStep(index, stepIndex)
                    }
                    onChangeMetric={(field, value) =>
                      handleChangeExerciseField(index, field, value)
                    }
                  />
                ))
              ) : (
                <Box
                  sx={{
                    py: 4,
                    textAlign: "center",
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                  }}
                >
                  <Typography color="text.secondary">{t("NO_EXERCISE")}</Typography>
                </Box>
              )}
            </Stack>
          </Box>

          <Box
            sx={{
              left: 0,
              right: 0,
              bottom: 0,
              mt: 2,
              zIndex: 12,
              position: { xs: "sticky", md: "static" },
              pt: { xs: 1.25, md: 0 },
              pb: { xs: "max(12px, env(safe-area-inset-bottom))", md: 0 },
              px: { xs: 0.5, md: 0 },
              bgcolor: { xs: "background.default", md: "transparent" },
              borderTop: { xs: "1px solid", md: "none" },
              borderColor: "divider",
            }}
          >
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleAddWorkoutFromStickyAction}
              disabled={!routineExercises.length}
            >
              {t("Add_New_Workout")}
            </Button>
          </Box>
        </>
      )}

      {shareDialogOpen ? (
        <RoutineShareDialog
          open
          routineId={routineId}
          onClose={() => setShareDialogOpen(false)}
        />
      ) : null}

      {removeDialogOpen && routine?.id ? (
        <RoutineRemoveDialog
          open
          routineId={routine.id}
          onClose={() => setRemoveDialogOpen(false)}
          onDeleted={() => router.replace("/routines")}
        />
      ) : null}
    </Container>
  );
}
