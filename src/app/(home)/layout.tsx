"use client";

import { MainLayout } from "@/layouts/main-layout";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout>{children}</MainLayout>;
}
