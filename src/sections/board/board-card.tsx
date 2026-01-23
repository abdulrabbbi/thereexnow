import { Iconify } from "@/components/iconify";
import { useBoard } from "@/hooks/use-board";
import { HoldType, PerformType } from "@/hooks/use-mock-data";
import { MediaType, SimplifiedExerciseDto } from "@/types";
import { Divider, Fab, Stack, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { ExerciseGallery } from "../common/exercise-gallery";
import { ExerciseRepsHold } from "../common/exercise-reps-hold";
import { ExerciseSetPerform } from "../common/exercise-set-perform";
import { ExerciseWorkout } from "../common/exercise-workout";

type Props = {
  simple?: boolean;
  item: SimplifiedExerciseDto;
};

export function BoardCard({ item, simple = false }: Props) {
  const { exercise } = item;

  const board = useBoard();

  return (
    <Box sx={{ py: 5, position: "relative" }}>
      <Grid container spacing={3}>
        {!simple ? (
          <Grid size={{ xs: 12, md: 8 }}>
            <ExerciseGallery
              id={exercise?.id as number}
              onMirrorImage={board.onMirrorImage}
              data={exercise?.otherMedia as Array<MediaType>}
            />
          </Grid>
        ) : null}

        <Grid size={{ xs: 12, md: simple ? 12 : 4 }} sx={{ py: 1 }}>
          {!simple ? (
            <Stack mb={3} direction="row" alignItems="center">
              <Stack flex={1}>
                <Typography fontWeight={500}>{exercise?.name}</Typography>
              </Stack>

              <Fab
                size="small"
                variant="soft"
                color="secondary"
                sx={{ borderRadius: 1 }}
                onClick={() => board.onRemoveExercise(exercise?.id as number)}
              >
                <Iconify width={24} icon="ic:round-close" />
              </Fab>
            </Stack>
          ) : null}

          {/* <TextField
            rows={3}
            multiline
            fullWidth
            label="Note"
            value={exercise?.note}
            onChange={(e) =>
              board.onEditExercise(exercise?.id!, "note", e.target.value)
            }
          /> */}

          {/* <Divider sx={{ my: 2, borderStyle: "dashed" }} /> */}

          <ExerciseWorkout
            data={exercise?.workoutMove ?? []}
            exerciseId={exercise?.id as number}
            onAdd={(exerciseId) => board.onAddWorkout(exerciseId)}
            onRemove={(args) =>
              board.onRemoveWorkout(args.exerciseId, args.index)
            }
            onChange={(args) =>
              board.onEditWorkout(args.exerciseId, args.index, args.value)
            }
          />

          <Divider sx={{ my: 2, borderStyle: "dashed" }} />

          <ExerciseRepsHold
            reps={exercise?.reps as number}
            hold={exercise?.hold as number}
            exerciseId={exercise?.id as number}
            holdType={exercise?.holdType as HoldType}
            onChange={(args) =>
              board.onEditExercise(args.exerciseId, args.field, args.value)
            }
          />

          <Box sx={{ my: 3 }} />

          <ExerciseSetPerform
            set={exercise?.set as number}
            exerciseId={exercise?.id as number}
            perform={exercise?.perform as number}
            performType={exercise?.performType as PerformType}
            onChange={(args) =>
              board.onEditExercise(args.exerciseId, args.field, args.value)
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
