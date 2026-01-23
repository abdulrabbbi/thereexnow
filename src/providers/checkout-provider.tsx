"use client";

import { SplashScreen } from "@/components/loading-screen";
import { IntentDto } from "@/graphql/generated";
import { useSetState } from "@/hooks/use-set-state";
import { useRouter, useSearchParams } from "@/routes/hooks";
import { getCheckoutRoute } from "@/routes/paths";
import {
  createContext,
  PropsWithChildren,
  Suspense,
  useCallback,
  useMemo,
} from "react";

export type CheckoutShippingType = {
  country: string;
  address: string;
  state?: string;
  city?: string;
  zipCode?: string;
};

export type CheckoutContextValue = {
  completed: boolean;
  activeStep: number;
  onBackStep: () => void;
  onNextStep: () => void;
  initialStep: () => void;
  paymentIntent?: IntentDto;
  shipping?: CheckoutShippingType;
  onGotoStep: (step: number) => void;
  onSetIntent: (intent: IntentDto) => void;
  onChangeShipping: (shipping: CheckoutShippingType) => void;
};

export const PRODUCT_CHECKOUT_STEPS = ["ORDER_SUMMARY", "ADDRESS", "PAYMENT"];

export const CheckoutContext = createContext<CheckoutContextValue | undefined>(
  undefined
);

export default function CheckoutProvider({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Container>{children}</Container>
    </Suspense>
  );
}

function Container({ children }: PropsWithChildren) {
  const { state, setState } = useSetState<{
    shipping?: CheckoutShippingType;
    paymentIntent?: IntentDto;
  }>({
    shipping: undefined,
    paymentIntent: undefined,
  });

  const router = useRouter();

  const searchParams = useSearchParams();

  const activeStep = Number(searchParams.get("step"));

  const completed = activeStep === PRODUCT_CHECKOUT_STEPS.length;

  const initialStep = useCallback(() => {
    if (!activeStep || (activeStep && !state.shipping)) {
      const href = createUrl("go", 0);
      router.push(href);
    }
  }, [activeStep, router]);

  const onBackStep = useCallback(() => {
    const href = createUrl("back", activeStep);
    router.push(href);
  }, [activeStep, router]);

  const onNextStep = useCallback(() => {
    const href = createUrl("next", activeStep);
    router.push(href);
  }, [activeStep, router]);

  const onGotoStep = useCallback(
    (step: number) => {
      const href = createUrl("go", step);
      router.push(href);
    },
    [router]
  );

  const onChangeShipping = (shipping: CheckoutShippingType) => {
    setState({ shipping });
  };

  const onSetIntent = (paymentIntent: IntentDto) => {
    setState({ paymentIntent });
  };

  const memoizedValue = useMemo(
    () => ({
      ...state,
      completed,
      activeStep,
      initialStep,
      onBackStep,
      onNextStep,
      onGotoStep,
      onSetIntent,
      onChangeShipping,
    }),
    [completed, activeStep, onBackStep, onGotoStep, onNextStep, initialStep]
  );

  return (
    <CheckoutContext.Provider value={memoizedValue}>
      {children}
    </CheckoutContext.Provider>
  );
}

function createUrl(type: "back" | "next" | "go", activeStep: number) {
  const step = { back: activeStep - 1, next: activeStep + 1, go: activeStep }[
    type
  ];

  const stepParams = new URLSearchParams({ step: `${step}` }).toString();

  return `${getCheckoutRoute()}?${stepParams}`;
}
