import { ConfirmDialog } from "@/components/custom-dialog";
import {
  Plans,
  useMembership_CreateIntentForPaymentMutation,
  useMembership_CreateSubscriptionMutation,
} from "@/graphql/generated";
import { useBoolean } from "@/hooks/use-boolean";
import { Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PaymentDialog } from "./payment-dialog";
import useLocales from "@/hooks/use-locales";

type Props = {
  plan: Plans;
  open: boolean;
  onClose: VoidFunction;
};

const OPTIONS = [
  {
    value: "month",
    option: "Monthly",
  },
  {
    value: "year",
    option: "Yearly",
  },
];

export function UpgradePlanDialog({ open, plan, onClose }: Props) {
  const { t } = useLocales();
  const paymentDialog = useBoolean();

  const [planMode, setPlanMode] = useState<string>("");

  useEffect(() => {
    if (!open && planMode != "") {
      setPlanMode("");
    }
  }, [open]);

  const { data: createIntentResponse } =
    useMembership_CreateIntentForPaymentMutation();

  const {
    mutateAsync: createSubscriptionMutation,
    isPending: createIntentLoading,
  } = useMembership_CreateSubscriptionMutation();

  const onUpgradeClickHandler = () => {
    if ((planMode === "month" ? plan.priceMonth : plan.priceYear) === 0) {
      return;
    } else {
      createSubscriptionMutation(
        {
          forYear: planMode !== "month",
          cancelUrl:
            window.location.origin + "/subscription-result?status=failed",
          successUrl:
            window.location.origin + "/subscription-result?status=success",
        },
        {
          onSuccess: (res) => {
            if (res.membership_createSubscription?.result)
              window.location.href = res.membership_createSubscription?.result;
            else toast.error(res.membership_createSubscription?.status.message|| 'Something went wrong. Try again later')
          },
        }
      );
    }
  };

  return (
    <>
      <ConfirmDialog
        open={open}
        onClose={onClose}
        title={t("UPGRADE_TO_PRO")}
        cancelProps={{ color: "inherit", fullWidth: true }}
        action={
          <Button
            fullWidth
            disabled={!planMode}
            loading={createIntentLoading}
            onClick={onUpgradeClickHandler}
          >
            Upgrade
          </Button>
        }
        content={
          <Stack>
            <Typography mb={2}>
              {t("TO_USE_MORE_OPTIONS_UPGRADE_YOUR_PLAN")}
            </Typography>

            <TextField
              select
              label="Plan mode"
              value={planMode}
              onChange={(e) => setPlanMode(e.target.value)}
            >
              {OPTIONS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.option}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        }
      />

      {paymentDialog.value ? (
        <PaymentDialog
          planId={plan.id}
          open={paymentDialog.value}
          onClose={paymentDialog.onFalse}
          intent={
            createIntentResponse?.membership_createIntentForPayment?.result!
          }
          paymentAmount={
            planMode === "month"
              ? (plan.priceMonth ?? 0)
              : (plan.priceYear ?? 0)
          }
        />
      ) : null}
    </>
  );
}
