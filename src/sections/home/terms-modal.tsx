"use client";

import { ConfirmDialog } from "@/components/custom-dialog";
import { useBoolean } from "@/hooks/use-boolean";
import useLocales from "@/hooks/use-locales";
import { ACCEPT_TERMS_KEY } from "@/utils/constants";
import { Button, Typography } from "@mui/material";
import { useEffect } from "react";

export function AcceptTermsModal() {
  const { t } = useLocales();
  const dialog = useBoolean(false);

  useEffect(() => {
    const isTermsAccepted = localStorage.getItem(ACCEPT_TERMS_KEY);

    if (!isTermsAccepted && !dialog.value) {
      dialog.onTrue();
    }
  }, []);

  return (
    <ConfirmDialog
      open={dialog.value}
      onClose={() => {}}
      cancelProps={{ hideCancelButton: true }}
      content={
        <Typography pt={4} fontSize={14} sx={{ textAlign: "justify" }}>
          {t("TERMS_MODAL")}
        </Typography>
      }
      action={
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            localStorage.setItem(ACCEPT_TERMS_KEY, "true");

            dialog.onFalse();
          }}
        >
          Accept terms
        </Button>
      }
    />
  );
}
