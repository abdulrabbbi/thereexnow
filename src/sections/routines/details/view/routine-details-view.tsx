"use client";

import { SaveIcon } from "@/assets/icons/save-icon";
import { Field, Form } from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import { LoadingScreen } from "@/components/loading-screen";
import TextareaTranslate from "@/components/textarea-translate";
import TranslateText from "@/components/translate-text";
import {
  RoutineExercises,
  useRoutine_UpdateRoutineMutation,
} from "@/graphql/generated";
import { useGetTranslatedRoutine } from "@/hooks/helpers/translated-hooks";
import useLocales from "@/hooks/use-locales";
import { useShare } from "@/hooks/use-share";
import useSimpleTranslate from "@/hooks/use-simple-translate";
import MiniNavLayout from "@/layouts/mini-nav-layout";
import { MiniNavItemsType } from "@/layouts/mini-nav-layout/types";
import { useRouter, useSearchParams } from "@/routes/hooks";
import { ExerciseGallery } from "@/sections/common/exercise-gallery";
import { ExerciseRepsHold } from "@/sections/common/exercise-reps-hold";
import { ExerciseSetPerform } from "@/sections/common/exercise-set-perform";
import { ExerciseWorkout } from "@/sections/common/exercise-workout";
import { MediaType } from "@/types";
import { exerciseNoteStrigify, getOtherMedia } from "@/utils";
import { TextField } from "@mui/material";
import { TextareaAutosize } from "@mui/material";
import { Box, Container, Divider, Fab, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

type SimplifiedRoutineExercises = RoutineExercises & {
  workoutMove: Array<string>;
};

type FormType = {
  name: string;
  note: string;
  data: Array<SimplifiedRoutineExercises>;
};

const defaultValues: FormType = {
  note: "",
  name: "",
  data: [],
};

export default function RoutineDetailsView() {
  const searchParam = useSearchParams();
  const { translateAll } = useSimpleTranslate();
  const routineId = searchParam.get("id");

  const share = useShare();
  const { t } = useLocales();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { routineData: routine, routineLoading } = useGetTranslatedRoutine(
    Number(routineId)
  );

  const { mutate: updateRoutineMutation, isPending: updateRoutineLoading } =
    useRoutine_UpdateRoutineMutation();

  const methods = useForm({ defaultValues });

  const values = methods.watch();

  useEffect(() => {
    if (routine) {
      methods.reset({
        name: routine.name ?? "",
        note: routine.description ?? "",
        data: routine.routineExercises as any,
      });
    }
  }, [routine]);

  const onSubmit = async (formValues: typeof defaultValues) => {
    updateRoutineMutation(
      {
        fileUrl: "",
        id: Number(routineId),
        name: formValues.name,
        note: formValues.note,
        exercises: formValues.data.map((item) => ({
          id: item.id,
          set: Number(item.set),
          hold: Number(item.hold),
          reps: Number(item.reps),
          holdType: item.holdType,
          exerciseId: item.exerciseId,
          perform: Number(item.perform),
          performType: item.performType,
          note: exerciseNoteStrigify(item.note!, item.workoutMove),
        })),
      },
      {
        onSuccess: (res) => {
          if (res.routine_updateRoutine?.status.code === 1) {
            queryClient.invalidateQueries({
              queryKey: ["routine_getRoutine"],
            });
            queryClient.invalidateQueries({
              queryKey: ["routine_getRoutines"],
            });

            router.replace("/routines");
          } else {
            toast.warning(res.routine_updateRoutine?.status.value);
          }
        },
      }
    );
  };

  const navItems: Array<MiniNavItemsType> = [
    {
      title: t("SAVE"),
      isLoading: updateRoutineLoading,
      onClick: () => onSubmit(methods.watch()),
      icon: <SaveIcon />,
    },
    {
      ...share.email,
      onClick: () =>
        share.email.onClick({
          note: values.note,
          exercises: values.data as any,
        }),
    },
    {
      ...share.print,
      onClick: () =>
        share.print.onClick({
          note: values.note,
          exercises: values.data as any,
        }),
    },
    {
      ...share.qrCode,
      onClick: () =>
        share.qrCode.onClick({
          note: values.note,
          exercises: values.data as any,
        }),
    },
  ];

  const { remove } = useFieldArray({
    name: "data",
    control: methods.control,
  });

  function AddExercise(index: number) {
    const currentMoves = methods.getValues(
      `data.${index}.workoutMove`
    ) as Array<string>;

    methods.setValue(
      `data.${index}.workoutMove`,
      [...(currentMoves || []), ""],
      {
        shouldValidate: true,
      }
    );
  }

  return (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <MiniNavLayout
        navItems={navItems}
        slotProps={{
          content: {
            className:"hide-in-print",
            sx: {
              scrollbarWidth: "auto", // Hide scrollbar for Firefox
              msOverflowStyle: "auto", // Hide scrollbar for IE and Edge (legacy)
              "&::-webkit-scrollbar": {
                display: "auto", // Hide scrollbar for WebKit browsers (Chrome, Safari, Edge)
              },
            },
          },
        }}
      >
        <Container maxWidth="lg">
          {routineLoading ? (
            <LoadingScreen sx={{ height: "60svh" }} />
          ) : (
            <>
              <Typography mb={3} variant="h3">
                <TranslateText>{routine?.name ?? ""}</TranslateText>
              </Typography>

              <TextareaTranslate
                description={values.note}
                onUpdateValue={(val) => methods.setValue("note", val)}
              />

              <Stack my={5} spacing={2} divider={<Divider />}>
                {values.data.map((item, index) => (
                  <Box key={item.id} sx={{ py: 5, position: "relative" }}>
                    <Grid key={item.id} container spacing={3}>
                      <Grid
                        size={{ xs: 12, md: 8 }}
                        display={{ xs: "none", md: "initial" }}
                      >
                        <ExerciseGallery
                          data={
                            getOtherMedia(
                              item.exercise?.otherMediaUrl
                            ) as Array<MediaType>
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }} sx={{ py: 1 }}>
                        <Stack mb={3} direction="row" alignItems="center">
                          <Stack flex={1}>
                            <Typography fontWeight={500}>
                              <TranslateText>
                                {item.exercise?.name}
                              </TranslateText>
                            </Typography>
                          </Stack>

                          <Fab
                            size="small"
                            variant="soft"
                            color="default"
                            onClick={() => remove(index)}
                          >
                            <Iconify width={24} icon="ic:round-close" />
                          </Fab>
                        </Stack>

                        <ExerciseWorkout
                          sx={{ mb: 3 }}
                          data={item?.workoutMove ?? []}
                          exerciseId={item?.id as number}
                          onChange={(args) =>
                            methods.setValue(
                              `data.${index}.workoutMove.${args.index}`,
                              args.value as any
                            )
                          }
                          onAdd={() => AddExercise(index)}
                          onRemove={(args) => {
                            const currentMoves = methods.getValues(
                              `data.${index}.workoutMove`
                            ) as Array<string>;

                            methods.setValue(
                              `data.${index}.workoutMove`,
                              currentMoves.filter(
                                (_, idx) => idx !== args.index
                              ),
                              { shouldValidate: true }
                            );
                          }}
                        />

                        <ExerciseRepsHold
                          reps={item.reps}
                          hold={item.hold}
                          holdType={item.holdType}
                          exerciseId={item.exerciseId}
                          onChange={(args) => {
                            methods.setValue(
                              `data.${index}.${args.field}`,
                              args.value as any
                            );
                          }}
                        />

                        <Box sx={{ my: 3 }} />

                        <ExerciseSetPerform
                          set={item.set}
                          perform={item.perform}
                          exerciseId={item.exerciseId}
                          performType={item.performType}
                          onChange={(args) => {
                            methods.setValue(
                              `data.${index}.${args.field}`,
                              args.value as any
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </>
          )}
        </Container>
      </MiniNavLayout>
    </Form>
  );
}
