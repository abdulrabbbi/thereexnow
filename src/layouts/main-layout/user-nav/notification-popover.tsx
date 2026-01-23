"use client";

import Loading from "@/app/loading";
import NotificationIcon from "@/assets/icons/notification-icon";
import { varHover } from "@/components/animate";
import { CustomPopover, usePopover } from "@/components/custom-popover";
import { Iconify } from "@/components/iconify";
import {
  Notification,
  NotificationType,
  SortEnumType,
  useNotification_DeleteMutation,
} from "@/graphql/generated";
import { useGetTranslatedNotifications } from "@/hooks/helpers/translated-hooks";
import useLocales from "@/hooks/use-locales";
import { scrollbarStyle } from "@/theme/styles";
import { fToNow } from "@/utils/format-time";
import {
  Box,
  ButtonBase,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { m } from "framer-motion";

export function NotificationPopover() {
  const { t } = useLocales();
  const popover = usePopover();

  const { data, refetch } = useGetTranslatedNotifications({
    take: 10,
    order: {
      createdDate: SortEnumType.Desc,
    },
    where: {
      isShown: {
        eq: false,
      },
    },
  });

  const {
    mutate,
    data: deleteNotifData,
    variables,
  } = useNotification_DeleteMutation();

  const notifications =
    data?.notification_getNotificationsWithSetRead?.result?.items;

  function getNotificationText(key: NotificationType) {
    switch (key) {
      case "RequestCreated":
        return t("YOUR_ORDER_HAS_BEEN_CREATED");
      case "MaxTryFreePlanForRoutine":
        return t("TO_ADD_MORER_ROUTINE");
      case "RequestAccepted":
        return "Your order has been accepted and will send it to you as soon as possible";
      case "RequestRejected":
        return "Your order has been rejected.";
      case "FreePlanPurchased":
        return t("YOUR_CURRENT_PLAN_IS_FREE");
      case "PlanUpgraded":
        return t("YOUR_CURRENT_PLAN_IS_PRO") + ".";
      case "MaxTryFreePlanForEmail":
        return t("TO_SHARE_MORE_EXERCISE_BY_EMAIL");
      case "MaxTryFreePlanForSms":
        return t("TO_SHARE_MORE_EXERCISE_BY_SMS");
      case "ExerciseDeleted":
        return "The test exercise has been deleted by the admin";
      case "RequestAccepted":
        return "Your order has been accepted by the admin";
      case "RequestRejected":
        return "Your order has been rejected by the admin";
      default:
        return "New notification received!";
    }
  }

  function removeNotif(data: Notification) {
    mutate(
      { notificationId: data.id },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  }

  return (
    <>
      <IconButton
        component={m.button}
        onClick={popover.onOpen}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.09)}
      >
        <NotificationIcon />
      </IconButton>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          arrow: { offset: 17 },
          root: { sx: { mt: 1.5 } },
          paper: { sx: { p: 1, width: 280 } },
        }}
      >
        <Stack
          p={0.1}
          spacing={1.5}
          divider={<Divider sx={{ borderStyle: "dashed" }} />}
          sx={{ maxHeight: 400, overflowY: "scroll", ...scrollbarStyle() }}
        >
          {notifications?.map((item) => (
            <ButtonBase
              key={item?.id}
              sx={{
                p: 0.5,
                display: "flex",
                borderRadius: 0.5,
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Stack
                sx={{
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Typography
                  variant="body2"
                  textAlign="left"
                  sx={{
                    flex: "1",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </Typography>

                {variables?.notificationId === item.id ? (
                  <Iconify icon="svg-spinners:90-ring-with-bg" width={20} />
                ) : (
                  <IconButton onClick={() => removeNotif(item as any)}>
                    <Iconify icon="ic:round-close" width={20} />
                  </IconButton>
                )}

                {!item?.isRead ? (
                  <Box
                    sx={{
                      width: 8,
                      display: "block",
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "info.main",
                    }}
                  />
                ) : null}
              </Stack>

              <Typography variant="caption" color="grey.600" textAlign="left">
                {item.description}
              </Typography>

              <Typography
                color="grey.500"
                variant="caption"
                textAlign="right"
                sx={{ alignSelf: "flex-end" }}
              >
                {fToNow(item?.createdDate!)}
              </Typography>
            </ButtonBase>
          ))}
        </Stack>
      </CustomPopover>
    </>
  );
}
