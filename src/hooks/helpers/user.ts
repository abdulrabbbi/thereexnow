import { fetcher, setHeader } from "@/graphql/fetcher";
import {
  User_SignInDocument,
  User_SignInQuery,
  User_SignInQueryVariables,
  UserType,
  useUser_SignUpMutation,
} from "@/graphql/generated";
import { useRouter, useSearchParams } from "@/routes/hooks";
import {
  getCompleteProfileRoute,
  getEmailVerifyRoute,
  getSignInRoute,
} from "@/routes/paths";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";
import { clearCookie, saveCookie } from "@/utils/storage/cookieStorage";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../use-auth";

export const useUserSignInMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    User_SignInQuery,
    TError,
    User_SignInQueryVariables,
    TContext
  >
) => {
  const { mutate, isPending } = useMutation<
    User_SignInQuery,
    TError,
    User_SignInQueryVariables,
    TContext
  >({
    mutationFn: (variables?: User_SignInQueryVariables) =>
      fetcher<User_SignInQuery, User_SignInQueryVariables>(
        User_SignInDocument,
        variables
      )(),
    ...options,
  });

  return {
    signInMutation: mutate,
    signInLoading: isPending,
  };
};

export function useSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { signInMutation } = useUserSignInMutation();
  const { reloadUser } = useAuth();

  const returnTo = searchParams.get("returnTo");

  const onSignIn = async (token: string, onError?: () => void) => {
    setHeader(token);
    saveCookie(ACCESS_TOKEN_KEY, token);

    signInMutation(
      {},
      {
        onSuccess: async (res) => {
          if (res.user_signIn?.status.code === 1) {
            const user = res.user_signIn.result;

            saveCookie(ACCESS_TOKEN_KEY, token);

            queryClient.invalidateQueries({
              queryKey: ["user_getCurrentUser"],
            });

            await reloadUser()

            router.replace(
              user?.fullName ? (returnTo ?? "/") : getCompleteProfileRoute()
            );
          } else {
            clearCookie(ACCESS_TOKEN_KEY);
            return onError
              ? onError()
              : toast.warning(res?.user_signIn?.status.value);
          }
        },
        onError: () => {
          onError?.();
        },
      }
    );
  };

  return {
    onSignIn,
  };
}

type UseSignUpParams = {
  token: string;
  email: string;
  isSocial: boolean;
};

export function useSignUp() {
  const router = useRouter();
  const { mutate: signUpMutation } = useUser_SignUpMutation();
   const { reloadUser } = useAuth();

  const onSignUp = async ({
    token,
    email,
    isSocial = false,
  }: UseSignUpParams) => {
    setHeader(token);
    saveCookie(ACCESS_TOKEN_KEY, token);

    signUpMutation(
      {
        data: {
          email,
          isSocial,
          language: "English",
          userType: UserType.NormalUser,
          confirmUrl: getEmailVerifyRoute(),
        },
      },
      {
        onSuccess: async (res) => {
          if (res.user_signUp?.status.code === 1) {
            if (isSocial) {
              saveCookie(ACCESS_TOKEN_KEY, token);
              await reloadUser()
              router.push(getCompleteProfileRoute());
            } else {
              // Verification email has been sent to provided email
              toast.info("Please check your email");
              router.push(getSignInRoute());
            }
          } else {
            return toast.warning(res?.user_signUp?.status.value);
          }
        },
      }
    );
  };

  return {
    onSignUp,
  };
}
