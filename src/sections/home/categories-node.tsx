import { Categories } from "@/graphql/generated";
import { Box, Stack } from "@mui/material";
import { CategoryButton } from "./category-button";

type Props = {
  index: number;
  category: Categories;
  direction: "RTL" | "LTR";
  top?: number;
};

export function CategoriesNode({ index, category, direction, top }: Props) {
  const offset = index % 3 == 0 ? 0 : index % 3 == 1 ? 4.5 : 9;

  return (
    <Stack
      key={index}
      width="100%"
      alignItems="center"
      direction={direction === "LTR" ? "row" : "row-reverse"}
      sx={{
        pl: direction === "LTR" ? offset : 0,
        pr: direction === "RTL" ? offset : 0,
        // marginTop: top
        top: top + '%',
        position: "absolute",
        left: direction === "LTR" ? offset : "auto",
        right: direction === "RTL" ? offset : "auto",
      }}
    >
      <CategoryButton category={category} />

      <Box sx={{ flex: 1, height: "0.6px", bgcolor: "#3f704d" }} />

      <Box
        sx={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          alignSelf: "center",
          bgcolor: "#3f704d",
        }}
      />
    </Stack>
  );
}
