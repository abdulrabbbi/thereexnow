import { Form } from "@/components/hook-form";
import { schemaHelper } from "@/components/hook-form/schema-helper";
import LanguageSelect from "@/components/language-select";
import {
  usePrintData_CreatePrintDataMutation,
  useUser_IncrementQrCodeCountMutation,
} from "@/graphql/generated";
import useLocales, { LANGS } from "@/hooks/use-locales";
import { useTranslate } from "@/hooks/use-translate";
import { useUser } from "@/hooks/use-user";
import { getSharedExercisesRoute } from "@/routes/paths";
import { openWindow } from "@/routes/utils";
import { HtmlStateType, SimplifiedExercise } from "@/types";
import { TRANSLATE_SEPARATOR } from "@/utils/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, DialogActions, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import * as Yup from "yup";

type StateType = {
  note: string;
  author: string;
  exercises: Array<SimplifiedExercise>;
};

type Props = {
  note?: string;
  handleClose: VoidFunction;
  exercises: Array<SimplifiedExercise>;
};

const schema = Yup.object().shape({
  language: schemaHelper.language,
});

const defaultValues = {
  language: LANGS[0].label,
};

export default function QrCode({ note, exercises, handleClose }: Props) {
  const { t, allLang } = useLocales();
  const { translate } = useTranslate();
  const { isPro, userData } = useUser();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { mutateAsync: incrementQrCodeCountMutation } =
    useUser_IncrementQrCodeCountMutation();

  const {
    data: createPrintData,
    reset: createPrintDataReset,
    mutateAsync: createPrintDataMutation,
  } = usePrintData_CreatePrintDataMutation();

  const onSubmit = methods.handleSubmit(async (params) => {
    const language = allLang.find((el) => el.label === params.language)?.value;

    // Concatenate all notes, names, and workout moves with a separator
    const names = exercises?.map((item) => item.name).join(TRANSLATE_SEPARATOR);
    const notes = exercises?.map((item) => item.note).join(TRANSLATE_SEPARATOR);
    const workoutMoves = exercises
      .flatMap((item) => item?.workoutMove)
      .join(TRANSLATE_SEPARATOR);

    // Translate the concatenated fields
    const [
      translatedNamesArray,
      translatedNotesArray,
      translatedWorkoutMovesArray,
      translatedHeadingArray,
    ] = await Promise.all([
      translate(names, { language }),
      translate(notes, { language }),
      translate(workoutMoves, { language }),
      translate(`Exercises created by ${TRANSLATE_SEPARATOR} on`, {
        language,
      }),
    ]);

    const author = `${translatedHeadingArray?.[0]} ${userData?.fullName ?? "Guest"} ${translatedHeadingArray?.[1]} ${dayjs().format("MMMM D, YYYY")}`;

    // Reconstruct the translated data
    let workoutMoveIndex = 0; // Track the current index in the translatedWorkoutMovesArray
    const translatedData = exercises.map((item, index) => {
      // Get the translated note and name
      const translatedName = translatedNamesArray?.[index];
      const translatedNote = translatedNotesArray?.[index];

      // Get the translated workout moves for this item
      const translatedWorkoutMove = item.workoutMove?.map(() => {
        const translatedMove = translatedWorkoutMovesArray?.[workoutMoveIndex];
        workoutMoveIndex++; // Move to the next workout move
        return translatedMove;
      });

      // Return the translated workout
      return {
        ...item,
        name: translatedName,
        note: translatedNote,
        workoutMove: translatedWorkoutMove,
      };
    });

    let translatedNote = "";
    if (note?.length) {
      translatedNote = (await translate(note, {
        convert: false,
        language,
      })) as string;
    }

    const payload: HtmlStateType = {
      author,
      user: userData,
      note: translatedNote,
      exercises: translatedData as Array<SimplifiedExercise>,
    };

    const res = await incrementQrCodeCountMutation({});
    const qrCodeCount = res?.user_incrementQrCodeCount?.result?.qrCodeCount;

    if (isPro || (!isPro && qrCodeCount! < 4)) {
      await createPrintDataMutation({
        input: { data: JSON.stringify(payload) },
      });
    } else {
      toast.error(t("FOR_SHARE_UPGRATE"));
    }
  });

  const isTranslated = !!createPrintData?.printData_createPrintData?.result?.id;

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack
          pb={2}
          spacing={2}
          alignItems={isTranslated ? "center" : "stretch"}
        >
          {isTranslated ? (
            <Box
              component={QRCode}
              value={getSharedExercisesRoute(
                createPrintData?.printData_createPrintData?.result?.id!
              )}
              onClick={() =>
                openWindow(
                  getSharedExercisesRoute(
                    createPrintData?.printData_createPrintData?.result?.id!
                  )
                )
              }
              sx={{
                width: "320px",
                height: "320px",
                cursor: "pointer",
              }}
            />
          ) : (
            <LanguageSelect />
          )}
        </Stack>

        <DialogActions sx={{ px: 0 }}>
          <Box sx={{ width: "100%", mr: 2 }}>
            <Button
              fullWidth
              type="submit"
              disabled={isTranslated}
              loading={methods.formState.isSubmitting}
              sx={{ display: isTranslated ? "none" : "initial" }}
            >
              {t("SUBMIT")}
            </Button>
          </Box>

          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={handleClose}
          >
            {isTranslated ? t("DONE") : t("CANCEL")}
          </Button>
        </DialogActions>
      </Form>
    </>
  );
}
