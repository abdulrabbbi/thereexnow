"use client";

import { useUser } from "@/hooks/use-user";
import { Stack } from "@mui/material";
import { CartPopover } from "./cart-popover";
import { LanguagePopover } from "./language-popover";
import { NotificationPopover } from "./notification-popover";
import { ProfilePopover } from "./profile-popover";

export function UserNav() {
  const { userData } = useUser();

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <CartPopover />

      <NotificationPopover />

      <LanguagePopover />

      <ProfilePopover />
    </Stack>
  );
}
