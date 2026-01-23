import { SimplifiedExercise } from "@/types";
import { Box, Stack, Typography } from "@mui/material";
import { forwardRef, useMemo } from "react";
import ExerciseItem from "../exercise-item";

type Props = {
  note?: string;
  author: string;
  language?: string;
  exercises: Array<SimplifiedExercise>;
};

export const SharedExercisesList = forwardRef<HTMLDivElement, Props>(
  ({ note, author, exercises, language }, ref) => {
    const isRtl = useMemo(() => {
      if (language) {
        return ["Arabic", "Hebrew", "Persian"].includes(language);
      } else return false;
    }, [language]);

    return (
      <Box
        component="div"
        ref={ref}
        dir={isRtl ? "rtl" : "ltr"}
        className="print-container"
      >
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          className="printViewHeader"
        >
          <Box
            component="img"
            src="/images/logo.png"
            sx={{ width: 96, height: 96 }}
          />

          <Stack width={1}>
            <Typography fontSize={21} fontWeight={700} textAlign="center">
              {author}
            </Typography>

            {note ? (
              <Typography mt={1} fontSize={16} color="grey.700">
                {note}
              </Typography>
            ) : null}
          </Stack>
        </Stack>

        <table style={{ borderSpacing: "0rem 20mm", width: "100%" }}>
          {exercises.map((item, index) => (
            <tr>
              <td>
                <div
                  key={index}
                  className={`no-break`}
                >
                  <ExerciseItem exercise={item} />
                </div>
              </td>
            </tr>
          ))}
        </table>
      </Box>
    );
  }
);
