import {
  ShoppingCart,
  useProduct_GetProductsQuery,
  useProduct_GetSimilarProductsQuery,
  useShoppingCart_CreateShoppingCartMutation,
  useShoppingCart_DeleteShoppingCartMutation,
  useShoppingCart_UpdateShoppingCartMutation,
} from "@/graphql/generated";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { useUser } from "../use-user";
import { useAppSettings } from "./app-settings";
import { useGetTranslatedShoppingCart } from "./translated-hooks";

type useGetProductsProps = {
  page?: number;
  keyword?: string;
  enabled?: boolean;
  categoryId?: number;
  subCategoryId?: number;
};
export function useGetProducts({
  page = 1,
  keyword = "",
  categoryId,
  subCategoryId,
}: useGetProductsProps) {
  const { data, isLoading, isFetching } = useProduct_GetProductsQuery(
    {
      take: 9,
      skip: page * 9,
      where: {
        isActive: { eq: true },
        ...(keyword.length && { name: { contains: keyword } }),

        ...((categoryId || subCategoryId) && {
          exerciseProducts: {
            some: {
              exercise: {
                subCategory: {
                  ...(categoryId && {
                    category: {
                      id: { eq: categoryId },
                    },
                  }),
                  ...(subCategoryId && {
                    id: { eq: subCategoryId },
                  }),
                },
              },
            },
          },
        }),
      },
    },
    {
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData, // Use previous data as placeholder
    }
  );

  const totalPages: number = useMemo(() => {
    const totalCount = Number(data?.product_getProducts?.result?.totalCount);

    return Math.ceil(totalCount / 9);
  }, [data]);

  return {
    productsLoading: isLoading,
    productsFetching: isFetching,
    productsTotalCount: totalPages,
    productsData: data?.product_getProducts?.result?.items,
  };
}

export function useGetProduct(productId: number) {
  const { data, isLoading } = useProduct_GetProductsQuery({
    where: { id: { eq: productId } },
  });

  const productData = data?.product_getProducts?.result?.items?.[0];

  return {
    productData,
    productLoading: isLoading,
  };
}

export function useGetSimilarProducts(productId: number) {
  const { data, isLoading } = useProduct_GetSimilarProductsQuery({
    productId,
  });

  const productData = data?.product_getSimilarProducts?.result?.items;

  return {
    similarProductsData: productData,
    similarProductsLoading: isLoading,
  };
}

export function useShop() {
  const { userData } = useUser();
  const queryClient = useQueryClient();
  const { appSettingsData } = useAppSettings();

  const { data, isLoading } = useGetTranslatedShoppingCart({
    take: 999,
    where: {
      userId: { eq: userData?.id },
    },
  });

  const shoppingCartData = data?.shoppingCart_getShoppingCarts?.result?.items;

  const invalidateShoppingCart = (status: any) => {
    if (status.code === 1) {
      queryClient.invalidateQueries({
        queryKey: ["shoppingCart_getShoppingCarts"],
      });
    } else {
      toast.warning(status.value);
    }
  };

  const createShoppingCart = useShoppingCart_CreateShoppingCartMutation({
    onSuccess: (res) =>
      invalidateShoppingCart(res.shoppingCart_createShoppingCart?.status),
  });

  const updateShoppingCart = useShoppingCart_UpdateShoppingCartMutation({
    onSuccess: (res) =>
      invalidateShoppingCart(res.shoppingCart_updateShoppingCart?.status),
  });

  const deleteShoppingCart = useShoppingCart_DeleteShoppingCartMutation({
    onSuccess: (res) =>
      invalidateShoppingCart(res.shoppingCart_deleteShoppingCart?.status),
  });

  const subtotal = useMemo(
    () =>
      (shoppingCartData as Array<ShoppingCart>)?.reduce(
        (total: number, item: ShoppingCart) =>
          total + item.count * item.product?.price,
        0
      ),
    [shoppingCartData]
  );

  const total = useMemo(
    () => subtotal + appSettingsData?.shippingCost,
    [subtotal, appSettingsData?.shippingCost]
  );

  return {
    createShoppingCart,
    updateShoppingCart,
    deleteShoppingCart,
    shoppingCartLoading: isLoading,
    shoppingCartData: data?.shoppingCart_getShoppingCarts?.result?.items,
    cartPrices: {
      total: total ?? 0,
      subtotal: subtotal ?? 0,
      shippingCost: appSettingsData?.shippingCost ?? 0,
    },
  };
}
