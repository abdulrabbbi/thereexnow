"use client";

import { Iconify } from "@/components/iconify";
import { useAppSettings } from "@/hooks/helpers/app-settings";
import useLocales from "@/hooks/use-locales";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

type TermsDialogProps = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  accepted?: boolean;
  variant?: "full" | "intro";
};

export default function TermsDialog({
  open,
  onClose,
  onAccept,
  accepted = false,
  variant = "full",
}: TermsDialogProps) {
  const { t } = useLocales();
  const { appSettingsData, appSettingsLoading } = useAppSettings();

  const termsHtml = appSettingsData?.termsAndConditions?.trim();

  const fallbackParagraphs = useMemo(
    () =>
      t("TERMS_MODAL")
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    [t]
  );

  const introParagraphHtml = useMemo(() => {
    if (variant !== "intro" || !termsHtml) {
      return null;
    }

    const parsed = new DOMParser().parseFromString(termsHtml, "text/html");
    const firstParagraph = Array.from(parsed.querySelectorAll("p")).find(
      (paragraph) => paragraph.textContent?.trim()
    );

    return firstParagraph?.outerHTML ?? null;
  }, [termsHtml, variant]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          width: { xs: "calc(100% - 24px)", sm: 560 },
          maxWidth: "calc(100% - 24px)",
          maxHeight: "80vh",
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 2,
          py: 1.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography variant="h6">{t("TERMS_AND_CONDITION")}</Typography>
        <IconButton size="small" aria-label={t("CLOSE")} onClick={onClose}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          py: 2.25,
          px: { xs: 2, sm: 2.5 },
          "& p, & li": {
            fontSize: 14,
            lineHeight: 1.7,
          },
          "& p, & ul, & ol, & h1, & h2, & h3, & h4": {
            mt: 0,
            mb: 1.5,
          },
          "& ul, & ol": {
            pl: 2.5,
          },
        }}
      >
        {appSettingsLoading ? (
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        ) : variant === "intro" ? (
          introParagraphHtml ? (
            <Box
              component="div"
              dangerouslySetInnerHTML={{ __html: introParagraphHtml }}
            />
          ) : (
            <Typography fontSize={14}>{fallbackParagraphs[0]}</Typography>
          )
        ) : termsHtml ? (
          <Box
            component="div"
            dangerouslySetInnerHTML={{ __html: termsHtml }}
          />
        ) : (
          <Stack spacing={1.5}>
            {fallbackParagraphs.map((paragraph, index) => (
              <Typography key={`${paragraph.slice(0, 16)}-${index}`} fontSize={14}>
                {paragraph}
              </Typography>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          position: "sticky",
          bottom: 0,
          px: 2,
          py: 2,
          pb: "max(16px, env(safe-area-inset-bottom))",
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Button
          fullWidth
          size="large"
          variant="contained"
          disabled={accepted}
          onClick={onAccept}
          sx={{ minHeight: 46 }}
        >
          {accepted ? t("ACCEPTED") : t("ACCEPT")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
