"use client";

import { Iconify } from "@/components/iconify";
import { useResponsive } from "@/hooks/use-responsive";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

type Props = {
  show: boolean;
  onScrollToHep: () => void;
  text?: string;
  mobileOnly?: boolean;
};

export function HepHintBanner({
  show,
  onScrollToHep,
  text = "See below for home exercise program",
  mobileOnly = true,
}: Props) {
  const mdUp = useResponsive("up", "md");

  if (!show || (mobileOnly && mdUp)) {
    return null;
  }

  return (
    <Alert
      severity="info"
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 2,
        alignItems: "center",
        bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
        borderColor: (theme) => alpha(theme.palette.info.main, 0.22),
        "& .MuiAlert-message": { width: 1, py: 0 },
      }}
    >
      <Stack
        direction="row"
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        flexWrap="wrap"
        columnGap={1}
        rowGap={1}
        sx={{ width: 1 }}
      >
        <Typography variant="body2">{text}</Typography>
        <Button
          size="small"
          color="info"
          variant="text"
          endIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" />}
          onClick={onScrollToHep}
          sx={{ flexShrink: 0 }}
        >
          Scroll to HEP
        </Button>
      </Stack>
    </Alert>
  );
}
