import type { ReactPlayerProps } from "react-player";

import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";

import { useBoolean } from "@/hooks/use-boolean";
import { alpha } from "@mui/material";
import { Iconify } from "../iconify";
import { ReactPlayerRoot } from "./styles";

interface Props extends ReactPlayerProps {
  open: boolean;
  videoPath: string;
  onClose: () => void;
}

export function PlayerDialog({ videoPath, open, onClose, ...other }: Props) {
  const loading = useBoolean(true);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { maxWidth: 600, maxHeight: 600 } } }}
    >
      <IconButton
        size="large"
        onClick={onClose}
        sx={(theme) => ({
          top: 24,
          right: 24,
          zIndex: 9,
          position: "fixed",
          color: alpha(theme.palette.common.white, 0.72),
          bgcolor: alpha(theme.palette.common.black, 0.7),
          "&:hover": {
            bgcolor: alpha(theme.palette.common.black, 0.9),
          },
        })}
      >
        <Iconify icon="eva:close-outline" />
      </IconButton>

      {loading.value && (
        <CircularProgress
          sx={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            m: "auto",
            position: "absolute",
          }}
        />
      )}

      <ReactPlayerRoot
        controls
        url={videoPath}
        playing={!loading.value}
        onReady={loading.onFalse}
        {...other}
      />
    </Dialog>
  );
}
