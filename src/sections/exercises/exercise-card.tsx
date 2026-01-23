import AnimateMarquee from "@/components/animate/animate-marquee";
import { Iconify } from "@/components/iconify";
import { Image, imageClasses, ImageProps } from "@/components/image";
import { PlayerDialog } from "@/components/player";
import TranslateText from "@/components/translate-text";
import { ExerciseDto } from "@/graphql/generated";
import { useToggleFavorite } from "@/hooks/helpers/exercise";
import { useBoard } from "@/hooks/use-board";
import { useBoolean } from "@/hooks/use-boolean";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "@/routes/hooks";
import { getExerciseRoute } from "@/routes/paths";
import { getAssetsUrl, getOtherMedia, simplifyExercise } from "@/utils";
import {
  alpha,
  Box,
  Fab,
  fabClasses,
  FabProps,
  Paper,
  PaperProps,
  SxProps,
  Theme,
} from "@mui/material";
import React from "react";

type Props = {
  data: ExerciseDto;
  isFavorite?: boolean;
  sx?: SxProps<Theme>;
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

export const ExerciseCard = React.forwardRef<HTMLDivElement, Props>(
  ({ data, isFavorite, sx, ...other }, ref) => {
    const board = useBoard();

    const router = useRouter();
    const { userData } = useUser();
    const videoDialog = useBoolean();
    const { toggleFavorite, toggleFavoriteLoading } = useToggleFavorite();

    const isExistInCheckList = board.data.find(
      (el) => el.exercise?.id === data.exercise?.id
    );

    const exerciseVideo = getOtherMedia(
      data?.exercise?.otherMediaUrl as string
    )?.find((media) => media?.type === "video")?.url;

    const onClickHandler = (e: React.MouseEvent) => {
      if (!other.draggable) {
        router.push(getExerciseRoute(data.exercise?.id as number));
      }
    };

    const onClickAddToFavorite = (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFavorite(
        data.exercise?.id as number,
        isFavorite || data.isFavorite
      );
    };

    const onClickAddCheckList = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isExistInCheckList) {
        board.onRemoveExercise(data.exercise?.id as number);
      } else {
        board.onAddExercise({
          ...simplifyExercise(data as any),
        });
      }
    };

    const onClickPlayVideo = (e: React.MouseEvent) => {
      e.stopPropagation();
      videoDialog.onTrue();
    };

    return (
      <>
        <CustomPaper ref={ref} onClick={onClickHandler} sx={sx} {...other}>
          <Box sx={{ position: "relative" }}>
            {userData ? (
              <CustomFab
                sx={{ left: 8, top: 8 }}
                onClick={onClickAddToFavorite}
                disabled={toggleFavoriteLoading}
              >
                {toggleFavoriteLoading ? (
                  <Iconify
                    width={26}
                    sx={{ color: "black" }}
                    icon="svg-spinners:90-ring-with-bg"
                  />
                ) : (
                  <Iconify
                    icon={
                      isFavorite || data.isFavorite
                        ? "solar:heart-bold"
                        : "solar:heart-linear"
                    }
                    sx={{
                      color: isFavorite || data.isFavorite ? "red" : "white",
                    }}
                  />
                )}
              </CustomFab>
            ) : null}

            <CustomFab sx={{ right: 8, top: 8 }} onClick={onClickAddCheckList}>
              <Iconify
                width={28}
                icon={isExistInCheckList ? "ic:round-minus" : "ic:round-plus"}
              />
            </CustomFab>

            {exerciseVideo ? (
              <CustomFab
                sx={{ right: 8, bottom: 8 }}
                onClick={onClickPlayVideo}
              >
                <Iconify icon="solar:play-outline" />
              </CustomFab>
            ) : null}

            <CustomImage
              alt={data.exercise?.name ?? ""}
              src={getAssetsUrl(data.exercise?.photoUrl)}
            />
          </Box>

          <AnimateMarquee
            text={<TranslateText>{data.exercise?.name ?? ""}</TranslateText>}
            slotProps={{ typography: { sx: { p: 1.5 } } }}
          />
        </CustomPaper>

        {videoDialog.value ? (
          <PlayerDialog
            open={videoDialog.value}
            onClose={videoDialog.onFalse}
            videoPath={getAssetsUrl(exerciseVideo)}
          />
        ) : null}
      </>
    );
  }
);

ExerciseCard.displayName = "ExerciseCard";

const CustomPaper = ({ children, onClick, sx, ...other }: PaperProps) => (
  <Paper
    component="div"
    onClick={onClick}
    variant="outlined"
    sx={[
      {
        borderRadius: 2,
        cursor: "pointer",
        overflow: "hidden",
        userSelect: "none",
        position: "relative",
        textDecoration: "none",
        borderColor: (theme) => alpha(theme.palette.grey[500], 0.12),

        "&:hover": {
          bgcolor: "grey.200",
          [`& .${imageClasses.img}`]: { transform: "scale(1.06)" },
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    {...other}
  >
    {children}
  </Paper>
);

const CustomImage = ({ alt, src }: ImageProps) => (
  <Image
    src={src}
    ratio="1/1"
    alt={alt ?? ""}
    sx={{
      maxWidth: 1,
      width: "100%",
      objectFit: "contain",
      border: "0.5px solid #EAEAEA",
      [`& .${imageClasses.img}`]: {
        transition: (theme) =>
          theme.transitions.create(["transform"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.short,
          }),
      },
    }}
  />
);

const CustomFab = ({ sx, onClick, children, ...other }: FabProps) => (
  <Fab
    size="small"
    color="secondary"
    className="card-action-buttons"
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick(e);
    }}
    sx={[
      {
        zIndex: 9,
        opacity: 1,
        position: "absolute",
        bgcolor: "rgba(166, 158, 213)",
        transition: (theme) => theme.transitions.create("opacity"),
        [`&.${fabClasses.disabled}`]: {
          bgcolor: "#fff",
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    {...other}
  >
    {children}
  </Fab>
);
