"use client";

import { Drawer } from "@mui/material";
import { SettingsNavContent } from "./SettingsNav";

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export default function SettingsNavDrawer({ open, onClose }: Props) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: "min(88vw, 340px)",
          borderTopRightRadius: 22,
          borderBottomRightRadius: 22,
          overflow: "hidden",
        },
      }}
    >
      <SettingsNavContent
        onNavigate={onClose}
        onClose={onClose}
      />
    </Drawer>
  );
}
