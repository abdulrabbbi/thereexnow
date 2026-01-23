import AnimateMarquee from "@/components/animate/animate-marquee";
import { Iconify } from "@/components/iconify";
import TranslateText from "@/components/translate-text";
import { Routines } from "@/graphql/generated";
import { useRouter } from "@/routes/hooks";
import { getRoutineRoute } from "@/routes/paths";
import { getAssetsUrl } from "@/utils";
import { alpha, Box, Card, Divider, Fab, Stack, styled } from "@mui/material";

type Props = {
  item: Routines;
  onShare: (routine: Routines) => void;
  onRemove: (routine: Routines) => void;
};

export function RoutineCard({ item, onShare, onRemove }: Props) {
  const router = useRouter();

  const routineExercises = item.routineExercises;

  const onClickHandler = () => {
    router.push(getRoutineRoute(item.id as number));
  };

  return (
    <Card
      onClick={onClickHandler}
      sx={{
        display: "flex",
        height: "350px",
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
        flexDirection: "column",

        "&:hover .overlay-div": {
          opacity: 1,
        },
      }}
    >
      <Stack
        p={2}
        key={item.id}
        direction="row"
        alignItems="center"
        className="overlay-div"
        justifyContent="space-between"
        sx={{
          top: 0,
          left: 0,
          right: 0,
          opacity: 0,
          zIndex: 999,
          position: "absolute",
          transition: (theme) => theme.transitions.create("opacity"),
        }}
      >
        <Fab
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();

            onShare(item);
          }}
        >
          <Iconify icon="solar:share-line-duotone" />
        </Fab>

        <Fab
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();

            onRemove(item);
          }}
        >
          <Iconify icon="ic:round-close" />
        </Fab>
      </Stack>

      <Stack
        divider={<Divider sx={{ borderColor: "grey.100" }} />}
        sx={(theme) => ({
          width: 1,
          position: "relative",
          height: "calc(100% - 48px)",
          bgcolor: "secondary.lighter",
          borderBottom: `1px solid ${theme.palette.grey[100]}`,
        })}
      >
        {Array(2)
          .fill(0)
          .map((_, index) => {
            const routineExercise = item.routineExercises?.[index];

            return (
              <Box
                component="img"
                key={routineExercise?.id ?? index}
                sx={{ width: 1, height: "150px", objectFit: "cover" }}
                src={
                  routineExercise
                    ? getAssetsUrl(
                        routineExercise?.exercise?.photoUrl as string
                      )
                    : undefined
                }
              />
            );
          })}

        {routineExercises?.length! > 2 ? (
          <Badge>+{routineExercises?.length! - 2}</Badge>
        ) : null}
      </Stack>

      <AnimateMarquee
        text={<TranslateText>{item.name ?? ""}</TranslateText>}
        slotProps={{
          box: { sx: { height: 48 } },
          typography: { sx: { p: 1.5 } },
        }}
      />
    </Card>
  );
}

const Badge = styled("div")(({ theme }) => ({
  width: 48,
  zIndex: 9,
  top: "50%",
  height: 48,
  left: "50%",
  color: "white",
  display: "flex",
  borderRadius: 8,
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid white",
  transform: "translate(-50%, -50%)",
  backgroundColor: alpha("#000", 0.6),
}));
