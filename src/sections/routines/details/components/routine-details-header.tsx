import { Iconify } from "@/components/iconify";
import TranslateText from "@/components/translate-text";
import useLocales from "@/hooks/use-locales";
import { HEADER } from "@/layouts/config-layout";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

type Props = {
  title: string;
  exerciseCount: number;
  updatedAt?: string | null;
  isSaving?: boolean;
  onBack: VoidFunction;
  onShare: VoidFunction;
  onDelete: VoidFunction;
  onSave: VoidFunction;
};

export function RoutineDetailsHeader({
  title,
  exerciseCount,
  updatedAt,
  isSaving,
  onBack,
  onShare,
  onDelete,
  onSave,
}: Props) {
  const { t } = useLocales();

  const formattedUpdatedAt = useMemo(() => {
    if (!updatedAt) return null;

    const date = new Date(updatedAt);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }, [updatedAt]);

  return (
    <Box
      sx={{
        py: 1.5,
        mb: 2,
        zIndex: 11,
        position: "sticky",
        top: { xs: `${HEADER.H_MOBILE}px`, md: `${HEADER.H_DESKTOP}px` },
        bgcolor: "background.default",
      }}
    >
      <Stack spacing={1.25} sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
          <IconButton
            color="inherit"
            aria-label={t("BACK")}
            onClick={onBack}
            sx={{ width: 44, height: 44, flexShrink: 0 }}
          >
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Typography
            variant="h5"
            sx={{
              minWidth: 0,
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <TranslateText>{title || "-"}</TranslateText>
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ minWidth: 0 }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ minWidth: 0, flex: 1, flexWrap: "wrap" }}
          >
            <Typography variant="body2" color="text.secondary">
              {exerciseCount} {t("EXERCISE")}
            </Typography>

            {formattedUpdatedAt ? (
              <Typography variant="body2" color="text.secondary">
                • {formattedUpdatedAt}
              </Typography>
            ) : null}
          </Stack>

          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
            <IconButton
              color="primary"
              aria-label={t("SHARE_WITH")}
              onClick={onShare}
              sx={{ width: 44, height: 44 }}
            >
              <Iconify icon="solar:share-line-duotone" />
            </IconButton>

            <IconButton
              color="error"
              aria-label={t("DELETE")}
              onClick={onDelete}
              sx={{ width: 44, height: 44 }}
            >
              <Iconify icon="ic:round-close" />
            </IconButton>

            <Button
              variant="contained"
              loading={isSaving}
              onClick={onSave}
              sx={{ minWidth: 104 }}
            >
              {t("SAVE")}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
