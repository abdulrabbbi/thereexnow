import { CheckoutProvider } from "@/providers";
import CheckoutView from "@/sections/shop/checkout/view";

export default function Page() {
  return (
    <CheckoutProvider>
      <CheckoutView />
    </CheckoutProvider>
  );
}
