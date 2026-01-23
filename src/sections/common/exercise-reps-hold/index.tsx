import { Exercises } from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { useMockData } from "@/hooks/use-mock-data";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import VerticalRadioGroup from "../vertical-radio-group";

type onChangeArgs = {
  value: string;
  exerciseId: number;
  field: "hold" | "reps" | "holdType";
};

type Props = {
  exerciseId: number;
  reps: Exercises["reps"];
  hold: Exercises["reps"];
  holdType: Exercises["holdType"];
  onChange?: (args: onChangeArgs) => void;
};

export function ExerciseRepsHold({
  reps,
  hold,
  holdType,
  onChange,
  exerciseId,
}: Props) {
  const { t } = useLocales();
  const { HOLD_OPTIONS } = useMockData();

  return (
    <Grid container spacing={2}>
      <Grid size={4} sx={{ pt: 1.2 }}>
        <TextField
          size="small"
          type="number"
          value={reps}
          label={t("REPS")}
          disabled={!onChange}
          onChange={(e) =>
            onChange?.({ exerciseId, field: "reps", value: e.target.value })
          }
        />
      </Grid>
      <Grid size={4} sx={{ pt: 1.2 }}>
        <TextField
          size="small"
          type="number"
          value={hold}
          label={t("HOLD")}
          disabled={!onChange}
          onChange={(e) =>
            onChange?.({ exerciseId, field: "hold", value: e.target.value })
          }
        />
      </Grid>
      <Grid size={4}>
        <VerticalRadioGroup
          disabled={!onChange}
          options={HOLD_OPTIONS}
          value={holdType.toString()}
          onChange={(newValue) =>
            onChange?.({ exerciseId, field: "holdType", value: newValue })
          }
        />
      </Grid>
    </Grid>
  );
}
