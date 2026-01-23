import { Form } from "@/components/hook-form";
import { Products } from "@/graphql/generated";
import { useGetTranslatedExerciseProducts } from "@/hooks/helpers/translated-hooks";
import useLocales from "@/hooks/use-locales";
import { SimplifiedExerciseDto } from "@/types";
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { ProductCard } from "../shop/product-card";

type Props = {
  handleClose: VoidFunction;
  data: SimplifiedExerciseDto;
};

const defaultValues = {
  products: [],
};

export function EquipmentDialog({ data, handleClose }: Props) {
  const { t } = useLocales();

  const { exerciseProductsData, exerciseProductsLoading } =
    useGetTranslatedExerciseProducts(Number(data.exercise?.id));

  const methods = useForm({ defaultValues });

  const onSubmit = methods.handleSubmit(async (values) => {
    console.log(values);
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {exerciseProductsLoading ? (
        <Stack
          width="100%"
          height={100}
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Stack>
      ) : (
        <Box
          pt={2}
          rowGap={3}
          display="grid"
          columnGap={2.5}
          gridTemplateColumns={{
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          }}
        >
          {exerciseProductsData?.map((item) => (
            <ProductCard key={item?.id} data={item as Products} />
          ))}
        </Box>
      )}

      <DialogActions sx={{ px: 0 }}>
        <Button
          onClick={handleClose}
          sx={{ width: { xs: "100%", sm: "100px" } }}
        >
          {t("DONE")}
        </Button>
      </DialogActions>
    </Form>
  );
}
