import { Iconify } from "@/components/iconify";
import useLocales from "@/hooks/use-locales";
import useSimpleTranslate from "@/hooks/use-simple-translate";
import {
  Button,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  SxProps,
  TextField,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { ChangeEvent, useEffect, useState } from "react";

let timer: any = null;

type onRemoveArgs = {
  index: number;
  exerciseId: number;
};

type onChangeArgs = {
  index: number;
  value: string;
  exerciseId: number;
};

type Props = {
  exerciseId: number;
  sx?: SxProps<Theme>;
  data: Array<string>;
  onAdd?: (exerciseId: number) => void;
  onRemove?: (args: onRemoveArgs) => void;
  onChange?: (args: onChangeArgs) => void;
};

export function ExerciseWorkout({
  sx,
  data,
  onAdd,
  onRemove,
  onChange,
  exerciseId,
}: Props) {
  const { t, currentLang } = useLocales();
  const [texts, setTexts] = useState<string[]>([]);
  const { translateAll, isPending } = useSimpleTranslate();

  useEffect(() => {
    if (!isPending) {
      if (currentLang.value !== "en") translateAll(data, setTexts);
      else setTexts(data);
    }
  }, [currentLang.value, data]);

  function addNewItem() {
    onAdd?.(exerciseId);
    setTexts((pre) => [...pre, ""]);
  }

  function removeItem(index: number) {
    const newValues = [...texts];
    newValues.splice(index, 1);
    setTexts(newValues);
    onRemove?.({ index, exerciseId });
  }

  function onChangeValue(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) {
    const newValues = [...texts];
    newValues[index] = e.target.value;
    setTexts(newValues);

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (currentLang.value !== "en" && !!e.target.value?.trim()) {
        translateAll(
          [e.target.value],
          (translatedData) => {
            onChange?.({
              index,
              exerciseId,
              value: translatedData?.[0] ?? e.target.value,
            });
          },
          currentLang.value,
          "en"
        );
      } else onChange?.({ index, exerciseId, value: e.target.value });
    }, 500);
  }

  return (
    <Stack spacing={2} sx={sx}>
      {texts.map((value, index) => {
        if (isPending && !value) return <Skeleton component={"div"} />;
        return (
          <TextField
            key={index}
            size="small"
            value={value}
            disabled={!onChange}
            label={`${t("Workout_Step")} ${new Intl.NumberFormat(currentLang.value, {}).format(index + 1)} `}
            onChange={(e) => onChangeValue(e, index)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {new Intl.NumberFormat(currentLang.value, {}).format(
                      index + 1
                    )}
                    .
                  </InputAdornment>
                ),
                endAdornment: onRemove ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeItem(index)}
                    >
                      <Iconify icon="solar:minus-circle-line-duotone" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />
        );
      })}

      {onAdd ? (
        <Button
          size="medium"
          color="inherit"
          variant="outlined"
          onClick={addNewItem}
          disabled={Boolean(data.length) && !data[data.length - 1]}
        >
          {t("Add_New_Workout")}
        </Button>
      ) : null}
    </Stack>
  );
}
