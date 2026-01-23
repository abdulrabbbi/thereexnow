import { createContext } from "react";
import { GlobalModalContextType } from "./types";

export const GlobalModalContext = createContext<GlobalModalContextType | null>(
  null
);
