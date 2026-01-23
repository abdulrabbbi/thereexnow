import { BoardContext } from "@/providers/board-provider";
import { useContext } from "react";

export function useBoard() {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error("useBoard: Context must be used inside BoardProvider");
  }

  return context;
}
