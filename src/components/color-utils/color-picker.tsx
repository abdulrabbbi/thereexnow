import type { BoxProps } from "@mui/material/Box";

import { forwardRef, useCallback } from "react";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import { alpha, alpha as hexAlpha } from "@mui/material/styles";

import { Iconify } from "../iconify";

import type { ColorPickerProps } from "./types";

export const ColorPicker = forwardRef<
  HTMLDivElement,
  BoxProps & ColorPickerProps
>(
  (
    {
      sx,
      colors,
      selected,
      onSelectColor,
      limit = "auto",
      slotProps,
      ...other
    },
    ref
  ) => {
    const singleSelect = typeof selected === "string";

    const handleSelect = useCallback(
      (color: string) => {
        if (singleSelect) {
          if (color !== selected) {
            onSelectColor(color);
          }
        } else {
          const newSelected = selected.includes(color)
            ? selected.filter((value) => value !== color)
            : [...selected, color];

          onSelectColor(newSelected);
        }
      },
      [onSelectColor, selected, singleSelect]
    );

    return (
      <Box
        ref={ref}
        component="ul"
        sx={{
          flexWrap: "wrap",
          flexDirection: "row",
          display: "inline-flex",
          paddingInlineStart: 0,
          ...(limit !== "auto" && {
            width: limit * 36,
            justifyContent: "flex-end",
          }),
          ...sx,
        }}
        {...other}
      >
        {colors.map((color) => {
          const hasSelected = singleSelect
            ? selected === color
            : selected.includes(color);

          return (
            <Box component="li" key={color} sx={{ display: "inline-flex" }}>
              <ButtonBase
                aria-label={color}
                onClick={() => handleSelect(color)}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  ...slotProps?.button,
                }}
              >
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: color,
                    borderRadius: "50%",
                    border: (theme) =>
                      `solid 1px ${alpha(theme.palette.grey["500"], 0.16)}`,
                    ...(hasSelected && {
                      transform: "scale(1.1)",
                      boxShadow: `4px 4px 8px 0 ${hexAlpha(color, 0.48)}`,
                      outline: `solid 2px ${hexAlpha(color, 0.08)}`,
                      transition: (theme) =>
                        theme.transitions.create("all", {
                          duration: theme.transitions.duration.shortest,
                        }),
                    }),
                    ...slotProps?.checkmark,
                  }}
                >
                  <Iconify
                    width={hasSelected ? 12 : 0}
                    icon="eva:checkmark-fill"
                    sx={{
                      color: (theme) => theme.palette.getContrastText(color),
                      transition: (theme) =>
                        theme.transitions.create("all", {
                          duration: theme.transitions.duration.shortest,
                        }),
                    }}
                  />
                </Stack>
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
    );
  }
);
