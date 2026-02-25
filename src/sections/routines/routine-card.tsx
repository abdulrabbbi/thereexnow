import { Iconify } from "@/components/iconify";
import TranslateText from "@/components/translate-text";
import { Routines } from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { useRouter } from "@/routes/hooks";
import { getRoutineRoute } from "@/routes/paths";
import { getAssetsUrl } from "@/utils";
import {
  alpha,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { useMemo } from "react";

type Props = {
  item: Routines;
  onShare: (routine: Routines) => void;
  onRemove: (routine: Routines) => void;
};

export function RoutineCard({ item, onShare, onRemove }: Props) {
  const { t } = useLocales();
  const router = useRouter();
  const routineExercises = item.routineExercises ?? [];
  const exerciseCount = routineExercises.reduce(
    (total, routineExercise) => (routineExercise ? total + 1 : total),
    0,
  );

  const previewImages = useMemo(
    () =>
      routineExercises
        .map((routineExercise) => routineExercise?.exercise?.photoUrl)
        .filter((photoUrl): photoUrl is string => Boolean(photoUrl))
        .map((photoUrl) => getAssetsUrl(photoUrl))
        .slice(0, 4),
    [routineExercises],
  );

  const extraExercisesCount = Math.max(exerciseCount - previewImages.length, 0);

  const onOpenRoutine = () => {
    router.push(getRoutineRoute(item.id as number));
  };

  return (
    <Card
      sx={{
        height: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <CardActionArea onClick={onOpenRoutine} sx={{ display: "block", minWidth: 0 }}>
        <PreviewBox>
          {previewImages.length === 0 ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: 1, color: "text.disabled", bgcolor: "grey.100" }}
            >
              <Iconify width={36} icon="solar:gallery-wide-bold-duotone" />
            </Stack>
          ) : previewImages.length === 1 ? (
            <Box
              component="img"
              alt={item.name ?? "Routine preview"}
              src={previewImages[0]}
              sx={{ width: 1, height: 1, display: "block", objectFit: "cover" }}
            />
          ) : (
            <Box
              sx={{
                p: 0.5,
                height: 1,
                display: "grid",
                gap: 0.5,
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gridTemplateRows: "repeat(2, minmax(0, 1fr))",
              }}
            >
              {Array.from({ length: 4 }).map((_, index) => {
                const image = previewImages[index];

                if (image) {
                  return (
                    <Box
                      component="img"
                      key={index}
                      alt={`${item.name ?? "Routine"} preview ${index + 1}`}
                      src={image}
                      sx={{
                        width: 1,
                        height: 1,
                        display: "block",
                        borderRadius: 1,
                        objectFit: "cover",
                      }}
                    />
                  );
                }

                return <Box key={index} sx={{ borderRadius: 1, bgcolor: "grey.200" }} />;
              })}
            </Box>
          )}

          {extraExercisesCount > 0 ? <Badge>+{extraExercisesCount}</Badge> : null}
        </PreviewBox>

        <CardContent sx={{ px: 1.5, pt: 1.5, pb: 1.25 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              minHeight: "2.6em",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            <TranslateText>{item.name ?? "-"}</TranslateText>
          </Typography>

          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1 }}>
            <Iconify
              width={16}
              icon="solar:dumbbell-large-minimalistic-bold-duotone"
              sx={{ color: "text.secondary" }}
            />
            <Typography variant="body2" color="text.secondary">
              {exerciseCount} {t("EXERCISE")}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>

      <CardActions
        sx={{
          px: 1.5,
          pt: 0,
          pb: 1.5,
          gap: 1,
          minWidth: 0,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Button
          size="small"
          variant="contained"
          onClick={onOpenRoutine}
          sx={{ minWidth: 0, whiteSpace: "nowrap" }}
        >
          {t("SEE_DETAILS")}
        </Button>

        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            color="primary"
            aria-label={t("SHARE")}
            onClick={(event) => {
              event.stopPropagation();
              onShare(item);
            }}
          >
            <Iconify icon="solar:share-line-duotone" />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            aria-label={t("DELETE")}
            onClick={(event) => {
              event.stopPropagation();
              onRemove(item);
            }}
          >
            <Iconify icon="ic:round-close" />
          </IconButton>
        </Stack>
      </CardActions>
    </Card>
  );
}

const PreviewBox = styled(Box)(({ theme }) => ({
  position: "relative",
  margin: theme.spacing(1.5, 1.5, 0),
  borderRadius: theme.spacing(1.5),
  overflow: "hidden",
  backgroundColor: theme.palette.grey[100],
  aspectRatio: "4 / 3",
  [theme.breakpoints.up("md")]: {
    aspectRatio: "16 / 9",
  },
}));

const Badge = styled("div")(({ theme }) => ({
  top: 8,
  right: 8,
  zIndex: 1,
  height: 28,
  minWidth: 36,
  color: "white",
  display: "flex",
  borderRadius: 99,
  padding: "0 8px",
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid white",
  backgroundColor: alpha(theme.palette.common.black, 0.65),
}));
