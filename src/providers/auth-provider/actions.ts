"use client";

import {
  User,
  FacebookAuthProvider as _FacebookAuthProvider,
  GoogleAuthProvider as _GoogleAuthProvider,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  sendPasswordResetEmail as _sendPasswordResetEmail,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  signInWithPopup as _signInWithPopup,
  signOut as _signOut,
} from "firebase/auth";
import { toast } from "sonner";
import { AUTH } from "./provider";
import {
  FirebaseForgotPasswordParams,
  FirebaseSignInParams,
  FirebaseSignUpParams,
} from "./types";

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({
  email,
  password,
}: FirebaseSignInParams): Promise<User | void> => {
  try {
    await _signInWithEmailAndPassword(AUTH, email, password);

    const user = AUTH.currentUser;

    if (!user?.emailVerified) {
      toast.info("Email not verified!");
      return;
    }

    return user;
  } catch (error) {
    console.error("Error during sign in with password:", error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<void> => {
  const provider = new _GoogleAuthProvider();
  await _signInWithPopup(AUTH, provider);
};

export const signInWithFacebook = async (): Promise<void> => {
  const provider = new _FacebookAuthProvider();
  await _signInWithPopup(AUTH, provider);
};

/** **************************************
 * Sign up
 *************************************** */
export const signUpWithEmailAndPassword = async ({
  email,
  password,
}: FirebaseSignUpParams): Promise<User> => {
  try {
    const newUser = await _createUserWithEmailAndPassword(
      AUTH,
      email,
      password
    );

    const user = newUser.user;

    return user as User;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  await _signOut(AUTH);
};

/** **************************************
 * Reset password
 *************************************** */
export const sendPasswordResetEmail = async ({
  email,
}: FirebaseForgotPasswordParams): Promise<void> => {
  await _sendPasswordResetEmail(AUTH, email);
};
