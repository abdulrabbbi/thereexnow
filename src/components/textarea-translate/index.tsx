import useLocales from "@/hooks/use-locales";
import useSimpleTranslate from "@/hooks/use-simple-translate";
import { TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

let timer: any = null;

export default function TextareaTranslate({
  description,
  onUpdateValue,
  placeholder
}: {
  description: string;
  onUpdateValue: (newValue: string) => void;
  placeholder?:string
}) {
  const [value, setValue] = useState("");
  const { translateAll } = useSimpleTranslate();
  const { t, currentLang } = useLocales();

  useEffect(() => {
    updateValue();
  }, [currentLang.value]);

  useEffect(() => {
    if (!value) {
      updateValue();
    }
  }, [description]);

  function updateValue() {
    if (currentLang.value === "en" || !description) setValue(description);
    else {
      translateAll([description], (translatedText) => {
        setValue(translatedText?.[0] ?? description);
      });
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setValue(e.target.value);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (currentLang.value !== "en" && !!e.target.value?.trim()) {
        translateAll(
          [e.target.value],
          (translatedData) => {
            onUpdateValue(translatedData?.[0] ?? e.target.value);
          },
          currentLang.value,
          "en"
        );
      } else {
        onUpdateValue(e.target.value);
      }
    }, 500);
  }

  return (
    <TextField
      rows={4}
      fullWidth
      multiline
      name="note"
      value={value}
      label={placeholder || t("ROUTINE_NOTE")}
      onChange={onChange}
    />
  );
}
