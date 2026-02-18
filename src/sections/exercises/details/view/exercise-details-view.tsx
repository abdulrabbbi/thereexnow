"use client";

import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import { Form } from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import { LoadingScreen } from "@/components/loading-screen";
import { LoginModal } from "@/components/login-modal";
import { useLoginModal } from "@/components/login-modal/use-login-modal";
import { ExerciseDto, Products } from "@/graphql/generated";
import { useToggleFavorite } from "@/hooks/helpers/exercise";
import {
  useGetTranslatedExercise,
  useGetTranslatedExerciseProducts,
} from "@/hooks/helpers/translated-hooks";
import { useBoard } from "@/hooks/use-board";
import useLocales from "@/hooks/use-locales";
import { HoldType, PerformType } from "@/hooks/use-mock-data";
import { useModal } from "@/hooks/use-modal";
import { useShare } from "@/hooks/use-share";
import { useUser } from "@/hooks/use-user";
import MiniNavLayout from "@/layouts/mini-nav-layout";
import { MiniNavItemsType } from "@/layouts/mini-nav-layout/types";
import { useRouter, useSearchParams } from "@/routes/hooks";
import { getBoardDetailsRoute, getCategoriesRoute } from "@/routes/paths";
import { ExerciseDetailsType, SimplifiedExercise } from "@/types";
import { simplifyExercise } from "@/utils";
import { Button, Container, Stack } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { ExerciseDetailsForm } from "../exercise-details-form";
import { ExerciseEquipments } from "../exercise-equipments";

const defaultValues = {
  set: 0,
  hold: 0,
  reps: 0,
  note: "",
  perform: 0,
  holdType: HoldType.Min,
  performType: PerformType.Day,
  workoutMove: [] as Array<string>,
};

export default function ExerciseDetailsView() {
  const board = useBoard();
  const share = useShare();
  const { t } = useLocales();
  const router = useRouter();
  const { userData } = useUser();
  const withLoginModal = useLoginModal();
  const { handleOpenModal } = useModal();

  const { toggleFavorite, toggleFavoriteLoading } = useToggleFavorite();

  const searchParam = useSearchParams();

  const exerciseIdNumber = Number(searchParam?.get("id") ?? 0);

  const isExerciseInTheBoard = board.data.find(
    (el) => el.exercise?.id! === exerciseIdNumber
  );

  const { exerciseData, exerciseLoading } =
    useGetTranslatedExercise(exerciseIdNumber);

  const { exerciseProductsData, exerciseProductsLoading } =
    useGetTranslatedExerciseProducts(exerciseIdNumber);

  const methods = useForm<ExerciseDetailsType>({ defaultValues });

  const getShareExercises = useCallback(() => {
    if (!exerciseData?.exercise) {
      return [] as Array<SimplifiedExercise>;
    }

    return [
      {
        ...exerciseData.exercise,
        ...methods.getValues(),
      } as SimplifiedExercise,
    ];
  }, [exerciseData?.exercise, methods]);

  const onToggleFavorite = useCallback(() => {
    if (!userData) {
      return withLoginModal.run();
    }

    toggleFavorite(exerciseIdNumber, exerciseData?.isFavorite!);
  }, [
    userData,
    withLoginModal,
    toggleFavorite,
    exerciseIdNumber,
    exerciseData?.isFavorite,
  ]);

  const onShareEmail = useCallback(
    () => share.email.onClick({ exercises: getShareExercises() }),
    [share.email, getShareExercises]
  );

  const onSharePrint = useCallback(
    () => share.print.onClick({ exercises: getShareExercises() }),
    [share.print, getShareExercises]
  );

  const onShareQrCode = useCallback(
    () => share.qrCode.onClick({ exercises: getShareExercises() }),
    [share.qrCode, getShareExercises]
  );

  const navItems = useMemo<Array<MiniNavItemsType>>(
    () => [
      {
        title: t("FAVORITEAdd"),
        onClick: onToggleFavorite,
        isLoading: toggleFavoriteLoading,
        icon: (
          <Iconify
            width={38}
            color={exerciseData?.isFavorite ? "red" : "red"}
            icon={
              exerciseData?.isFavorite
                ? "solar:heart-bold"
                : "solar:heart-linear"
            }
          />
        ),
      },
      {
        ...share.email,
        onClick: onShareEmail,
      },
      {
        ...share.print,
        onClick: onSharePrint,
      },
      {
        ...share.qrCode,
        onClick: onShareQrCode,
      },
    ],
    [
      t,
      onToggleFavorite,
      toggleFavoriteLoading,
      exerciseData?.isFavorite,
      share.email,
      share.print,
      share.qrCode,
      onShareEmail,
      onSharePrint,
      onShareQrCode,
    ]
  );

  useEffect(() => {
    if (exerciseData) {
      methods.reset({
        set: exerciseData?.exercise?.set ?? 0,
        hold: exerciseData?.exercise?.hold ?? 0,
        reps: exerciseData?.exercise?.reps ?? 0,
        perform: exerciseData?.exercise?.perform ?? 0,
        holdType: exerciseData?.exercise?.holdType ?? HoldType.Min,
        performType: exerciseData?.exercise?.performType ?? PerformType.Day,
        note: (exerciseData?.exercise?.note ?? "") as string,
        workoutMove: (exerciseData?.exercise?.workoutMove ??
          []) as Array<string>,
      });
    }
  }, [exerciseData, methods]);

  const onSubmit = methods.handleSubmit(async (formValues) => {
    if (!userData) {
      return handleOpenModal({
        title: t("GUEST_MODE"),
        body: (props) => <LoginModal handleClose={props.handleCloseModal} />,
      });
    }

    if (isExerciseInTheBoard) {
      return board.onRemoveExercise(exerciseIdNumber);
    }

    const formattedExercise = simplifyExercise(exerciseData as any);

    board.onAddExercise({
      ...formattedExercise,
      // @ts-ignore
      exercise: {
        ...formattedExercise?.exercise,
        ...formValues,
      },
    });

    router.push(getBoardDetailsRoute());
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <MiniNavLayout navItems={navItems}>
        <Container
          maxWidth="lg"
          sx={{
            pb: {
              xs: "calc(72px + env(safe-area-inset-bottom))",
              md: 0,
            },
          }}
        >
          {exerciseLoading || exerciseProductsLoading ? (
            <LoadingScreen sx={{ height: "60svh" }} />
          ) : (
            <>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
              >
                <CustomBreadcrumbs
                  activeLast
                  heading={exerciseData?.exercise?.name as string}
                  links={[
                    {
                      name:
                        exerciseData?.exercise?.subCategory?.category?.name ??
                        "",
                      href: getCategoriesRoute({
                        categoryId:
                          exerciseData?.exercise?.subCategory?.categoryId,
                      }),
                    },
                    {
                      name: exerciseData?.exercise?.subCategory?.name ?? "",
                      href: getCategoriesRoute({
                        categoryId:
                          exerciseData?.exercise?.subCategory?.categoryId,
                        subCategoryId: exerciseData?.exercise?.subCategory?.id,
                      }),
                    },
                  ]}
                />

                <Button
                  fullWidth
                  size="medium"
                  type="submit"
                  sx={{
                    width: { xs: 1, sm: "auto" },
                    minWidth: { sm: 200 },
                    alignSelf: { xs: "stretch", sm: "flex-end" },
                  }}
                  variant={isExerciseInTheBoard ? "outlined" : "contained"}
                >
                  {isExerciseInTheBoard ? t('REMOVE_FROM_HEP') : t("ADDTO_HEP")}
                </Button>
              </Stack>

              <ExerciseDetailsForm
                // @ts-ignore
                exerciseData={simplifyExercise(exerciseData as ExerciseDto)}
              />

              {exerciseProductsData?.length ? (
                <ExerciseEquipments
                  data={exerciseProductsData as Array<Products>}
                />
              ) : null}
            </>
          )}
        </Container>
      </MiniNavLayout>
    </Form>
  );
}
