"use client";

import {
  RequestDto,
  RequestStatus,
  useRequest_GetRequestsQuery,
} from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { useResponsive } from "@/hooks/use-responsive";
import { useTabs } from "@/hooks/use-tabs";
import { Container, Stack, Tab, Tabs, Typography } from "@mui/material";
import { OrderCard } from "../order-card";

export default function OrdersView() {
  const { t } = useLocales();
  const tabs = useTabs(RequestStatus.Waiting);
  const isDesktop = useResponsive("up", "sm");

  const { data, isLoading } = useRequest_GetRequestsQuery({
    where: { request: { requestStatus: { eq: tabs.value as RequestStatus } } },
  });

  const orders = data?.request_getRequests?.result?.items;

  const TABS = [
    {
      value: RequestStatus.Waiting,
      label: t("UNDELIVERED"),
    },
    {
      value: RequestStatus.Accepted,
      label: t("ACCEPTED"),
    },
    {
      value: RequestStatus.Rejected,
      label: t("REJECTED"),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
      <Typography mb={4} variant="h3">
        {t("ORDER")}
      </Typography>

      <Tabs
        value={tabs.value}
        onChange={tabs.onChange}
        variant={isDesktop ? "standard" : "fullWidth"}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Stack py={3} spacing={2}>
        {orders?.map((item) => (
          <OrderCard key={item?.request?.id} order={item as RequestDto} />
        ))}
      </Stack>

      <Typography>{t("FOR_FURTHER_ASSISTANCE_USE_CONTACT_US_PAGE")}</Typography>
    </Container>
  );
}
