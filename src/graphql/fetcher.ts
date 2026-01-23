import { GLOBAL_CONFIG } from "@/global-config";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";
import { getCookie, saveCookie } from "@/utils/storage/cookieStorage";
import { getAuth } from "firebase/auth";
import { GraphQLClient, Variables } from "graphql-request";

export const graphQLClient = new GraphQLClient(
  GLOBAL_CONFIG.graphqlUrl as string
);

// Prevent "refresh storms" when multiple queries fire at once.
let inMemoryToken: string | undefined;
let inMemoryTokenExp: number | undefined;
let tokenRefreshPromise: Promise<string | undefined> | null = null;

const TOKEN_EXPIRY_SKEW_SECONDS = 30;

export function fetcher<TData, TVariables extends Variables | undefined>(
  query: string,
  variables?: TVariables
) {
  return async (): Promise<TData> => {
    const token = await getValidToken();

    // Override any previously set auth header to avoid stale tokens.
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : { Authorization: "" };

    return graphQLClient.request(query, variables, headers);
  };
}

async function getValidToken(): Promise<string | undefined> {
  const cookieToken = (await getCookie(ACCESS_TOKEN_KEY)) as
    | string
    | undefined;

  const token = cookieToken || inMemoryToken;
  const exp = cookieToken
    ? getTokenExp(cookieToken)
    : inMemoryTokenExp ??
      (inMemoryToken ? getTokenExp(inMemoryToken) : undefined);

  if (token && !isTokenExpired(exp)) {
    inMemoryToken = token;
    inMemoryTokenExp = exp;
    return token;
  }

  const user = getAuth().currentUser;
  if (!user) {
    inMemoryToken = cookieToken;
    inMemoryTokenExp = cookieToken ? getTokenExp(cookieToken) : undefined;
    return cookieToken;
  }

  if (!tokenRefreshPromise) {
    tokenRefreshPromise = user
      .getIdToken(/* forceRefresh */ false)
      .then((idToken) => {
        if (idToken) {
          inMemoryToken = idToken;
          inMemoryTokenExp = getTokenExp(idToken);
          // Keep cookie key consistent with the rest of the app.
          saveCookie(ACCESS_TOKEN_KEY, idToken);
        }
        return idToken as string | undefined;
      })
      .catch(() => undefined)
      .finally(() => {
        tokenRefreshPromise = null;
      });
  }

  return tokenRefreshPromise;
}

function getTokenExp(token: string): number | undefined {
  try {
    const decoded = jwtDecode(token);
    return typeof decoded?.exp === "number" ? decoded.exp : undefined;
  } catch {
    return undefined;
  }
}

function base64UrlToUtf8(base64Url: string) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  if (typeof window !== "undefined" && typeof window.atob === "function") {
    const binary = window.atob(padded);
    const jsonPayload = decodeURIComponent(
      binary
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return jsonPayload;
  }

  return Buffer.from(padded, "base64").toString("utf8");
}

function jwtDecode(token: string) {
  const base64Url = token.split(".")[1];
  if (!base64Url) {
    throw new Error("Invalid JWT");
  }

  return JSON.parse(base64UrlToUtf8(base64Url));
}

export const isTokenExpired = (exp?: number): boolean => {
  if (!exp) return true;
  return exp < Date.now() / 1000 + TOKEN_EXPIRY_SKEW_SECONDS;
};

export const setHeader = (token: string) => {
  graphQLClient.setHeader("Authorization", "Bearer " + token);
};

export const clearHeader = () => {
  graphQLClient.setHeader("Authorization", "");
};
