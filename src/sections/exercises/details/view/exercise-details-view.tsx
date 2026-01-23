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
import { useEffect } from "react";
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

  const exerciseId = searchParam.get("id");

  const isExerciseInTheBoard = board.data.find(
    (el) => el.exercise?.id! === Number(exerciseId)
  );

  const { exerciseData, exerciseLoading } = useGetTranslatedExercise(
    Number(exerciseId)
  );

  const { exerciseProductsData, exerciseProductsLoading } =
    useGetTranslatedExerciseProducts(Number(exerciseId));

  const methods = useForm<ExerciseDetailsType>({ defaultValues });

  const formValues = methods.watch();

  const navItems: Array<MiniNavItemsType> = [
    {
      title: t("FAVORITEAdd"),
      onClick: () => {
        if (!userData) {
          return withLoginModal.run();
        }

        toggleFavorite(Number(exerciseId), exerciseData?.isFavorite!);
      },
      isLoading: toggleFavoriteLoading,
      icon: (
        <Iconify
          width={38}
          color={exerciseData?.isFavorite ? "red" : "red"}
          icon={
            exerciseData?.isFavorite ? "solar:heart-bold" : "solar:heart-linear"
          }
        />
      ),
    },
    {
      ...share.email,
      onClick: () =>
        share.email.onClick({
          exercises: [
            { ...exerciseData?.exercise, ...formValues } as SimplifiedExercise,
          ],
        }),
    },
    {
      ...share.print,
      onClick: () =>
        share.print.onClick({
          exercises: [
            { ...exerciseData?.exercise, ...formValues } as SimplifiedExercise,
          ],
        }),
    },
    {
      ...share.qrCode,
      onClick: () =>
        share.qrCode.onClick({
          exercises: [
            { ...exerciseData?.exercise, ...formValues } as SimplifiedExercise,
          ],
        }),
    },
  ];

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
  }, [exerciseData]);

  const onSubmit = methods.handleSubmit(async (formValues) => {
    if (!userData) {
      return handleOpenModal({
        title: t("GUEST_MODE"),
        body: (props) => <LoginModal handleClose={props.handleCloseModal} />,
      });
    }

    if (isExerciseInTheBoard) {
      return board.onRemoveExercise(Number(exerciseId));
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
        <Container maxWidth="lg">
          {exerciseLoading || exerciseProductsLoading ? (
            <LoadingScreen sx={{ height: "60svh" }} />
          ) : (
            <>
              <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
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
                  size="medium"
                  type="submit"
                  sx={{ minWidth: { md: 200 } }}
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
