"use client";

import useLocales from "@/hooks/use-locales";
import { PerformType } from "@/hooks/use-mock-data";
import { ExerciseGallery } from "@/sections/common/exercise-gallery";
import { ExerciseRepsHold } from "@/sections/common/exercise-reps-hold";
import { ExerciseSetPerform } from "@/sections/common/exercise-set-perform";
import { ExerciseWorkout } from "@/sections/common/exercise-workout";
import { ExerciseDetailsType, MediaType, SimplifiedExerciseDto } from "@/types";
import { Box, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFieldArray, useFormContext } from "react-hook-form";

type Props = {
  exerciseData: SimplifiedExerciseDto;
};

export function ExerciseDetailsForm({ exerciseData }: Props) {
  const exercise = exerciseData.exercise;

  const methods = useFormContext<ExerciseDetailsType>();

  const { watch, setValue, control } = methods;

  const formValues = watch();
  const { update } = useFieldArray({
    control,
    name: "workoutMove",
  });

  return (
    <Box sx={{ py: 5, position: "relative" }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ExerciseGallery
            id={exercise?.id as number}
            data={exercise?.otherMedia as Array<MediaType>}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ py: 1 }}>
          <ExerciseWorkout
            // onAdd={() => append("")}
            exerciseId={exercise?.id as number}
            data={formValues?.workoutMove ?? []}
            // onRemove={(args) => remove(args.index)}
            onChange={(args) => update(args.index, args.value)}
          />

          <Divider sx={{ my: 2, borderStyle: "dashed" }} />

          <ExerciseRepsHold
            reps={formValues.reps}
            hold={formValues.hold}
            holdType={formValues.holdType}
            exerciseId={exercise?.id as number}
            onChange={(args) => setValue(args.field, args.value as any)}
          />

          <Box sx={{ my: 3 }} />

          <ExerciseSetPerform
            set={formValues?.set as number}
            exerciseId={exercise?.id as number}
            perform={formValues?.perform as number}
            performType={formValues?.performType as PerformType}
            onChange={(args) => setValue(args.field, args.value as any)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
