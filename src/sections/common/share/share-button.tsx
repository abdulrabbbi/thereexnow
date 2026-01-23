import { Button, ButtonProps } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  color?: string;
  icon: ReactNode;
  onClick: ButtonProps["onClick"];
  disabled?: ButtonProps["disabled"];
};

export function ShareButton({ icon, onClick, disabled }: Props) {
  return (
    <Button
      color="secondary"
      onClick={onClick}
      variant="outlined"
      disabled={disabled}
      sx={{
        p: 1,
        width: 48,
        minWidth: 48,
        bgcolor: "#A69ED53e",
      }}
    >
      {icon}
    </Button>
  );
}
