"use client";

import { GLOBAL_CONFIG } from "@/global-config";
import { setHeader } from "@/graphql/fetcher";
import { useSetState } from "@/hooks/use-set-state";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";
import { saveCookie } from "@/utils/storage/cookieStorage";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { PropsWithChildren, useEffect, useMemo } from "react";

import { useUserSignInMutation } from "@/hooks/helpers/user";
import { useQueryClient } from "@tanstack/react-query";
import * as FirebaseActions from "./actions";
import { AuthContext } from "./context";
import { consumeSkipBackendSignInRequest } from "./skip-backend-signin";
import { AuthState } from "./types";

export const firebaseApp = initializeApp(GLOBAL_CONFIG.firebase);

export const AUTH = getAuth(firebaseApp);

// Avoid duplicate backend sign-in calls (e.g. React StrictMode dev double-mount).
let backendSignInInFlight: Promise<any> | null = null;
let backendSignInInFlightUid: string | null = null;

export default function ({ children }: PropsWithChildren) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  const queryClient = useQueryClient();
  const { signInMutationAsync } = useUserSignInMutation();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(AUTH, async (user) => {
      if (user) {
        // Auth pages run their own backend sign-in/sign-up flows; avoid duplicating it here.
        if (consumeSkipBackendSignInRequest()) {
          setState({ loading: false });
          return;
        }

        const token = await user.getIdToken();

        if (token) {
          setHeader(token);
          saveCookie(ACCESS_TOKEN_KEY, token);

          try {
            if (!backendSignInInFlight || backendSignInInFlightUid !== user.uid) {
              backendSignInInFlightUid = user.uid;
              backendSignInInFlight = signInMutationAsync({}).finally(() => {
                backendSignInInFlight = null;
                backendSignInInFlightUid = null;
              });
            }

            const res = await backendSignInInFlight;

            if (res.user_signIn?.status.code === 1) {
              setState({ user: user, loading: false });

              queryClient.invalidateQueries({
                queryKey: ["user_getCurrentUser"],
              });
            } else {
              setState({ user: null, loading: false });
            }
          } catch {
            setState({ user: null, loading: false });
          }
        } else {
          setState({ user: null, loading: false });
        }
      } else {
        setState({ user: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const reloadUser = async () => {
    try {
      await state.user?.reload(); // Refresh the user's profile data
      setState({ loading: false, user: AUTH.currentUser }); // Update the user state
    } catch (error) {
      throw error;
    }
  };

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      reloadUser,
      user: state.user ?? null,
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      ...FirebaseActions,
    }),
    [state.user, status]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
