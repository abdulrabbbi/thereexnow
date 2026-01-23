import { GLOBAL_CONFIG } from "@/global-config";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";
import { getCookie, saveCookie } from "@/utils/storage/cookieStorage";
import { getAuth } from "firebase/auth";
import { GraphQLClient, Variables } from "graphql-request";

export const graphQLClient = new GraphQLClient(
  GLOBAL_CONFIG.graphqlUrl as string
);

export function fetcher<TData, TVariables extends Variables | undefined>(
  query: string,
  variables?: TVariables
) {
  return async (): Promise<TData> => {
    const token = await getCookie(ACCESS_TOKEN_KEY);

    if (token && isTokenExpired(token)) {
      const idToken = await getAuth().currentUser?.getIdToken(
        /* forceRefresh */ true
      );
      saveCookie("token", idToken);
      setHeader(idToken as string);
    }

    return await graphQLClient.request(query, variables);
  };
}

function jwtDecode(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const isTokenExpired = (token: string): boolean => {
  const decoded = jwtDecode(token);
  const isExpired = decoded.exp < Date.now() / 1000;

  return isExpired as boolean;
};

export const setHeader = (token: string) => {
  graphQLClient.setHeader("Authorization", "Bearer " + token);
};

export const clearHeader = () => {
  graphQLClient.setHeader("Authorization", "");
};
