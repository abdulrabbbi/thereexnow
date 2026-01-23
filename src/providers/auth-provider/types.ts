import { User } from "firebase/auth";
import * as FirebaseActions from "./actions";

export type FirebaseUserType = Record<string, any> | null;

export type AuthState = {
  loading: boolean;
  user: User | null;
};

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  reloadUser: () => Promise<void>;
} & typeof FirebaseActions;

export type FirebaseSignInParams = {
  email: string;
  password: string;
};

export type FirebaseSignUpParams = {
  email: string;
  password: string;
};

export type FirebaseForgotPasswordParams = {
  email: string;
};
