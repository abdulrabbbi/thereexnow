import { Iconify } from "@/components/iconify";
import { Image, ImageProps } from "@/components/image";
import { useBoard } from "@/hooks/use-board";
import { hideScrollY, maxLine } from "@/theme/styles";
import { getAssetsUrl, simplifyExercise } from "@/utils";
import {
  Button,
  ButtonProps,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  EmailSvgIcon,
  PrintSvgIcon,
  QRCodeSvgIcon,
} from "@/assets/icons/share-icons";
import { useLoginModal } from "@/components/login-modal/use-login-modal";
import useLocales from "@/hooks/use-locales";
import { useModal } from "@/hooks/use-modal";
import { useShare } from "@/hooks/use-share";
import { useUser } from "@/hooks/use-user";
import { SimplifiedExercise, SimplifiedExerciseDto } from "@/types";
import { BoardCard } from "../board/board-card";
import { ShareButton } from "../common/share/share-button";
import { EquipmentDialog } from "./equipment-dialog";
import { useEffect, useState } from "react";
import { useTranslate } from "@/hooks/use-translate";
import { useGetTranslatedExercises } from "@/hooks/helpers/translated-hooks";
import useSimpleTranslate from "@/hooks/use-simple-translate";

export function ExercisesRoutine() {
  const share = useShare();
  const board = useBoard();
  const { t, currentLang } = useLocales();

  const localSavedData = localStorage
    .getItem("board_data")
    ?.split(",")
    ?.map((item) => Number(item));
  const { exercisesData } = useGetTranslatedExercises({
    page: 0,
    take: localSavedData?.length || 10,
    where: { exercise: { id: { in: localSavedData } } },
    enabled:
      !!localSavedData && localSavedData.length > 0 && !board.data?.length,
  });

  useEffect(() => {
    if (exercisesData && !board.data?.length) {
      board.setState((pre) => ({
        ...pre,
        data: exercisesData.map((item) => ({
          ...simplifyExercise(item as any),
        })),
      }));
    }
  }, [exercisesData?.length]);

  const boardExercises = board.data.map(
    (item) => item.exercise
  ) as Array<SimplifiedExercise>;

  return (
    <Stack spacing={2} sx={{ pb: 2, width: 420, minWidth: 420 }}>
      <Typography>* {t("DRAG_AND_DROP_TO_ADD_EXERSICE")}</Typography>
      <Stack
        flex={1}
        spacing={1.5}
        sx={{
          p: 1.5,
          borderRadius: 2,
          border: "1px dashed grey",
          ...hideScrollY,
        }}
      >
        {board.data.map((item) => {
          return <ExerciseRoutineItem item={item} />;
        })}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={(theme) => ({
          px: 1,
          height: 64,
          borderRadius: 2,
          bgcolor: "#EBE8F9",
          border: `1px dashed #0C52712e`,
        })}
      >
        <ShareButton
          icon={<EmailSvgIcon />}
          disabled={!boardExercises.length}
          onClick={() =>
            share.email.onClick({ note: board.note, exercises: boardExercises })
          }
        />
        <ShareButton
          icon={<PrintSvgIcon />}
          disabled={!boardExercises.length}
          onClick={() =>
            share.print.onClick({ note: board.note, exercises: boardExercises })
          }
        />
        <ShareButton
          icon={<QRCodeSvgIcon />}
          disabled={!boardExercises.length}
          onClick={() =>
            share.qrCode.onClick({
              note: board.note,
              exercises: boardExercises,
            })
          }
        />
      </Stack>
    </Stack>
  );
}

function ExerciseRoutineItem({ item }: { item: SimplifiedExerciseDto }) {
  const board = useBoard();
  const { t, currentLang } = useLocales();
  const { exercise } = item;
  const { userData } = useUser();
  const withLoginModal = useLoginModal();
  const { handleOpenModal } = useModal();
  const { translateAll } = useSimpleTranslate();
  const [exerciseName, setExerciseName] = useState("");

  useEffect(() => {
    if (exercise?.name) {
      if (currentLang.value === "en") setExerciseName(exercise?.name);
      else
        translateAll([exercise?.name], (res) => {
          if (res) {
            setExerciseName((Array.isArray(res) ? res[0] : res) || "");
          }
        });
    }
  }, [currentLang.value]);

  const onOpenEquipments = (item: SimplifiedExerciseDto) => {
    if (!userData) {
      return withLoginModal.run();
    }

    handleOpenModal({
      title: t("EQUIPMENT"),
      options: { maxWidth: "md" },
      body: (props) => (
        <EquipmentDialog data={item} handleClose={props.handleCloseModal} />
      ),
    });
  };

  return (
    <Paper key={exercise?.id} variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="flex-start">
        <CustomImage src={getAssetsUrl(exercise?.photoUrl)} />
        <Stack py={0.5} px={1} flex={1}>
          <CustomButton
            disabled={!item.products?.length}
            onClick={() => onOpenEquipments(item)}
          >
            + {t("EQUIPMENT")}
          </CustomButton>

          <Typography fontWeight={500} sx={{ ...maxLine({ line: 3 }) }}>
            {exerciseName}
          </Typography>
        </Stack>
        <IconButton
          onClick={() => board.onRemoveExercise(exercise?.id as number)}
        >
          <Iconify icon="ic:round-close" />
        </IconButton>
      </Stack>

      <BoardCard simple item={item} />
    </Paper>
  );
}

const CustomImage = ({ src }: ImageProps) => (
  <Image
    ratio="1/1"
    src={src}
    sx={(theme) => ({
      borderRadius: 1,
      width: 100,
      height: 100,
      border: `0.5px solid ${theme.palette.grey[300]}`,
    })}
  />
);

const CustomButton = ({ children, ...rest }: ButtonProps) => (
  <Button
    {...rest}
    size="small"
    variant="text"
    color="secondary"
    sx={{ alignSelf: "flex-end", fontSize: 12, ...rest.sx }}
  >
    {children}
  </Button>
);
