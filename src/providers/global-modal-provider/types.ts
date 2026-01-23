import { DialogProps } from "@mui/material";
import { ReactNode } from "react";

export type GlobalModalBodyProps = {
  handleCloseModal: () => void;
};

export type GlobalModalState = {
  title?: string;
  isOpen: boolean;
  options?: Omit<DialogProps, "open" | "onClose">;
  body: ((props: GlobalModalBodyProps) => ReactNode) | null;
};

export type GlobalModalContextType = {
  modal: GlobalModalState;
  handleCloseModal: () => void;
  handleOpenModal: ({
    title,
    body,
    options,
  }: Omit<GlobalModalState, "isOpen">) => void;
};
