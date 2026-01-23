import { Iconify } from "@/components/iconify";
import { useCheckout } from "@/hooks/use-checkout";
import useLocales from "@/hooks/use-locales";
import { Box, Button, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

export function CheckoutAddress() {
  const { t } = useLocales();
  const checkout = useCheckout();

  const shippingAddress = [
    checkout.shipping?.country,
    checkout.shipping?.state,
    checkout.shipping?.city,
    checkout.shipping?.address,
  ].filter(Boolean);

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={<Typography variant="h6">{t("ADDRESS")}</Typography>}
        action={
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="solar:pen-bold" />}
          >
            Edit
          </Button>
        }
      />

      <Stack sx={{ p: 3 }}>
        <Box sx={{ color: "text.secondary", typography: "body2" }}>
          {shippingAddress.join(", ")}
        </Box>
      </Stack>
    </Card>
  );
}
