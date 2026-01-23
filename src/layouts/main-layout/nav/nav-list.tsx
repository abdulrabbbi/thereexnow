// "use client";

// import { useActiveLink } from "@/routes/hooks";
// import { NavItem } from "./nav-item";
// import { NavListProps } from "./types";

// export function NavList({ data }: NavListProps) {
//   const active = useActiveLink(data.path);

//   return <NavItem title={data.title} path={data.path} active={active} />;
// }



"use client";

import { useActiveLink } from "@/routes/hooks";
import { NavItem } from "./nav-item";
import { NavListProps } from "./types";

export function NavList({ data, onItemClick }: NavListProps) {
  const active = useActiveLink(data.path);

  return (
    <NavItem
      title={data.title}
      path={data.path}
      active={active}
      externalLink={data.externalLink}
      onItemClick={onItemClick}
    />
  );
}
