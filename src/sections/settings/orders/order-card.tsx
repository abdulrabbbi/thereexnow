"use client";

import { RequestDto, RequestProducts } from "@/graphql/generated";
import { useAppSettings } from "@/hooks/helpers/app-settings";
import useLocales from "@/hooks/use-locales";
import { getAssetsUrl } from "@/utils";
import { fCurrency } from "@/utils/format-number";
import { fDate } from "@/utils/format-time";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";

type Props = {
  order: RequestDto;
};
export function OrderCard({ order }: Props) {
  const { t } = useLocales();
  const { appSettingsData } = useAppSettings();

  const subtotal = useMemo(
    () =>
      (order?.request?.requestProducts as Array<RequestProducts>)?.reduce(
        (total: number, item: RequestProducts) =>
          total + item.count * item.price,
        0
      ),
    [order.request?.requestProducts]
  );

  const total = useMemo(
    () => subtotal + appSettingsData?.shippingCost,
    [subtotal, appSettingsData?.shippingCost]
  );

  const renderPrices = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ p: 3, textAlign: "right", typography: "body2" }}
    >
      <Stack direction="row" sx={{ typography: "subtitle1" }}>
        <div>{t("TOTAL")}</div>
        <Box sx={{ width: 160 }}>{fCurrency(total) || "-"}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Card key={order?.request?.id}>
      <CardHeader
        title={`${t("ORDER_TIME")} ${fDate(order?.request?.createdDate)}`}
      />

      {order.request?.requestProducts?.map((item) => (
        <Stack
          key={item?.id}
          direction="row"
          alignItems="center"
          sx={{
            p: 3,
            minWidth: 640,
            borderBottom: (theme) =>
              `dashed 2px ${theme.palette.background.neutral}`,
          }}
        >
          <Avatar
            variant="rounded"
            sx={{ width: 48, height: 48, mr: 2 }}
            src={getAssetsUrl(item?.product?.photoUrl)}
          />

          <ListItemText
            primary={item?.product?.name}
            secondary={
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: item?.color,
                }}
              />
            }
            primaryTypographyProps={{ typography: "body2" }}
            secondaryTypographyProps={{
              component: "span",
              color: "text.disabled",
              mt: 0.5,
            }}
          />

          <Box sx={{ typography: "body2" }}>x{item?.count}</Box>

          <Box sx={{ width: 110, textAlign: "right", typography: "subtitle2" }}>
            {fCurrency(item?.price)}
          </Box>
        </Stack>
      ))}

      {renderPrices}
    </Card>
  );
}
