"use client";

import { PropsWithChildren } from "react";

import { SplashScreen } from "@/components/loading-screen";
import { useAuth } from "@/hooks/use-auth";
import { AcceptTermsModal } from "@/sections/home/terms-modal";
import { MainHeader } from "./main-header";

export function MainLayout({ children }: PropsWithChildren) {
  const { loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      <MainHeader />

      <AcceptTermsModal />

      {children}
    </>
  );
}
