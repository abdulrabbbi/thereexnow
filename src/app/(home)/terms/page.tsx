"use client";

import { useAppSettings } from "@/hooks/helpers/app-settings";
import { Box, Container } from "@mui/material";

export default function Page() {
  const { appSettingsData } = useAppSettings();

  return (
    <Container maxWidth="md" sx={{ py: 15 }}>
      <Box
        component="div"
        dangerouslySetInnerHTML={{
          __html: appSettingsData?.termsAndConditions as string,
        }}
      />
    </Container>
  );
}
