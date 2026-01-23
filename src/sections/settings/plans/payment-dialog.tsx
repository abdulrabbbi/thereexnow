import { ConfirmDialog } from "@/components/custom-dialog";
import { IntentDto } from "@/graphql/generated";
import { Box } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";
import { CheckoutForm } from "./checkout-form";

type Props = {
  open: boolean;
  planId: number;
  intent: IntentDto;
  onClose: VoidFunction;
  paymentAmount: number;
};

export function PaymentDialog({
  open,
  intent,
  planId,
  onClose,
  paymentAmount,
}: Props) {
  const options = useMemo(
    () => ({
      clientSecret: intent?.clientSecret as string,
    }),
    [intent]
  );

  return (
    <ConfirmDialog
      open={open}
      title="Payment"
      onClose={onClose}
      cancelProps={{ hideCancelButton: true }}
      content={
        <Box>
          <Elements
            options={options}
            stripe={loadStripe(intent?.publishableKey as string)}
          >
            <CheckoutForm
              planId={planId}
              onClose={onClose}
              paymentAmount={paymentAmount}
              clientSecret={intent?.clientSecret as string}
            />
          </Elements>
        </Box>
      }
    />
  );
}
