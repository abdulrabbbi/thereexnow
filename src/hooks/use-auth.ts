"use client";

import { AuthContext } from "@/providers/auth-provider/context";
import { useContext } from "react";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth: Context must be used inside AuthProvider");
  }

  return context;
}
