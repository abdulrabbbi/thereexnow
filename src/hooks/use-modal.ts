import { GlobalModalContext } from "@/providers/global-modal-provider/context";
import { useContext } from "react";

export const useModal = () => {
  const context = useContext(GlobalModalContext);

  if (!context) {
    throw new Error("useModal must be used within a GlobalModalProvider");
  }

  return context;
};
