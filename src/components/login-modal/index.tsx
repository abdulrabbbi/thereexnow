import useLocales from "@/hooks/use-locales";
import { RouterLink } from "@/routes/components";
import { getSignInRoute } from "@/routes/paths";
import { Button, DialogActions, Typography } from "@mui/material";

type Props = {
  handleClose: VoidFunction;
};

export function LoginModal({ handleClose }: Props) {
  const { t } = useLocales();

  return (
    <>
      <Typography>{t("LOG_IN_TO_USE_FEATURES")}</Typography>
      <DialogActions sx={{ px: 0, gap: 2 }}>
        <Button
          fullWidth
          onClick={handleClose}
          href={getSignInRoute()}
          LinkComponent={RouterLink}
        >
          {t("SIGN_IN2")}
        </Button>

        <Button
          fullWidth
          color="inherit"
          variant="outlined"
          onClick={handleClose}
        >
          {t("CANCEL")}
        </Button>
      </DialogActions>
    </>
  );
}
