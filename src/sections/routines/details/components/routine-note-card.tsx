import { useDebouncedValue } from "@/hooks/use-debounced-value";
import useLocales from "@/hooks/use-locales";
import { Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function RoutineNoteCard({ value, onChange }: Props) {
  const { t } = useLocales();
  const [localValue, setLocalValue] = useState(value);
  const lastSubmittedValueRef = useRef(value);
  const debouncedValue = useDebouncedValue(localValue, 500);

  useEffect(() => {
    setLocalValue(value);
    lastSubmittedValueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (debouncedValue === lastSubmittedValueRef.current) return;

    lastSubmittedValueRef.current = debouncedValue;
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  const commitOnBlur = () => {
    if (localValue === lastSubmittedValueRef.current) return;

    lastSubmittedValueRef.current = localValue;
    onChange(localValue);
  };

  return (
    <Card sx={{ mb: 2, minWidth: 0 }}>
      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, "&:last-child": { pb: 2 } }}>
        <Stack spacing={1.25} sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t("ROUTINE_NOTE")}
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={4}
            value={localValue}
            onBlur={commitOnBlur}
            onChange={(event) => setLocalValue(event.target.value)}
            placeholder={t("ROUTINE_NOTE")}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
