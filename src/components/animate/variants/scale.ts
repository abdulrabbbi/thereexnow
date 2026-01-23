import type { Transition, Variants } from "framer-motion";

import { varTranEnter, varTranExit } from "./transition";

// ----------------------------------------------------------------------

type Direction = "in" | "inX" | "inY" | "out" | "outX" | "outY";

type Options = {
  transitionIn?: Transition;
  transitionOut?: Transition;
};

export const varScale = (direction: Direction, options?: Options): Variants => {
  const transitionIn = options?.transitionIn;
  const transitionOut = options?.transitionOut;

  const variants: Record<Direction, Variants> = {
    /**** In ****/
    in: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1, transition: varTranEnter(transitionIn) },
      exit: { scale: 0, opacity: 0, transition: varTranExit(transitionOut) },
    },
    inX: {
      initial: { scaleX: 0, opacity: 0 },
      animate: {
        scaleX: 1,
        opacity: 1,
        transition: varTranEnter(transitionIn),
      },
      exit: { scaleX: 0, opacity: 0, transition: varTranExit(transitionOut) },
    },
    inY: {
      initial: { scaleY: 0, opacity: 0 },
      animate: {
        scaleY: 1,
        opacity: 1,
        transition: varTranEnter(transitionIn),
      },
      exit: { scaleY: 0, opacity: 0, transition: varTranExit(transitionOut) },
    },
    /**** Out ****/
    out: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, transition: varTranEnter(transitionIn) },
    },
    outX: {
      initial: { scaleX: 1, opacity: 1 },
      animate: {
        scaleX: 0,
        opacity: 0,
        transition: varTranEnter(transitionIn),
      },
    },
    outY: {
      initial: { scaleY: 1, opacity: 1 },
      animate: {
        scaleY: 0,
        opacity: 0,
        transition: varTranEnter(transitionIn),
      },
    },
  };

  return variants[direction];
};
