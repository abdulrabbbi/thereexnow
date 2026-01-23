import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

type Props = {
  value: string;
  disabled?: boolean;
  onChange: (newValue: string) => void;
  options: Array<{ label: string; value: string }>;
};
export default function VerticalRadioGroup({
  value,
  options,
  disabled,
  onChange,
}: Props) {
  return (
    <RadioGroup value={value} onChange={(e, newValue) => onChange(newValue)}>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          disabled={disabled}
          label={option.label}
          value={option.value}
          control={<Radio sx={{ p: 0.5 }} />}
        />
      ))}
    </RadioGroup>
  );
}
