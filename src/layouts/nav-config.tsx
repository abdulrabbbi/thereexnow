import useLocales from "@/hooks/use-locales";
import { useMemo } from "react";

export function useNavConfig() {
  const { t } = useLocales();

  const nav = useMemo(() => {
    return [
      {
        title: t("HOME"),
        path: "/exercises",
      },
      {
        title: t("YOUR_ROUTINE"),
        path: "/routines",
      },
      {
        title: t("FAVORITE"),
        path: "/favorites",
      },
      {
        title: t("SHOP"),
        path: "/shop",
      },
      {
        title: t("SETTING"),
        path: "/settings/profile",
      },
    ];
  }, [t]);

  return nav;
}
