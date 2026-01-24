import {
  useMembership_GetCurrentMembershipQuery,
  Users,
  useUser_GetCurrentUserQuery,
} from "@/graphql/generated";
import { useMemo } from "react";
import { useAuth } from "./use-auth";

type UseUserReturn = {
  isPro: boolean;
  userData: Users;
  userLoading: boolean;
};
export function useUser(): UseUserReturn {
  const { authenticated } = useAuth();

  const { data, isLoading } = useUser_GetCurrentUserQuery(
    undefined,
    {
      staleTime: Infinity,
      refetchOnMount: false,
      enabled: !!authenticated,
      refetchOnWindowFocus: false,
    }
  );

  const { data: membershipData, isLoading: membershipLoading } =
    useMembership_GetCurrentMembershipQuery(undefined, {
      enabled: !!authenticated,
      staleTime: 60 * 1000,
    });

  const isPro: boolean = useMemo(
    () =>
      membershipData?.membership_getCurrentMembership?.result !== null &&
      membershipData?.membership_getCurrentMembership?.result?.paymentAmount !==
        0,
    [membershipData]
  );

  return {
    isPro,
    userLoading: isLoading || membershipLoading,
    userData: data?.user_getCurrentUser?.result as Users,
  };
}
