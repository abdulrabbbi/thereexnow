"use client";

import { LoadingScreen } from "@/components/loading-screen";
import {
  Memberships,
  Plans,
  useMembership_GetCurrentMembershipQuery,
} from "@/graphql/generated";
import { useGetTranslatedPlans } from "@/hooks/helpers/translated-hooks";
import useLocales from "@/hooks/use-locales";
import { Container, styled, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useMemo } from "react";
import { PlansCard } from "../plans-card";

const TextContainer = styled("div")(() => ({
  padding: "0 2rem",
}));

export default function PlansView() {
  const { t } = useLocales();

  const { data: plansData, isLoading: plansLoading } = useGetTranslatedPlans();
  const plans = plansData?.plan_getPlans?.result?.items;

  const {
    data: membershipData,
    isLoading: membershipLoading,
    refetch,
  } = useMembership_GetCurrentMembershipQuery();
  const membership = membershipData?.membership_getCurrentMembership?.result;

  const isProAccount = useMemo(
    () => !!membership && membership?.paymentAmount !== 0,
    [membership]
  );

  const isLoading = plansLoading || membershipLoading;

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, md: 2 } }}>
      <Typography mb={4} variant="h3">
        {t("PLANS")}
      </Typography>

      {isLoading ? (
        <LoadingScreen sx={{ height: "60svh" }} />
      ) : (
        <Grid container spacing={3} alignItems="stretch">
          {plans?.map((item) => {
            return (
              <Grid key={item?.id} size={{ xs: 12, md: 6 }}>
                <PlansCard
                  item={item as Plans & { features: Array<string> }}
                  isProAccount={isProAccount}
                  membership={membership as Memberships}
                  refetchMembership={refetch}
                />
              </Grid>
            );
          })}
        </Grid>
      )}

      <TextContainer>
        <section id="recurring-payment-disclaimer">
          <h2>
            Recurring Payment &amp; Subscription Disclaimer (U.S. Compliance)
          </h2>
          <p>
            <strong>Effective Date:</strong>November 2025
          </p>
          <p>
            By subscribing to our service, you acknowledge and agree to the
            following terms regarding automatic billing and renewals:
          </p>
          <h3>1. Subscription Plans</h3>
          <ul>
            <li>
              <strong>Monthly Plan:</strong> Billed once every month on the same
              date as your initial purchase.
            </li>
            <li>
              <strong>Annual Plan:</strong> Billed once every 12 months on the
              same date as your initial purchase.
            </li>
          </ul>
          <h3>2. Automatic Renewal</h3>
          <p>
            Each plan automatically renews at the end of its billing period
            (monthly or annual) unless you cancel your subscription before the
            renewal date. You authorize <strong>TherEXnow</strong> to
            automatically charge the payment method you provided for each
            renewal until you cancel.
          </p>
          <h3>3. Cancellation Policy</h3>
          <p>
            You can cancel your subscription at any time by accessing your
            account settings or contacting customer support at
            <a href="mailto:[therexnow22@gmail.com]">[therexnow22@gmail.com]</a>.
            Cancellations must be made at least{" "}
            <strong>one (1) day before</strong> the next billing date to avoid
            further charges.
          </p>
          <h3>4. Refund Policy</h3>
          <p>
            Payments are <strong>non‑refundable</strong> once the billing cycle
            has started. After cancellation, you will retain access until the
            end of the current paid period; partial refunds are not provided.
          </p>
          <h3>5. Price Changes</h3>
          <p>
            If we change our pricing or terms, we will notify you at least{" "}
            <strong>30 days in advance</strong> via the email on your account or
            through a prominent notice on our website. New rates will apply to
            the next renewal period.
          </p>
          <h3>6. Authorization</h3>
          <p>
            By completing your purchase, you give <strong>TherEXnow</strong>{" "}
            express permission to charge your selected payment method on a
            recurring basis according to your chosen plan. You acknowledge that
            you may revoke this authorization at any time by canceling your
            subscription as described above.
          </p>
          <hr />
          <h4>Legal References</h4>
          <ul>
            <li>
              <em>FTC Negative Option Rule (16 CFR § 310.2(u))</em>
            </li>
            <li>
              <em>
                Restore Online Shoppers' Confidence Act (ROSCA, 15 U.S.C. §
                8401–8405)
              </em>
            </li>
            <li>
              <em>
                California Auto‑Renewal Law (Bus. &amp; Prof. Code § 17600 et
                seq.)
              </em>
            </li>
          </ul>
        </section>
      </TextContainer>
    </Container>
  );
}
