import { Iconify } from "@/components/iconify";
import { Categories } from "@/graphql/generated";
import { getCategoriesRoute } from "@/routes/paths";
import { getParams } from "@/routes/utils";
import {
  ButtonBase,
  Collapse,
  IconButton,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UrlQueryParams = {
  categoryId?: string;
  subCategoryId?: string;
};

type CategoryNavItem = {
  id: string;
  title: string;
  path: string;
  children: Array<{
    id: string;
    title: string;
    path: string;
  }>;
};

type Props = {
  sx?: SxProps<Theme>;
  data: Array<Categories>;
  source?: "exercises" | "favorites" | "shop";
  onItemClick?: () => void;
};

export function ExercisesNav({
  data,
  source = "exercises",
  sx,
  onItemClick,
}: Props) {
  const searchParams = useSearchParams();
  const activeCategoryId = searchParams?.get("categoryId") ?? null;
  const activeSubCategoryId = searchParams?.get("subCategoryId") ?? null;

  const NAV_ITEMS = useMemo(() => {
    const items: Array<CategoryNavItem> = data.map((cat) => {
      const children: CategoryNavItem["children"] = [];

      cat.subCategories?.forEach((sub) => {
        if (!sub?.id) return;

        children.push({
          id: String(sub.id),
          title: sub.name ?? "-",
          path: getCategoriesRoute({
            source,
            categoryId: cat.id,
            subCategoryId: sub.id,
          }),
        });
      });

      return {
        id: String(cat.id),
        title: cat.name ?? "-",
        path: getCategoriesRoute({ source, categoryId: cat.id }),
        children,
      };
    });

    return items;
  }, [data, source]);

  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    activeCategoryId,
  );
  const categoryButtonRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!activeCategoryId) return;

    setExpandedCategoryId(activeCategoryId);
  }, [activeCategoryId]);

  const onToggleExpand = useCallback((categoryId: string) => {
    setExpandedCategoryId((currentExpanded) =>
      currentExpanded === categoryId ? null : categoryId,
    );
  }, []);

  const setCategoryButtonRef = useCallback(
    (categoryId: string, node: HTMLElement | null) => {
      if (node) {
        categoryButtonRefs.current[categoryId] = node;
        return;
      }

      delete categoryButtonRefs.current[categoryId];
    },
    [],
  );

  useEffect(() => {
    if (!expandedCategoryId) return;

    categoryButtonRefs.current[expandedCategoryId]?.scrollIntoView({
      block: "nearest",
    });
  }, [expandedCategoryId]);

  return (
    <Stack
      sx={[
        { pt: 2, pb: 1, borderRadius: 1, bgcolor: "secondary.light" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {NAV_ITEMS.map((list) => (
        <CategoryNavList
          key={list.id}
          data={list}
          activeCategoryId={activeCategoryId}
          activeSubCategoryId={activeSubCategoryId}
          isExpanded={expandedCategoryId === list.id}
          onToggleExpand={onToggleExpand}
          onItemClick={onItemClick}
          setCategoryButtonRef={setCategoryButtonRef}
        />
      ))}
    </Stack>
  );
}

type CategoryNavListProps = {
  data: CategoryNavItem;
  activeCategoryId: string | null;
  activeSubCategoryId: string | null;
  isExpanded: boolean;
  onToggleExpand: (categoryId: string) => void;
  onItemClick?: () => void;
  setCategoryButtonRef: (categoryId: string, node: HTMLElement | null) => void;
};

function CategoryNavList({
  data,
  activeCategoryId,
  activeSubCategoryId,
  isExpanded,
  onToggleExpand,
  onItemClick,
  setCategoryButtonRef,
}: CategoryNavListProps) {
  const hasSubCategories = data.children.length > 0;
  const isActive = activeCategoryId === data.id;
  const panelId = `exercise-sub-categories-${data.id}`;

  return (
    <>
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ px: 1, mb: 0.5 }}>
        <ButtonBase
          ref={(node) => setCategoryButtonRef(data.id, node as HTMLElement | null)}
          color="white"
          component={Link}
          href={data.path}
          onClick={onItemClick}
          sx={{
            pl: 2,
            pr: 2,
            height: 44,
            width: 1,
            color: "white",
            borderRadius: 1,
            justifyContent: "flex-start",
            bgcolor: isActive ? "rgba(255, 255, 255, 0.14)" : "transparent",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Typography
            textAlign="left"
            sx={{
              width: 1,
              fontWeight: 700,
              fontSize: "22px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {data.title}
          </Typography>
        </ButtonBase>

        <IconButton
          aria-label={`Toggle ${data.title} subcategories`}
          aria-expanded={hasSubCategories ? isExpanded : false}
          aria-controls={hasSubCategories ? panelId : undefined}
          disabled={!hasSubCategories}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!hasSubCategories) return;
            onToggleExpand(data.id);
          }}
          sx={{
            borderRadius: 1,
            border: 1,
            borderColor: "rgba(255,255,255,0.24)",
            p: 0.6,
            color: "common.white",
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

      {hasSubCategories && (
        <Collapse in={isExpanded} unmountOnExit sx={{ px: 2 }}>
          <Stack id={panelId} spacing={0.5}>
            {data.children.map((list) => (
              <NavSubList
                key={list.id}
                data={list}
                activeSubCategoryId={activeSubCategoryId}
                onItemClick={onItemClick}
              />
            ))}
          </Stack>
        </Collapse>
      )}
    </>
  );
}

function NavSubList({
  data,
  activeSubCategoryId,
  onItemClick,
}: {
  data: { id: string; title: string; path: string };
  activeSubCategoryId: string | null;
  onItemClick?: () => void;
}) {
  const itemParams = getParams(data.path) as UrlQueryParams;
  const activeChild = activeSubCategoryId === itemParams.subCategoryId;

  return (
    <ButtonBase
      color="white"
      component={Link}
      href={data.path}
      onClick={onItemClick}
      sx={{
        pl: 3,
        pr: 2,
        mb: 0.5,
        width: 1,
        height: 32,
        color: "white",
        borderRadius: 0.5,
        justifyContent: "flex-start",
        bgcolor: activeChild ? "rgba(255, 255, 255, 0.16)" : "transparent",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <Typography
        textAlign="left"
        variant="body2"
        sx={{
          width: 1,
          fontWeight: 400,
          fontSize: "16px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {data.title}
      </Typography>
    </ButtonBase>
  );
}
