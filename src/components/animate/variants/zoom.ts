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

export const varZoom = (direction: Direction, options?: Options): Variants => {
  const distance = options?.distance || 720;
  const transitionIn = options?.transitionIn;
  const transitionOut = options?.transitionOut;

  const variants = {
    /**** In ****/
    in: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1, transition: varTranEnter(transitionIn) },
      exit: { scale: 0, opacity: 0, transition: varTranExit(transitionOut) },
    },
    inUp: {
      initial: {
        scale: 0,
        opacity: 0,
        translateY: distance,
      },
      animate: {
        scale: 1,
        opacity: 1,
        translateY: 0,
        transition: varTranEnter(transitionIn),
      },
      exit: {
        scale: 0,
        opacity: 0,
        translateY: distance,
        transition: varTranExit(transitionOut),
      },
    },
    inDown: {
      initial: { scale: 0, opacity: 0, translateY: -distance },
      animate: {
        scale: 1,
        opacity: 1,
        translateY: 0,
        transition: varTranEnter(transitionIn),
      },
      exit: {
        scale: 0,
        opacity: 0,
        translateY: -distance,
        transition: varTranExit(transitionOut),
      },
    },
    inLeft: {
      initial: { scale: 0, opacity: 0, translateX: -distance },
      animate: {
        scale: 1,
        opacity: 1,
        translateX: 0,
        transition: varTranEnter(transitionIn),
      },
      exit: {
        scale: 0,
        opacity: 0,
        translateX: -distance,
        transition: varTranExit(transitionOut),
      },
    },
    inRight: {
      initial: { scale: 0, opacity: 0, translateX: distance },
      animate: {
        scale: 1,
        opacity: 1,
        translateX: 0,
        transition: varTranEnter(transitionIn),
      },
      exit: {
        scale: 0,
        opacity: 0,
        translateX: distance,
        transition: varTranExit(transitionOut),
      },
    },
    /**** Out ****/
    out: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, transition: varTranEnter(transitionIn) },
    },
    outUp: {
      initial: { scale: 1, opacity: 1 },
      animate: {
        scale: 0,
        opacity: 0,
        translateY: -distance,
        transition: varTranEnter(transitionIn),
      },
    },
    outDown: {
      initial: { scale: 1, opacity: 1 },
      animate: {
        scale: 0,
        opacity: 0,
        translateY: distance,
        transition: varTranEnter(transitionIn),
      },
    },
    outLeft: {
      initial: { scale: 1, opacity: 1 },
      animate: {
        scale: 0,
        opacity: 0,
        translateX: -distance,
        transition: varTranEnter(transitionIn),
      },
    },
    outRight: {
      initial: { scale: 1, opacity: 1 },
      animate: {
        scale: 0,
        opacity: 0,
        translateX: distance,
        transition: varTranEnter(transitionIn),
      },
    },
  };

  return variants[direction];
};
