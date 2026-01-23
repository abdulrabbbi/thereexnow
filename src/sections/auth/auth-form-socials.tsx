import type { BoxProps } from "@mui/material/Box";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import { FacebookIcon, GoogleIcon } from "@/assets/icons";
import { useSignIn, useSignUp } from "@/hooks/helpers/user";
import { AUTH } from "@/providers/auth-provider/provider";
import { getResponseError } from "@/utils";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "sonner";

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope("email");
googleAuthProvider.setCustomParameters({
  prompt: "select_account", // Forces account selection every time
});

export const facebookAuthProvider = new FacebookAuthProvider();
facebookAuthProvider.addScope("email");

type FormSocialsProps = BoxProps & {
  isSignUp?: boolean;
};

export function FormSocials({ sx, isSignUp, ...other }: FormSocialsProps) {
  const { onSignIn } = useSignIn();
  const { onSignUp } = useSignUp();

  const handleSocialAuth = async (provider: "google" | "facebook") => {
    try {
      const selectedProvider =
        provider === "google" ? googleAuthProvider : facebookAuthProvider;

      const result = await signInWithPopup(AUTH, selectedProvider);

      const token = await result.user.getIdToken();

      await onSignIn(token, async () => {
        await onSignUp({ token, email: result.user.email!, isSocial: true });
      });
    } catch (error) {
      toast.error(getResponseError(error));
    }
  };

  return (
    <Box
      sx={[
        { gap: 1.5, display: "flex", justifyContent: "center" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <IconButton
        color="inherit"
        onClick={handleSocialAuth.bind(null, "google")}
      >
        <GoogleIcon />
      </IconButton>

      <IconButton
        color="inherit"
        onClick={handleSocialAuth.bind(null, "facebook")}
      >
        <FacebookIcon />
      </IconButton>
    </Box>
  );
}
