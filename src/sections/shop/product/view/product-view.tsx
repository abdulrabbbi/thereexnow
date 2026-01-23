"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { Products } from "@/graphql/generated";
import {
  useGetTranslatedProduct,
  useGetTranslatedSimilarProducts,
} from "@/hooks/helpers/translated-hooks";
import { useSearchParams } from "@/routes/hooks";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ProductGallery } from "../product-gallery";
import { ProductInfo } from "../product-info";
import { ProductSimilars } from "../product-similars";

export default function ProductView() {
  const searchParam = useSearchParams();

  const productId = searchParam.get("id");

  const { productData, productLoading } = useGetTranslatedProduct(
    Number(productId)
  );
  const { similarProductsData, similarProductsLoading } =
    useGetTranslatedSimilarProducts(Number(productId));

  let images = [] as Array<string>;

  try {
    images = JSON.parse(productData?.otherMediaUrl ?? "") ?? [];
  } catch (error) {
    images = [];
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 2, pt: 14 }}>
      {productLoading || similarProductsLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : (
        <>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, md: 6 }}>
              {images?.length ? <ProductGallery data={images} /> : null}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <ProductInfo product={productData as Products} />
            </Grid>
          </Grid>

          {similarProductsData?.length ? (
            <ProductSimilars data={similarProductsData as Array<Products>} />
          ) : null}
        </>
      )}
    </Container>
  );
}
