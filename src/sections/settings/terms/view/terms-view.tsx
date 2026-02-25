"use client";

import useLocales from "@/hooks/use-locales";
import { getTermsAccepted, setTermsAccepted } from "@/utils/terms-acceptance";
import { Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import TermsDialog from "../TermsDialog";

export default function TermsView() {
  const { t } = useLocales();
  const [accepted, setAccepted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const acceptedValue = getTermsAccepted();

    setAccepted(acceptedValue);
    setDialogOpen(!acceptedValue);
    setInitialized(true);
  }, []);

  const handleOpen = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleAccept = useCallback(() => {
    setTermsAccepted();
    setAccepted(true);
    setDialogOpen(false);
  }, []);

  return (
    <Container maxWidth="md" sx={{ px: { xs: 0, md: 2 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              {t("TERMS_AND_CONDITION")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review the latest terms and keep your account acceptance up to date.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {initialized && (
              <Chip
                size="small"
                color={accepted ? "success" : "warning"}
                label={accepted ? t("ACCEPTED") : "Pending"}
              />
            )}

            <Button variant="contained" onClick={handleOpen}>
              View terms
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {initialized && dialogOpen && (
        <TermsDialog
          open={dialogOpen}
          accepted={accepted}
          onClose={handleClose}
          onAccept={handleAccept}
        />
      )}
    </Container>
  );
}
