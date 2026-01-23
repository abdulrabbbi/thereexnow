import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import useLocales from "@/hooks/use-locales";
import type { ConfirmDialogProps } from "./types";

export function ConfirmDialog({
  open,
  title,
  action,
  content,
  onClose,
  cancelProps,
  ...other
}: ConfirmDialogProps) {
  const { t } = useLocales();

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      {title ? <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle> : null}

      {content && (
        <DialogContent sx={{ typography: "body2" }}> {content} </DialogContent>
      )}

      {action || cancelProps?.hideCancelButton !== true ? (
        <DialogActions>
          {action}

          {cancelProps?.hideCancelButton !== true ? (
            <Button variant="outlined" onClick={onClose} {...cancelProps}>
              {t("CANCEL")}
            </Button>
          ) : null}
        </DialogActions>
      ) : null}
    </Dialog>
  );
}
