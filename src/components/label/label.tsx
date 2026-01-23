import { mergeClasses } from "@/utils/merge";
import { forwardRef } from "react";

import { labelClasses } from "./classes";
import { LabelIcon, LabelRoot } from "./styles";

import type { LabelProps } from "./types";

// ----------------------------------------------------------------------

export const Label = forwardRef<HTMLSpanElement, LabelProps>((props, ref) => {
  const {
    endIcon,
    children,
    startIcon,
    className,
    disabled,
    variant = "soft",
    color = "default",
    sx,
    ...other
  } = props;

  return (
    <LabelRoot
      ref={ref}
      color={color}
      variant={variant}
      disabled={disabled}
      className={mergeClasses([labelClasses.root, className])}
      sx={sx}
      {...other}
    >
      {startIcon && (
        <LabelIcon className={labelClasses.icon}>{startIcon}</LabelIcon>
      )}

      {children}

      {endIcon && (
        <LabelIcon className={labelClasses.icon}>{endIcon}</LabelIcon>
      )}
    </LabelRoot>
  );
});
