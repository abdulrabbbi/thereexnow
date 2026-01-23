import { Form } from "@/components/hook-form";
import { schemaHelper } from "@/components/hook-form/schema-helper";
import LanguageSelect from "@/components/language-select";
import { useUser_IncrementPrintCountMutation } from "@/graphql/generated";
import useLocales, { LANGS } from "@/hooks/use-locales";
import { useSetState } from "@/hooks/use-set-state";
import { useTranslate } from "@/hooks/use-translate";
import { useUser } from "@/hooks/use-user";
import { SimplifiedExercise } from "@/types";
import { TRANSLATE_SEPARATOR } from "@/utils/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, DialogActions, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as Yup from "yup";
import { SharedExercisesList } from "../exercises-list";

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

export default function Print({ note, exercises, handleClose }: Props) {
  const { t, allLang } = useLocales();
  const { translate } = useTranslate();
  const { isPro, userData } = useUser();

  const { state, setState } = useSetState<StateType>({
    note: "",
    author: "",
    exercises: [],
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const formValues = methods.watch();

  const {
    mutate: incrementPrintCountMutation,
    isPending: incrementPrintCountLoading,
  } = useUser_IncrementPrintCountMutation();

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

    setState({
      author,
      note: translatedNote,
      exercises: translatedData as Array<SimplifiedExercise>,
    });
  });

  const handleBack = () => {
    setState({ note: "", exercises: [] });
  };

  const contentRef = useRef<HTMLDivElement>(null);

  const onPrint = () => {
    incrementPrintCountMutation(
      {},
      {
        onSuccess: (data) => {
          const printCount = data?.user_incrementPrintCount?.result?.printCount;

          if (isPro || (!isPro && printCount! < 4)) {
            window.print();
          } else {
            toast.error(t("FOR_SHARE_UPGRATE"));
          }
        },
      }
    );
  };

  const isTranslated = !!state.exercises.length;

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack pb={2} spacing={2}>
          {isTranslated ? null : <LanguageSelect />}

          {isTranslated ? (
            <SharedExercisesList
              ref={contentRef}
              note={state.note}
              author={state.author}
              exercises={state.exercises}
              language={formValues.language}
            />
          ) : null}
        </Stack>

        <DialogActions sx={{ px: 0 }} className="hide-in-print">
          <Button
            fullWidth
            type={isTranslated ? "button" : "submit"}
            loading={
              methods.formState.isSubmitting || incrementPrintCountLoading
            }
            {...(isTranslated && { onClick: onPrint })}
          >
            {isTranslated ? t("PRINT") : t("SUBMIT")}
          </Button>

          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={isTranslated ? handleBack : handleClose}
          >
            {isTranslated ? t("BACK") : t("CANCEL")}
          </Button>
        </DialogActions>
      </Form>
    </>
  );
}
