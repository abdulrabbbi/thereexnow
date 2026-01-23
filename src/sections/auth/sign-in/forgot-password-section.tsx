import { ConfirmDialog } from "@/components/custom-dialog";
import { Iconify } from "@/components/iconify";
import { useBoolean } from "@/hooks/use-boolean";
import useLocales from "@/hooks/use-locales";
import { Box, Button, InputAdornment, Stack, TextField } from "@mui/material";
import { useState } from "react";

export function ForgotPasswordSection() {
  const { t } = useLocales();
  const dialog = useBoolean();

  const [mail, setMail] = useState("");

  return (
    <Box sx={{ alignSelf: "flex-end" }}>
      <Button variant="text" size="small" color="info" onClick={dialog.onTrue}>
        {t("FORGOT_PASSWORD")}
      </Button>

      <ConfirmDialog
        open={dialog.value}
        title={t("FORGOT_PASSWORD")}
        onClose={dialog.onFalse}
        cancelProps={{ fullWidth: true }}
        content={
          <Stack spacing={3}>
            {t("PASSWORD_RECOVERY_TEXT")}
            <TextField
              value={mail}
              label={t("EMAIL_ADDRESS")}
              placeholder="example@gmail.com"
              onChange={(e) => setMail(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="solar:letter-bold-duotone"
                        color="info.main"
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        }
        action={
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              dialog.onFalse();
            }}
          >
            {t("SEND")}
          </Button>
        }
      />
    </Box>
  );
}
