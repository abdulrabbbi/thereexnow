"use client";

import TermsDialog from "@/sections/settings/terms/TermsDialog";
import { getTermsAccepted, setTermsAccepted } from "@/utils/terms-acceptance";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const REOPEN_DELAY_MS = 1200;

export function AcceptTermsModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const accepted = getTermsAccepted();

    setIsAccepted(accepted);
    setOpen(!accepted);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized || isAccepted || open) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setOpen(true);
    }, REOPEN_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isAccepted, isInitialized, open]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAccept = () => {
    setTermsAccepted();
    setIsAccepted(true);
    setOpen(false);
  };

  if (!isInitialized || !open || pathname === "/settings/terms") {
    return null;
  }

  return (
    <TermsDialog
      variant="intro"
      open={open}
      accepted={isAccepted}
      onClose={handleClose}
      onAccept={handleAccept}
    />
  );
}
