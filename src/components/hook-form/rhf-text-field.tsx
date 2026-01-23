import type { TextFieldProps } from "@mui/material/TextField";

import { useBoolean } from "@/hooks/use-boolean";
import { IconButton, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import { Iconify } from "../iconify";

type Props = TextFieldProps & {
  name: string;
};

export function RHFTextField({ name, helperText, type, ...other }: Props) {
  const password = useBoolean();
  const { control } = useFormContext();

  const isPassword = name?.toLowerCase()?.includes("password");

  // password
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          error={!!error}
          helperText={error?.message ?? helperText}
          value={type === "number" && field.value === 0 ? "" : field.value}
          onChange={(event) => {
            if (type === "number") {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          {...other}
          slotProps={{
            ...other.slotProps,
            input: {
              autoComplete: "off",
              ...other.slotProps?.input,
              ...(isPassword && {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify
                        icon={
                          password.value
                            ? "solar:eye-bold"
                            : "solar:eye-closed-bold"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }),
            },
          }}
          {...(isPassword && {
            type: password.value ? "text" : "password",
          })}
        />
      )}
    />
  );
}
