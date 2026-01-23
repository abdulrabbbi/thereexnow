import useLocales from "@/hooks/use-locales";
import { useMockData } from "@/hooks/use-mock-data";
import { openWindow } from "@/routes/utils";
import { SimplifiedExercise } from "@/types";
import { getAssetsUrl } from "@/utils";
import { Box, Stack, Typography } from "@mui/material";
import QRCode from "react-qr-code";

type Props = {
  exercise: SimplifiedExercise;
};

export default function ExerciseItem({ exercise }: Props) {
  const { t } = useLocales();
  const { HOLD_OPTIONS, PERFORM_OPTIONS } = useMockData();

  const holdPostfix = HOLD_OPTIONS.find(
    (el) => el.value === exercise.holdType
  )?.label;
  const performPostfix = PERFORM_OPTIONS.find(
    (el) => el.value === exercise.performType
  )?.label;

  const stats = [
    { label: "REPS", value: exercise.reps, postfix: "Times" },
    {
      label: "HOLD",
      value: exercise.hold,
      postfix: holdPostfix,
    },
    { label: "SET", value: exercise.set },
    {
      label: "PERFORM",
      value: exercise.perform,
      postfix: `Times per ${performPostfix}`,
    },
  ].filter((el) => Boolean(el.value));

  const exerciseVideo = exercise.otherMedia?.filter(
    (el) => el.type === "video"
  );

  return (
    <Stack
      spacing={3.5}
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "center", sm: "initial" }}
      className="print_item_container"
    >
      <Stack sx={{ width: 323, height: 261 }}>
        <Box
          component="img"
          src={getAssetsUrl(exercise.photoUrl)}
          sx={{
            width: 323,
            height: 261,
            bgcolor: "white",
            objectFit: "contain",
            borderRadius: "10px",
            border: "1px solid #C8C6C6",
          }}
        />
      </Stack>

      <Stack sx={{ flex: 1 }}>
        <Typography mb={1} fontSize={18} fontWeight={700}>
          {exercise?.name}
        </Typography>

        {/* {exercise.note ? (
          <Typography mb={2} fontSize={14}>
            {exercise.note}
          </Typography>
        ) : null} */}

        {exercise.workoutMove?.map((item, index) => (
          <Stack key={index} direction="row" spacing={0.5} alignItems="start">
            <span>{index + 1}.</span>
            <Typography fontSize={16} fontWeight={400} color="grey.800">
              {item}
            </Typography>
          </Stack>
        ))}

        {stats.length ? (
          <Box
            mt={2}
            display={'flex'}
            flexWrap={'wrap'}
            gap={'0.25rem 0'}
            height={'4.4rem'}
            // display="grid"
            // gridTemplateColumns={{
            //   xs: "repeat(2, 1fr)",
            // }}
          >
            {stats.map((item, index) => (
              <Typography
                key={index}
                fontSize={18}
                sx={{ fontWeight: 400, span: { fontWeight: 700 }, width:"50%" }}
              >
                <span>{t(item.label)}</span>: {item.value} {item.postfix}
              </Typography>
            ))}
          </Box>
        ) : null}

        {exerciseVideo?.length ? (
          <Stack
            mt={3}
            spacing={10}
            flexWrap="wrap"
            direction="row"
            alignItems="center"
          >
            {exerciseVideo?.map((item, index) => (
              <Box
                key={index}
                component={QRCode}
                value={getAssetsUrl(item?.url)}
                onClick={() => openWindow(getAssetsUrl(item?.url))}
                sx={{
                  width: "65px",
                  height: "65px",
                  cursor: "pointer",
                }}
              />
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
}
