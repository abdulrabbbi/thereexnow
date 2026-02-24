import { CustomPopover } from "@/components/custom-popover";
import { Iconify } from "@/components/iconify";
import { Categories } from "@/graphql/generated";
import { useRouter } from "@/routes/hooks";
import { getCategoriesRoute } from "@/routes/paths";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
} from "@mui/material";
import { memo, useCallback, useRef, useState } from "react";

type Props = {
  category: Categories;
};

export function CategoryButton({ category }: Props) {
  const router = useRouter();
  const hoverPopoverRef = useRef<HTMLButtonElement | null>(null);
  const [hoverPopoverOpen, setHoverPopoverOpen] = useState<boolean>(false);
  const hasSubCategories = Boolean(category.subCategories?.length);
  const popoverId = `category-sub-menu-${category.id}`;

  const onClickCategory = useCallback(
    (categoryId: number, subCategoryId?: number) => {
      router.push(
        getCategoriesRoute({ categoryId, subCategoryId })
      );
    },
    [router]
  );

  const handleHoverPopoverOpen = useCallback(() => {
    if (!hasSubCategories) return;
    setHoverPopoverOpen(true);
  }, [hasSubCategories]);

  const handleHoverPopoverClose = useCallback(() => {
    setHoverPopoverOpen(false);
  }, []);

  return (
    <>
      <Button
        color="secondary"
        ref={hoverPopoverRef}
        onMouseEnter={handleHoverPopoverOpen}
        onMouseLeave={handleHoverPopoverClose}
        onFocus={handleHoverPopoverOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            handleHoverPopoverClose();
          }
        }}
        aria-haspopup={hasSubCategories ? "menu" : undefined}
        aria-expanded={hasSubCategories ? hoverPopoverOpen : undefined}
        aria-controls={hasSubCategories ? popoverId : undefined}
        onClick={() => onClickCategory(category.id)}
        sx={{
          fontSize: 18,
          borderRadius: 2,
          height: { xs: 48, md: 56 },
          bgcolor: "secondary.light",
          minWidth: { xs: "100%", md: "200px" },
          "&:hover": {
            boxShadow: "none",
          },

          "@media screen and (max-height:700px)": {
            fontSize: 16,
            height: { xs: 48, md: 40 },
          },
        }}
      >
        {category?.name}
      </Button>

      <CustomPopover
        id={popoverId}
        open={hoverPopoverOpen}
        sx={{ pointerEvents: "none" }}
        anchorEl={hoverPopoverRef.current}
        slotProps={{
          arrow: { offset: 17 },
          paper: {
            onMouseEnter: handleHoverPopoverOpen,
            onMouseLeave: handleHoverPopoverClose,
            sx: {
              p: 1,
              width: 240,
              ...(hoverPopoverOpen && { pointerEvents: "auto" }),
            },
          },
        }}
      >
        <MenuList>
          {category.subCategories?.map((subCategory, index) => (
            <MenuItem
              onClick={() => onClickCategory(category.id, subCategory?.id)}
              key={`${subCategory?.id} ${index}`}
              sx={{
                py: 1,
                pointerEvents: "inherit",
              }}
            >
              {subCategory?.name}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}

type MobileCategoryButtonProps = {
  category: Categories;
  isExpanded: boolean;
  onToggleExpand: (categoryId: number) => void;
  onClickCategory: (categoryId: number) => void;
  onClickSubCategory: (categoryId: number, subCategoryId: number) => void;
};

export const MobileCategoryButton = memo(function MobileCategoryButton({
  category,
  isExpanded,
  onToggleExpand,
  onClickCategory,
  onClickSubCategory,
}: MobileCategoryButtonProps) {
  const panelId = `mobile-category-sub-categories-${category.id}`;
  const hasSubCategories = Boolean(category.subCategories?.length);

  return (
    <Box
      sx={{
        borderRadius: 1.75,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        sx={{ px: 0.75, py: 0.65 }}
      >
        <Button
          fullWidth
          color="secondary"
          onClick={() => onClickCategory(category.id)}
          sx={{
            justifyContent: "flex-start",
            borderRadius: 1.25,
            minHeight: 40,
            px: 1.2,
            py: 0.65,
            fontSize: 14,
            bgcolor: "secondary.light",
          }}
        >
          {category.name}
        </Button>

        <IconButton
          aria-label={`Toggle ${category.name} subcategories`}
          aria-expanded={hasSubCategories ? isExpanded : false}
          aria-controls={hasSubCategories ? panelId : undefined}
          disabled={!hasSubCategories}
          onClick={() => {
            if (hasSubCategories) {
              onToggleExpand(category.id);
            }
          }}
          sx={{
            borderRadius: 1.25,
            border: 1,
            borderColor: "divider",
            p: 0.7,
            transition: (theme) =>
              theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
              }),
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <Iconify icon="eva:chevron-down-fill" />
        </IconButton>
      </Stack>

      <Collapse in={isExpanded && hasSubCategories} unmountOnExit>
        <Stack
          id={panelId}
          direction="row"
          spacing={0.75}
          useFlexGap
          flexWrap="wrap"
          sx={{ px: 0.75, pb: 0.95 }}
        >
          {category.subCategories?.map((subCategory) => {
            if (!subCategory?.id) return null;

            return (
              <Button
                key={subCategory.id}
                size="small"
                color="inherit"
                variant="outlined"
                onClick={() => onClickSubCategory(category.id, subCategory.id)}
                sx={{
                  borderRadius: 6,
                  textTransform: "none",
                  minHeight: 28,
                  px: 1,
                  py: 0.2,
                  fontSize: 12,
                }}
              >
                {subCategory?.name}
              </Button>
            );
          })}
        </Stack>
      </Collapse>
    </Box>
  );
});
