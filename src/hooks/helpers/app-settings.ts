import { useAppSettings_GetAppSettingsQuery } from "@/graphql/generated";

export function useAppSettings() {
  const { data, isLoading } = useAppSettings_GetAppSettingsQuery(
    {},
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const appSettings = data?.appSettings_getAppSettings?.result?.items?.[0];

  return {
    appSettingsData: appSettings,
    appSettingsLoading: isLoading,
  };
}
