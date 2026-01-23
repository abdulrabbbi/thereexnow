import type { Transition, Variants } from "framer-motion";

import { varTranEnter, varTranExit } from "./transition";

// ----------------------------------------------------------------------

type Direction =
  | "inUp"
  | "inDown"
  | "inLeft"
  | "inRight"
  | "outUp"
  | "outDown"
  | "outLeft"
  | "outRight";

type Options = {
  distance?: number;
  transitionIn?: Transition;
  transitionOut?: Transition;
};

export const varSlide = (direction: Direction, options?: Options): Variants => {
  const distance = options?.distance || 160;
  const transitionIn = options?.transitionIn;
  const transitionOut = options?.transitionOut;

  const variants: Record<Direction, Variants> = {
    /**** In ****/
    inUp: {
      initial: { y: distance },
      animate: { y: 0, transition: varTranEnter(transitionIn) },
      exit: { y: distance, transition: varTranExit(transitionOut) },
    },
    inDown: {
      initial: { y: -distance },
      animate: { y: 0, transition: varTranEnter(transitionIn) },
      exit: { y: -distance, transition: varTranExit(transitionOut) },
    },
    inLeft: {
      initial: { x: -distance },
      animate: { x: 0, transition: varTranEnter(transitionIn) },
      exit: { x: -distance, transition: varTranExit(transitionOut) },
    },
    inRight: {
      initial: { x: distance },
      animate: { x: 0, transition: varTranEnter(transitionIn) },
      exit: { x: distance, transition: varTranExit(transitionOut) },
    },
    /**** Out ****/
    outUp: {
      initial: { y: 0 },
      animate: { y: -distance, transition: varTranEnter(transitionIn) },
      exit: { y: 0, transition: varTranExit(transitionOut) },
    },
    outDown: {
      initial: { y: 0 },
      animate: { y: distance, transition: varTranEnter(transitionIn) },
      exit: { y: 0, transition: varTranExit(transitionOut) },
    },
    outLeft: {
      initial: { x: 0 },
      animate: { x: -distance, transition: varTranEnter(transitionIn) },
      exit: { x: 0, transition: varTranExit(transitionOut) },
    },
    outRight: {
      initial: { x: 0 },
      animate: { x: distance, transition: varTranEnter(transitionIn) },
      exit: { x: 0, transition: varTranExit(transitionOut) },
    },
  };

  return variants[direction];
};
