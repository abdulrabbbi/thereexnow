"use client";

import { HoldType, PerformType } from "@/hooks/use-mock-data";
import { ExerciseGallery } from "@/sections/common/exercise-gallery";
import { ExerciseRepsHold } from "@/sections/common/exercise-reps-hold";
import { ExerciseSetPerform } from "@/sections/common/exercise-set-perform";
import { ExerciseWorkout } from "@/sections/common/exercise-workout";
import { ExerciseDetailsType, MediaType, SimplifiedExerciseDto } from "@/types";
import { Box, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFormContext, useWatch } from "react-hook-form";

type Props = {
  exerciseData: SimplifiedExerciseDto;
};

export function ExerciseDetailsForm({ exerciseData }: Props) {
  const exercise = exerciseData.exercise;

  const methods = useFormContext<ExerciseDetailsType>();

  const { setValue, control } = methods;

  const [
    workoutMove = [],
    reps = 0,
    hold = 0,
    holdType = HoldType.Min,
    setCount = 0,
    perform = 0,
    performType = PerformType.Day,
  ] = useWatch({
    control,
    name: [
      "workoutMove",
      "reps",
      "hold",
      "holdType",
      "set",
      "perform",
      "performType",
    ],
  }) as [Array<string>, number, number, HoldType, number, number, PerformType];

  const onWorkoutMoveChange = (index: number, value: string) => {
    const currentMoves = methods.getValues("workoutMove") ?? [];
    const nextMoves = [...currentMoves];

    nextMoves[index] = value;

    setValue("workoutMove", nextMoves, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <Box sx={{ py: 5, position: "relative" }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ width: 1, minWidth: 0 }}>
            <ExerciseGallery
              id={exercise?.id as number}
              data={exercise?.otherMedia as Array<MediaType>}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ py: 1 }}>
          <ExerciseWorkout
            // onAdd={() => append("")}
            exerciseId={exercise?.id as number}
            data={workoutMove}
            // onRemove={(args) => remove(args.index)}
            onChange={(args) => onWorkoutMoveChange(args.index, args.value)}
          />

          <Divider sx={{ my: 2, borderStyle: "dashed" }} />

          <ExerciseRepsHold
            reps={reps}
            hold={hold}
            holdType={holdType}
            exerciseId={exercise?.id as number}
            onChange={(args) => setValue(args.field, args.value as any)}
          />

          <Box sx={{ my: 3 }} />

          <ExerciseSetPerform
            set={setCount}
            exerciseId={exercise?.id as number}
            perform={perform}
            performType={performType}
            onChange={(args) => setValue(args.field, args.value as any)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
