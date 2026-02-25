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
import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from "react";

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
  hideAddButton?: boolean;
};

export const ExerciseWorkout = memo(function ExerciseWorkout({
  sx,
  data,
  onAdd,
  onRemove,
  onChange,
  exerciseId,
  hideAddButton = false,
}: Props) {
  const { t, currentLang } = useLocales();
  const [texts, setTexts] = useState<string[]>([]);
  const { translateAll, isPending } = useSimpleTranslate();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentLang.value === "en") {
      setTexts(data);
      return;
    }

    if (!isPending) {
      translateAll(data, setTexts);
    }
  }, [currentLang.value, data, isPending, translateAll]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const addNewItem = useCallback(() => {
    onAdd?.(exerciseId);
    setTexts((pre) => [...pre, ""]);
  }, [exerciseId, onAdd]);

  const removeItem = useCallback((index: number) => {
    setTexts((currentTexts) => currentTexts.filter((_, idx) => idx !== index));
    onRemove?.({ index, exerciseId });
  }, [exerciseId, onRemove]);

  const onChangeValue = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const nextValue = e.target.value;
    setTexts((currentTexts) => {
      const newValues = [...currentTexts];
      newValues[index] = nextValue;
      return newValues;
    });

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      if (currentLang.value !== "en" && !!nextValue.trim()) {
        translateAll(
          [nextValue],
          (translatedData) => {
            onChange?.({
              index,
              exerciseId,
              value: translatedData?.[0] ?? nextValue,
            });
          },
          currentLang.value,
          "en"
        );
      } else {
        onChange?.({ index, exerciseId, value: nextValue });
      }
    }, 500);
  }, [currentLang.value, exerciseId, onChange, translateAll]);

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
            multiline
            minRows={2}
            label={`${t("Workout_Step")} ${new Intl.NumberFormat(currentLang.value, {}).format(index + 1)} `}
            onChange={(e) => onChangeValue(e, index)}
            sx={{
              "& .MuiInputBase-root": {
                alignItems: "flex-start",
              },
              "& .MuiInputBase-input": {
                lineHeight: 1.5,
              },
            }}
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
                      sx={{ width: 44, height: 44 }}
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

      {onAdd && !hideAddButton ? (
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
});
