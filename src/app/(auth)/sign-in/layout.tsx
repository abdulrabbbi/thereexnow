import { AuthLayout } from "@/layouts/auth-layout";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <AuthLayout>{children}</AuthLayout>;
}
