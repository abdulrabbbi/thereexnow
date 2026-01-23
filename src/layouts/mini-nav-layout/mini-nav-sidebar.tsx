"use client";

import { Iconify } from "@/components/iconify";
import { RouterLink } from "@/routes/components";
import { useActiveLink } from "@/routes/hooks";
import {
  alpha,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import { MiniNavItemsType, MiniNavSidebarProps } from "./types";

const SIDEBAR_WIDTH = 250;

export function MiniNavSidebar({
  navItems,
  children,
  ...other
}: MiniNavSidebarProps) {
  return (
    <Wrapper {...other}>
      <HoverBox>
        {navItems.map((item, index) => (
          <NavItem item={item} key={index} />
        ))}
      </HoverBox>
    </Wrapper>
  );
}

const Wrapper = styled(Box)({
  width: 80,
  zIndex: 99,
  maxWidth: 80,
  padding: "32px 0",
  overflow: "visible",
});

const HoverBox = styled(Box)<{
  maxWidth?: number;
}>(({ theme }) => ({
  width: 80,
  padding: "8px 0",
  borderRadius: 20,
  overflow: "hidden",
  transition: "width 0.3s ease",
  backgroundColor: theme.palette.secondary.light,

  "& > :not(:first-of-type)": {
    marginTop: theme.spacing(2),
  },

  "&:hover": {
    width: SIDEBAR_WIDTH,
  },
}));

const CustomIcon = styled(ListItemIcon)(({ theme }) => ({
  width: 48,
  height: 48,
  display: "flex",
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.secondary.lighter,
}));

function NavItem({ item }: { item: MiniNavItemsType }) {
  const theme = useTheme();

  const active = useActiveLink(item.link ?? "");

  return (
    <ListItemButton
      disabled={item.isLoading}
      sx={{
        width: SIDEBAR_WIDTH,
        ...(item.link &&
          active && {
            // color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.common.black, 0.08),

            "&:hover": {
              backgroundColor: alpha(theme.palette.common.black, 0.16),
            },
          }),
      }}
      {...(item.link
        ? { LinkComponent: RouterLink, href: item.link }
        : { onClick: item.onClick })}
    >
      <CustomIcon>
        {item.isLoading ? (
          <Iconify icon="svg-spinners:90-ring-with-bg" width={32} />
        ) : (
          item.icon
        )}
      </CustomIcon>

      <ListItemText primary={item.title} sx={{ color: "white" }} />
    </ListItemButton>
  );
}
