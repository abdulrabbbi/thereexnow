import { forwardRef } from "react";
import Link from "@mui/material/Link";
import { Box } from "@mui/material";

import { RouterLink } from "@/routes/components";
import { StyledNavItem } from "./styles";
import { NavItemProps } from "./types";

export const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
  ({ title, path, active, externalLink, onItemClick, ...other }, ref) => {
    const renderContent = (
      <StyledNavItem
        ref={ref}
        disableRipple
        disableTouchRipple
        active={active}
        {...other}
      >
        {title}
      </StyledNavItem>
    );

    if (externalLink) {
      return (
        <Link
          href={path}
          target="_blank"
          rel="noopener"
          color="inherit"
          underline="none"
          onClick={onItemClick}
        >
          {renderContent}
        </Link>
      );
    }

    return (
      <Box position="relative">
        <Link
          component={RouterLink}
          href={path}
          color="inherit"
          underline="none"
          onClick={onItemClick}
        >
          {renderContent}
        </Link>

        {active ? (
          <Box
            component="span"
            sx={{
              left: 0,
              right: 0,
              bottom: 0,
              height: "4px",
              position: "absolute",
              bgcolor: "primary.main",
              borderRadius: "4px 4px 0 0",
            }}
          />
        ) : null}
      </Box>
    );
  }
);
