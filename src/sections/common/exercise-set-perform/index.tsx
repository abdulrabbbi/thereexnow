import { Exercises } from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { useMockData } from "@/hooks/use-mock-data";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import VerticalRadioGroup from "../vertical-radio-group";

type onChangeArgs = {
  value: string;
  exerciseId: number;
  field: "set" | "perform" | "performType";
};

type Props = {
  exerciseId: number;
  set: Exercises["set"];
  perform: Exercises["perform"];
  performType: Exercises["performType"];
  onChange?: (args: onChangeArgs) => void;
};

export function ExerciseSetPerform({
  set,
  perform,
  onChange,
  exerciseId,
  performType,
}: Props) {
  const { t } = useLocales();
  const { PERFORM_OPTIONS } = useMockData();

  return (
    <Grid container spacing={2}>
      <Grid size={4} sx={{ pt: 1.2 }}>
        <TextField
          value={set}
          size="small"
          type="number"
          label={t("SET")}
          disabled={!onChange}
          onChange={(e) =>
            onChange?.({ exerciseId, field: "set", value: e.target.value })
          }
        />
      </Grid>
      <Grid size={4} sx={{ pt: 1.2 }}>
        <TextField
          size="small"
          type="number"
          value={perform}
          label={t("PERFORM")}
          disabled={!onChange}
          onChange={(e) =>
            onChange?.({ exerciseId, field: "perform", value: e.target.value })
          }
        />
      </Grid>
      <Grid size={4}>
        <VerticalRadioGroup
          disabled={!onChange}
          options={PERFORM_OPTIONS}
          value={performType.toString() as string}
          onChange={(newValue) =>
            onChange?.({ exerciseId, field: "performType", value: newValue })
          }
        />
      </Grid>
    </Grid>
  );
}
