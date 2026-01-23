import type { Transition, Variants } from "framer-motion";

import { varTranEnter, varTranExit } from "./transition";

// ----------------------------------------------------------------------

type Direction = "inX" | "inY" | "outX" | "outY";

type Options = {
  distance?: number;
  transitionIn?: Transition;
  transitionOut?: Transition;
};

export const varFlip = (direction: Direction, options?: Options): Variants => {
  const transitionIn = options?.transitionIn;
  const transitionOut = options?.transitionOut;

  const variants: Record<Direction, Variants> = {
    /**** In ****/
    inX: {
      initial: { rotateX: -180, opacity: 0 },
      animate: {
        rotateX: 0,
        opacity: 1,
        transition: varTranEnter(transitionIn),
      },
      exit: {
        rotateX: -180,
        opacity: 0,
        transition: varTranExit(transitionOut),
      },
    },
    inY: {
      initial: { rotateY: -180, opacity: 0 },
      animate: {
        rotateY: 0,
        opacity: 1,
        transition: varTranEnter(transitionIn),
      },
      exit: {
        rotateY: -180,
        opacity: 0,
        transition: varTranExit(transitionOut),
      },
    },
    /**** Out ****/
    outX: {
      initial: { rotateX: 0, opacity: 1 },
      animate: {
        rotateX: 70,
        opacity: 0,
        transition: varTranExit(transitionOut),
      },
    },
    outY: {
      initial: { rotateY: 0, opacity: 1 },
      animate: {
        rotateY: 70,
        opacity: 0,
        transition: varTranExit(transitionOut),
      },
    },
  };

  return variants[direction];
};
