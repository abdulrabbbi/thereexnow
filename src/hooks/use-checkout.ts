"use client";

import { CheckoutContext } from "@/providers/checkout-provider";
import { useContext } from "react";

export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context)
    throw new Error("useCheckout must be use inside CheckoutProvider");

  return context;
}
