"use client";

import LanguageIcon from "@/assets/icons/language-icon";
import { varHover } from "@/components/animate";
import { CustomPopover, usePopover } from "@/components/custom-popover";
import { Iconify } from "@/components/iconify";
import useLocales from "@/hooks/use-locales";
import { scrollbarStyle } from "@/theme/styles";
import { I18_NEXT_LANG_KEY } from "@/utils/constants";
import { saveCookie } from "@/utils/storage/cookieStorage";
import {
  IconButton,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import { m } from "framer-motion";

export function LanguagePopover() {
  const popover = usePopover();
  const { allLang, currentLang, onChangeLang } = useLocales();

  const handleChangeLanguage = (language: string) => {
    saveCookie(I18_NEXT_LANG_KEY, language);
    onChangeLang(language);
    popover.onClose();
  };

  return (
    <>
      <IconButton
        component={m.button}
        onClick={popover.onOpen}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.09)}
      >
        <LanguageIcon />
      </IconButton>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          arrow: { offset: 17 },
          root: { sx: { mt: 1.5 } },
          paper: {
            sx: { p: 1, width: 240 },
          },
        }}
      >
        <MenuList
          sx={{
            pr: 1,
            maxHeight: 250,
            overflowY: "scroll",
            ...scrollbarStyle(),
          }}
        >
          {allLang.map((item) => (
            <MenuItem
              sx={{ py: 1 }}
              key={item.value}
              value={item.value}
              onClick={() => handleChangeLanguage(item.value)}
            >
              <Stack
                flexGrow={1}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontSize={14}>{item.label}</Typography>

                {currentLang.value === item.value ? (
                  <Iconify icon="mynaui:check-solid" />
                ) : null}
              </Stack>
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
