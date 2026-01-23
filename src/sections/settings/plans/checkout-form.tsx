import { useMembership_CreateMembershipMutation } from "@/graphql/generated";
import { useRouter } from "@/routes/hooks";
import { primaryFont } from "@/theme/core";
import { Box, Button, Stack, useTheme } from "@mui/material";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  planId: number;
  clientSecret: string;
  onClose: VoidFunction;
  paymentAmount: number;
};

export function CheckoutForm({
  planId,
  onClose,
  clientSecret,
  paymentAmount,
}: Props) {
  const theme = useTheme();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();

  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const {
    isPending: createMembershipLoading,
    mutateAsync: createMembershipMutation,
  } = useMembership_CreateMembershipMutation();

  const onSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    if (error) {
      elements?.getElement("card")?.focus();
      return;
    }

    await createMembershipMutation(
      { input: { planId, paymentAmount } },
      {
        onSuccess: async (res) => {
          if (res.membership_createMembership?.status.code === 1) {
            const result = await stripe.confirmCardPayment(clientSecret, {
              payment_method: {
                card: elements.getElement(CardElement)!,
              },
            });

            if (result?.paymentIntent?.status === "succeeded") {
              queryClient.invalidateQueries({ queryKey: ["plan_getPlans"] });
              queryClient.invalidateQueries({
                queryKey: ["membership_getCurrentMembership"],
              });

              toast.info("Your plan upgraded!");

              onClose();
            }
            router.refresh();
          } else {
            toast.warning(res.membership_createMembership?.status?.value);
          }
        },
      }
    );
  };

  return (
    <div>
      <label>Card Details</label>
      <Box
        sx={{
          p: 1.5,
          mt: 0.5,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <CardElement
          onChange={(e) => {
            setError(e.error?.message);
            setIsCompleted(e.complete);
          }}
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: theme.palette.text.primary,
                fontFamily: primaryFont.style.fontFamily,

                "::placeholder": {
                  color: theme.palette.text.secondary,
                },
              },
              invalid: {
                color: theme.palette.error.main,
                iconColor: theme.palette.error.dark,
              },
            },
          }}
        />
      </Box>

      <Stack pt={3} pb={2} spacing={2} direction="row" alignItems="center">
        <Button
          fullWidth
          onClick={onSubmit}
          disabled={!isCompleted}
          loading={createMembershipLoading}
        >
          Pay
        </Button>

        <Button fullWidth color="inherit" onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </Stack>
    </div>
  );
}
