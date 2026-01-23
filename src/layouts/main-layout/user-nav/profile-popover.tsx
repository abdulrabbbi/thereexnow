"use client";

import { varHover } from "@/components/animate";
import { CustomPopover, usePopover } from "@/components/custom-popover";
import { Iconify } from "@/components/iconify";
import { clearHeader } from "@/graphql/fetcher";
import { useAuth } from "@/hooks/use-auth";
import { useBoard } from "@/hooks/use-board";
import useLocales from "@/hooks/use-locales";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "@/routes/hooks";
import {
  getProfileRoute,
  getPublicPrivacyRoute,
  getPublicTermsRoute,
} from "@/routes/paths";
import { getAssetsUrl } from "@/utils";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";
import { clearCookie } from "@/utils/storage/cookieStorage";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { m } from "framer-motion";

export function ProfilePopover() {
  const board = useBoard();
  const { t } = useLocales();
  const router = useRouter();
  const popover = usePopover();
  const { signOut } = useAuth();
  const { userData } = useUser();
  const queryClient = useQueryClient();

  const onOpenProfile = () => {
    popover.onClose();

    router.push(getProfileRoute());
  };

  const onOpenTerms = () => {
    popover.onClose();

    router.push(getPublicTermsRoute());
  };

  const onOpenPrivacy = () => {
    popover.onClose();

    router.push(getPublicPrivacyRoute());
  };

  const onLogout = async () => {
    popover.onClose();

    await signOut();

    clearHeader();
    board.onReset();
    queryClient.clear();
    clearCookie(ACCESS_TOKEN_KEY);
  };

  const OPTIONS = [
    {
      label: "PROFILE",
      onClick: onOpenProfile,
      icon: "solar:user-bold-duotone",
    },
    {
      onClick: onOpenTerms,
      label: "TERMS_AND_CONDITION",
      icon: "solar:text-field-focus-bold-duotone",
    },
    {
      onClick: onOpenPrivacy,
      label: "PRIVACY_POLICY",
      icon: "solar:file-text-bold-duotone",
    },
  ];

  return (
    <>
      <IconButton
        component={m.button}
        onClick={popover.onOpen}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.09)}
        sx={{ p: 0 }}
      >
        <Avatar src={getAssetsUrl(userData?.photoUrl)}>
          {userData?.fullName?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          arrow: { offset: 17 },
          root: { sx: { mt: 1.5 } },
          paper: { sx: { p: 1, width: 240 } },
        }}
      >
        <Box sx={{ pt: 2, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {userData?.fullName}
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {userData?.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5, borderStyle: "dashed" }} />

        <MenuList>
          {OPTIONS.map((item, index) => (
            <MenuItem
              key={index}
              onClick={item.onClick}
              sx={{
                py: 1,
                "& svg": { width: 24, height: 24 },
              }}
            >
              <Iconify icon={item.icon} />
              {t(item.label)}
            </MenuItem>
          ))}

          <Divider sx={{ my: 2, borderStyle: "dashed" }} />

          <MenuItem
            onClick={onLogout}
            sx={{
              py: 1,
              color: "error.main",
              "& svg": { width: 24, height: 24 },
              "&:hover": { color: "error.dark" },
            }}
          >
            <Iconify icon="solar:logout-2-bold-duotone" />
            {t("LOG_OUT1")}
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
