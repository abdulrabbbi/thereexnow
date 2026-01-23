"use client";

import { PropsWithChildren, useState } from "react";
import { GlobalModalContext } from "./context";
import type { GlobalModalState } from "./types";

const GlobalModalProvider = ({ children }: PropsWithChildren) => {
  const [modal, setModal] = useState<GlobalModalState>({
    title: "",
    body: null,
    isOpen: false,
  });

  const handleOpenModal = (params: Omit<GlobalModalState, "isOpen">) => {
    setModal({
      ...params,
      isOpen: true,
    });
  };

  const handleCloseModal = () => {
    setModal({
      title: "",
      body: null,
      isOpen: false,
    });
  };

  return (
    <GlobalModalContext.Provider
      value={{ modal, handleOpenModal, handleCloseModal }}
    >
      {children}
    </GlobalModalContext.Provider>
  );
};

export default GlobalModalProvider;
