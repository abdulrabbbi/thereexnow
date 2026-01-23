import { Iconify } from "@/components/iconify";
import { NavItemBaseProps } from "@/components/nav-section";
import { Categories } from "@/graphql/generated";
import { getCategoriesRoute } from "@/routes/paths";
import { getParams } from "@/routes/utils";
import {
  ButtonBase,
  Collapse,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type UrlQueryParams = {
  categoryId: string;
  subCategoryId: string;
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
  const NAV_ITEMS = useMemo(() => {
    const items: Array<NavItemBaseProps> = data?.map((cat) => ({
      title: cat.name ?? "-",
      path: getCategoriesRoute({ source, categoryId: cat.id }),
      children: cat.subCategories?.map((sub) => ({
        title: sub?.name ?? "-",
        path: getCategoriesRoute({
          source,
          categoryId: cat.id,
          subCategoryId: sub?.id,
        }),
      })),
    }));

    return items;
  }, [data, source]);

  return (
    <Stack
      sx={[
        { py: 2, borderRadius: 1, bgcolor: "secondary.light" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {NAV_ITEMS.map((list) => (
        <CategoryNavList key={list.title} data={list} onItemClick={onItemClick} />
      ))}
    </Stack>
  );
}

type CategoryNavListProps = {
  data: NavItemBaseProps;
  onItemClick?: () => void;
};

function CategoryNavList({ data, onItemClick }: CategoryNavListProps) {
  const itemParams = getParams(data.path) as UrlQueryParams;

  const searchParams = useSearchParams();

  const activeParent =
    searchParams?.get("categoryId") === itemParams.categoryId;

  return (
    <>
      <ButtonBase
        color="white"
        component={Link}
        href={data.path}
        onClick={onItemClick}
        sx={{ pl: 3, pr: 2, mb: 0.5, height: 44, width: 1, color: "white" }}
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

        <Iconify
          width={16}
          icon={
            activeParent
              ? "eva:arrow-ios-downward-fill"
              : "eva:arrow-ios-forward-fill"
          }
        />
      </ButtonBase>

      {!!data.children && (
        <Collapse in={activeParent} unmountOnExit sx={{ px: 2 }}>
          {data.children.map((list: { title: string; path: string }) => (
            <NavSubList key={list.title} data={list} onItemClick={onItemClick} />
          ))}
        </Collapse>
      )}
    </>
  );
}

function NavSubList({
  data,
  onItemClick,
}: {
  data: { title: string; path: string };
  onItemClick?: () => void;
}) {
  const itemParams = getParams(data.path) as UrlQueryParams;

  const searchParams = useSearchParams();

  const activeChild =
    searchParams?.get("subCategoryId") === itemParams.subCategoryId;

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
