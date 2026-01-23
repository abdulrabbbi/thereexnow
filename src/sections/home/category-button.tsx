import { CustomPopover } from "@/components/custom-popover";
import { Categories } from "@/graphql/generated";
import { useRouter } from "@/routes/hooks";
import { getCategoriesRoute } from "@/routes/paths";
import { Button, MenuItem, MenuList } from "@mui/material";
import { useCallback, useRef, useState } from "react";

type Props = {
  category: Categories;
};

export function CategoryButton({ category }: Props) {
  const router = useRouter();
  const hoverPopoverRef = useRef<HTMLButtonElement | null>(null);
  const [hoverPopoverOpen, setHoverPopoverOpen] = useState<boolean>(false);

  const onClickCategory = (category: number, subCategory?: number) => {
    router.push(
      getCategoriesRoute({ categoryId: category, subCategoryId: subCategory })
    );
  };

  const handleHoverPopoverOpen = useCallback(() => {
    setHoverPopoverOpen(true);
  }, []);

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
