"use client";

import { Iconify } from "@/components/iconify";
import { useResponsive } from "@/hooks/use-responsive";
import useLocales from "@/hooks/use-locales";
import { ACCEPT_TERMS_KEY } from "@/utils/constants";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const LEGACY_ACCEPT_TERMS_KEY = "ACCEPT_TERMS_KEY";
const REOPEN_DELAY_MS = 1200;

export function AcceptTermsModal() {
  const { t } = useLocales();
  const smDown = useResponsive("down", "sm");

  const [open, setOpen] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const acceptedTermsValue = localStorage.getItem(ACCEPT_TERMS_KEY);

    if (acceptedTermsValue === "true") {
      setIsAccepted(true);
      setIsInitialized(true);
      return;
    }

    const acceptedLegacyTermsValue = localStorage.getItem(
      LEGACY_ACCEPT_TERMS_KEY
    );

    if (acceptedLegacyTermsValue === "true") {
      localStorage.setItem(ACCEPT_TERMS_KEY, "true");
      setIsAccepted(true);
      setIsInitialized(true);
      return;
    }

    setOpen(true);
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

  const onAccept = () => {
    localStorage.setItem(ACCEPT_TERMS_KEY, "true");
    setIsAccepted(true);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={smDown}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          maxHeight: { xs: "100%", sm: "calc(100% - 64px)" },
          minWidth: 0,
        },
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {t("TERMS_AND_CONDITION")}
        <IconButton
          size="small"
          aria-label={t("CLOSE")}
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 10 }}
        >
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          overflowY: "auto",
          pb: 2,
        }}
      >
        <Typography fontSize={14} sx={{ textAlign: "justify", whiteSpace: "pre-line" }}>
          {t("TERMS_MODAL")}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
          px: 2,
          py: 1.5,
          pb: "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        <Button fullWidth variant="contained" onClick={onAccept}>
          {t("ACCEPT")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
