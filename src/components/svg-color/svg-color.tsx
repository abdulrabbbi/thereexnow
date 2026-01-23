"use client";

import { mergeClasses } from "@/utils/merge";
import { forwardRef } from "react";

import { styled } from "@mui/material/styles";

import { svgColorClasses } from "./classes";

import type { SvgColorProps } from "./types";

export const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
  (props, ref) => {
    const { src, className, sx, ...other } = props;

    return (
      <SvgRoot
        ref={ref}
        className={mergeClasses([svgColorClasses.root, className])}
        sx={[
          () => ({
            mask: `url(${src}) no-repeat center / contain`,
            WebkitMask: `url(${src}) no-repeat center / contain`,
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      />
    );
  }
);

const SvgRoot = styled("span")(() => ({
  width: 24,
  height: 24,
  flexShrink: 0,
  display: "inline-flex",
  backgroundColor: "currentColor",
}));
