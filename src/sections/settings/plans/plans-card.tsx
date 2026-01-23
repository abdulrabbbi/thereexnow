import {
  MembershipProvider,
  Memberships,
  Plans,
  useMembership_CancelSubscriptionMutation,
} from "@/graphql/generated";
import { useBoolean } from "@/hooks/use-boolean";
import useLocales from "@/hooks/use-locales";
import { Button, Card, CardHeader, Stack, Typography } from "@mui/material";
import { UpgradePlanDialog } from "./upgrade-plan-dialog";
import { toast } from "sonner";
import { useEffect } from "react";

type Props = {
  item: Plans & { features: Array<string> };
  isProAccount: boolean;
  membership: Memberships;
  refetchMembership?: () => void;
};

export function PlansCard({
  item,
  membership,
  isProAccount,
  refetchMembership,
}: Props) {
  const { t, currentLang } = useLocales();
  const upgradePlan = useBoolean();
  const { mutate: cancelSubscriptionMutate, isPending: cancelIsPending } =
    useMembership_CancelSubscriptionMutation();

  const subheader = (
    <Typography
      mt={3}
      textAlign="center"
      sx={{
        color: "grey.700",
        span: { fontWeight: 500, color: "grey.900" },
      }}
    >
      {!item?.priceYear && !item?.priceMonth ? (
        <span>
          <span>
            ${new Intl.NumberFormat(currentLang.value, {}).format(0.0)}
          </span>{" "}
          {item?.description}
        </span>
      ) : (
        <span>
          {item?.description}{" "}
          <span>
            $
            {new Intl.NumberFormat(currentLang.value, {}).format(
              item?.priceMonth
            )}
            /{t("MONTH")}
          </span>{" "}
          {t("OR")}{" "}
          <span>
            $
            {new Intl.NumberFormat(currentLang.value, {}).format(
              item?.priceYear
            )}
            /{t("YEAR")}
          </span>
        </span>
      )}{" "}
    </Typography>
  );

  function CancelSubscription() {
    cancelSubscriptionMutate(
      {},
      {
        onSuccess: (res) => {
          refetchMembership?.();
          if (res.membership_cancelSubscription?.code === 1)
            toast.success("Subscription Canceled Successfully");
          else toast.error("Something went wrong. Try again later");
        },
        onError: (err) => {
          console.log("err", err);
        },
      }
    );
  }

  return (
    <Card sx={{ px: 1, pb: 3, height: "100%" }}>
      <CardHeader
        title={item?.title}
        subheader={subheader}
        slotProps={{
          title: { variant: "h4", textAlign: "center" },
        }}
      />

      <Stack
        my={3}
        alignItems="center"
        justifyContent="center"
        sx={{ height: 56 }}
      >
        {item?.priceMonth === 0 && item?.priceYear === 0 ? (
          ""
        ) : isProAccount &&
          new Date(membership.endDate).getTime() > new Date().getTime() ? (
          <>
            {membership?.provider === MembershipProvider.Apple ? (
              <Typography px={3} variant="subtitle1" color="success.main">
                This subscription was purchased on iOS. Please cancel from your
                Apple ID subscription settings.
              </Typography>
            ) : membership?.provider === MembershipProvider.Google ? (
              <Typography px={3} variant="subtitle1" color="success.main">
                This subscription was purchased on Google Play. Please cancel
                from the Play Store on an Android device.
              </Typography>
            ) : (
              <Button onClick={CancelSubscription} loading={cancelIsPending}>
                Cancel Subscription
              </Button>
            )}
          </>
        ) : (
          <Button size="medium" onClick={upgradePlan.onTrue}>
            Upgrade to {item.title}
          </Button>
        )}
      </Stack>

      <Typography px={3} variant="h5">
        {item?.title} {t("FEATURES")}
      </Typography>

      <Stack mt={2} px={3} spacing={1}>
        {item.features.map((item, index) => (
          <Typography key={item}>&#9679; {item}</Typography>
        ))}
      </Stack>

      <UpgradePlanDialog
        plan={item}
        open={upgradePlan.value}
        onClose={upgradePlan.onFalse}
      />
    </Card>
  );
}
