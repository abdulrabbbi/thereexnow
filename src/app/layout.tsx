import type { Metadata, Viewport } from "next";

import { MotionLazy } from "@/components/animate/motion-lazy";
import ProgressBar from "@/components/progress-bar";
import { Snackbar } from "@/components/snackbar";
import { GLOBAL_CONFIG } from "@/global-config";
import {
  AuthProvider,
  BoardProvider,
  GlobalModalProvider,
  TanstackProvider,
} from "@/providers";
import GlobalModal from "@/providers/global-modal-provider/modal-component";
import { primaryFont } from "@/theme/core";
import { primary } from "@/theme/core/palette";
import { ThemeProvider } from "@/theme/theme-provider";
import { PropsWithChildren } from "react";
import './global.css'

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: "device-width",
  themeColor: primary.main,
};

export const metadata: Metadata = {
  title: GLOBAL_CONFIG.appName,
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning className={primaryFont.className}>
      <body>
        <ThemeProvider>
          <GlobalModalProvider>
            <TanstackProvider>
              <AuthProvider>
                <BoardProvider>
                  <MotionLazy>
                    <Snackbar />
                    <ProgressBar />
                    <GlobalModal />
                    {children}
                  </MotionLazy>
                </BoardProvider>
              </AuthProvider>
            </TanstackProvider>
          </GlobalModalProvider>
        </ThemeProvider>
        </body>
    </html>
  );
}
