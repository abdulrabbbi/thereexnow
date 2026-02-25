import { Iconify } from "@/components/iconify";
import TranslateText from "@/components/translate-text";
import { RoutineExercises } from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { ExerciseGallery } from "@/sections/common/exercise-gallery";
import { ExerciseRepsHold } from "@/sections/common/exercise-reps-hold";
import { ExerciseSetPerform } from "@/sections/common/exercise-set-perform";
import { ExerciseWorkout } from "@/sections/common/exercise-workout";
import { MediaType } from "@/types";
import { getAssetsUrl, getOtherMedia } from "@/utils";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { memo, useMemo } from "react";

export type RoutineExerciseDraft = RoutineExercises & {
  workoutMove: Array<string>;
};

type Props = {
  item: RoutineExerciseDraft;
  expanded: boolean;
  isMobile: boolean;
  onToggleExpanded: (value: boolean) => void;
  onRemoveExercise: VoidFunction;
  onAddWorkoutStep: (exerciseId: number) => void;
  onRemoveWorkoutStep: (stepIndex: number) => void;
  onChangeWorkoutStep: (stepIndex: number, value: string) => void;
  onChangeMetric: (
    field: "hold" | "reps" | "holdType" | "set" | "perform" | "performType",
    value: string,
  ) => void;
};

export const RoutineExerciseCard = memo(
  function RoutineExerciseCard({
    item,
    expanded,
    isMobile,
    onToggleExpanded,
    onRemoveExercise,
    onAddWorkoutStep,
    onRemoveWorkoutStep,
    onChangeWorkoutStep,
    onChangeMetric,
  }: Props) {
    const { t } = useLocales();

    const thumbnailUrl = item.exercise?.photoUrl
      ? getAssetsUrl(item.exercise.photoUrl)
      : null;

    const mediaData = useMemo(
      () => (getOtherMedia(item.exercise?.otherMediaUrl) as Array<MediaType>) ?? [],
      [item.exercise?.otherMediaUrl],
    );

    return (
      <Card sx={{ minWidth: 0 }}>
        <Accordion
          disableGutters
          elevation={0}
          expanded={expanded}
          onChange={(_, nextExpanded) => onToggleExpanded(nextExpanded)}
          sx={{
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="eva:chevron-down-fill" />}
            sx={{
              px: 1.5,
              py: 1,
              "& .MuiAccordionSummary-content": {
                my: 0,
                minWidth: 0,
              },
            }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ width: 1, minWidth: 0 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                  borderRadius: 1,
                  overflow: "hidden",
                  bgcolor: "grey.100",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {thumbnailUrl ? (
                  <Box
                    component="img"
                    src={thumbnailUrl}
                    alt={item.exercise?.name ?? "exercise"}
                    sx={{ width: 1, height: 1, display: "block", objectFit: "cover" }}
                  />
                ) : null}
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <TranslateText>{item.exercise?.name ?? "-"}</TranslateText>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {item.workoutMove?.length ?? 0} {t("Workout_Step")}
                  {isMobile ? ` • ${expanded ? "Hide steps" : "Show steps"}` : ""}
                </Typography>
              </Box>

              <IconButton
                size="small"
                color="error"
                aria-label={t("DELETE")}
                sx={{ width: 44, height: 44, flexShrink: 0 }}
                onClick={(event) => {
                  event.stopPropagation();
                  onRemoveExercise();
                }}
              >
                <Iconify icon="ic:round-close" />
              </IconButton>
            </Stack>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 1.5, pb: 1.5, pt: 0, minWidth: 0 }}>
            <Stack spacing={2} sx={{ minWidth: 0 }}>
              {mediaData.length ? (
                <Box sx={{ display: { xs: "none", md: "block" }, minWidth: 0 }}>
                  <ExerciseGallery data={mediaData} />
                </Box>
              ) : null}

              <ExerciseWorkout
                data={item.workoutMove ?? []}
                exerciseId={item.id as number}
                onAdd={onAddWorkoutStep}
                onChange={(args) => onChangeWorkoutStep(args.index, args.value)}
                onRemove={(args) => onRemoveWorkoutStep(args.index)}
              />

              <ExerciseRepsHold
                reps={item.reps}
                hold={item.hold}
                holdType={item.holdType}
                exerciseId={item.exerciseId}
                onChange={(args) => onChangeMetric(args.field, args.value)}
              />

              <ExerciseSetPerform
                set={item.set}
                perform={item.perform}
                exerciseId={item.exerciseId}
                performType={item.performType}
                onChange={(args) => onChangeMetric(args.field, args.value)}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Card>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item === nextProps.item &&
    prevProps.expanded === nextProps.expanded &&
    prevProps.isMobile === nextProps.isMobile,
);
