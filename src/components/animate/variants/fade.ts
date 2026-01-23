import type { Transition, Variants } from "framer-motion";

import { varTranEnter, varTranExit } from "./transition";

// ----------------------------------------------------------------------

type Direction =
  | "in"
  | "inUp"
  | "inDown"
  | "inLeft"
  | "inRight"
  | "out"
  | "outUp"
  | "outDown"
  | "outLeft"
  | "outRight";

type Options = {
  distance?: number;
  transitionIn?: Transition;
  transitionOut?: Transition;
};

export const varFade = (direction: Direction, options?: Options): Variants => {
  const distance = options?.distance || 120;
  const transitionIn = options?.transitionIn;
  const transitionOut = options?.transitionOut;

  const variants: Record<Direction, Variants> = {
    /**** In ****/
    in: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: varTranEnter },
      exit: { opacity: 0, transition: varTranExit },
    },
    inUp: {
      initial: { y: distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: varTranEnter(transitionIn) },
      exit: { y: distance, opacity: 0, transition: varTranExit(transitionOut) },
    },
    inDown: {
      initial: { y: -distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: varTranEnter(transitionIn) },
      exit: {
        y: -distance,
        opacity: 0,
        transition: varTranExit(transitionOut),
      },
    },
    inLeft: {
      initial: { x: -distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: varTranEnter(transitionIn) },
      exit: {
        x: -distance,
        opacity: 0,
        transition: varTranExit(transitionOut),
      },
    },
    inRight: {
      initial: { x: distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: varTranEnter(transitionIn) },
      exit: { x: distance, opacity: 0, transition: varTranExit(transitionOut) },
    },
    /**** Out ****/
    out: {
      initial: { opacity: 1 },
      animate: { opacity: 0, transition: varTranEnter(transitionIn) },
      exit: { opacity: 1, transition: varTranExit(transitionOut) },
    },
    outUp: {
      initial: { y: 0, opacity: 1 },
      animate: {
        y: -distance,
        opacity: 0,
        transition: varTranEnter(transitionIn),
      },
      exit: { y: 0, opacity: 1, transition: varTranExit(transitionOut) },
    },
    outDown: {
      initial: { y: 0, opacity: 1 },
      animate: {
        y: distance,
        opacity: 0,
        transition: varTranEnter(transitionIn),
      },
      exit: { y: 0, opacity: 1, transition: varTranExit(transitionOut) },
    },
    outLeft: {
      initial: { x: 0, opacity: 1 },
      animate: {
        x: -distance,
        opacity: 0,
        transition: varTranEnter(transitionIn),
      },
      exit: { x: 0, opacity: 1, transition: varTranExit(transitionOut) },
    },
    outRight: {
      initial: { x: 0, opacity: 1 },
      animate: {
        x: distance,
        opacity: 0,
        transition: varTranEnter(transitionIn),
      },
      exit: { x: 0, opacity: 1, transition: varTranExit(transitionOut) },
    },
  };

  return variants[direction];
};
