import { Field, Form } from "@/components/hook-form";
import { schemaHelper } from "@/components/hook-form/schema-helper";
import LanguageSelect from "@/components/language-select";
import {
  usePrintData_CreatePrintDataMutation,
  useUser_SendEmailMutation,
} from "@/graphql/generated";
import useLocales, { LANGS } from "@/hooks/use-locales";
import { useTranslate } from "@/hooks/use-translate";
import { useUser } from "@/hooks/use-user";
import { getSharedExercisesRoute } from "@/routes/paths";
import { HtmlStateType, SimplifiedExercise } from "@/types";
import { TRANSLATE_SEPARATOR } from "@/utils/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, DialogActions, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";

type Props = {
  note?: string;
  handleClose: VoidFunction;
  exercises: Array<SimplifiedExercise>;
};

const schema = Yup.object().shape({
  email: schemaHelper.email,
  language: schemaHelper.language,
});

const defaultValues = {
  email: "",
  language: LANGS[0].label,
};

export default function Email({ note, exercises, handleClose }: Props) {
  const { t, allLang } = useLocales();
  const { translate } = useTranslate();
  const { userData } = useUser();

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { mutateAsync: createPrintDataMutation } =
    usePrintData_CreatePrintDataMutation();

  const { mutateAsync: sendEmailMutation } = useUser_SendEmailMutation();

  const onSubmit = methods.handleSubmit(async (params) => {
    const language = allLang.find((el) => el.label === params.language)?.value;

    // Concatenate all notes, names, and workout moves with a separator
    const names = exercises?.map((item) => item.name).join(TRANSLATE_SEPARATOR);
    const notes = exercises?.map((item) => item.note).join(TRANSLATE_SEPARATOR);
    const workoutMoves = exercises
      .flatMap((item) => item.workoutMove)
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

    const createPrintDataResponse = await createPrintDataMutation({
      input: { data: JSON.stringify(payload) },
    });

    if (createPrintDataResponse.printData_createPrintData?.status.code === 1) {
      const id = createPrintDataResponse.printData_createPrintData.result?.id;

      const HELLO = await translate("Hello there", {
        language,
        convert: false,
      });
      const CONTENT = await translate(
        userData?.fullName +
          " has sent you an exercise program via TherEXnow services. Please click the link below to see what they have created for you and get started.",
        {
          language,
          convert: false,
        }
      );
      const THANKS = await translate("Thank You", {
        language,
        convert: false,
      });

      const sendEmailResponse = await sendEmailMutation({
        input: {
          to: params.email,
          subject: "TherEXnow",
          content:
            HELLO +
            "! <br/>" +
            CONTENT +
            " <br/> " +
            getSharedExercisesRoute(id!) +
            "<br/>" +
            THANKS,
        },
      });

      if (sendEmailResponse.user_sendEmail?.status?.code === 1) {
        toast.success(t("EMAIL_SUCCESRULLY_SENT"));
        handleClose();
      } else if (sendEmailResponse.user_sendEmail?.status.code === 105) {
        toast.error(t("TO_SHARE_MORE_EXERCISE_BY_EMAIL"));
      }
    } else if (
      createPrintDataResponse.printData_createPrintData?.status.code === 105
    ) {
      toast.error(t("FOR_SHARE_UPGRATE"));
    }
  });

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack pb={2} spacing={2}>
          <LanguageSelect />

          <Field.Text name="email" label={t("EMAIL")} />
        </Stack>

        <DialogActions sx={{ px: 0 }}>
          <Button
            fullWidth
            type="submit"
            loading={methods.formState.isSubmitting}
          >
            {t("SEND")}
          </Button>

          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={handleClose}
          >
            {t("CANCEL")}
          </Button>
        </DialogActions>
      </Form>
    </>
  );
}
