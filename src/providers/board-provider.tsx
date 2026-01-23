"use client";

import { SplashScreen } from "@/components/loading-screen";
import { SimplifiedExercise, SimplifiedExerciseDto } from "@/types";
import { createContext, PropsWithChildren, Suspense } from "react";
import { Updater, useImmer } from "use-immer";

export type BoardState = {
  note: string;
  data: Array<SimplifiedExerciseDto>;
};

export type BoardContextValue = BoardState & {
  onReset: () => void;
  onAddNote: (note: string) => void;
  onAddWorkout: (exerciseId: number) => void;
  onRemoveExercise: (exerciseId: number) => void;
  onMirrorImage: (id: number, index: number) => void;
  onAddExercise: (exerciseDto: SimplifiedExerciseDto) => void;
  onRemoveWorkout: (exerciseId: number, workoutIndex: number) => void;
  onEditWorkout: (
    exerciseId: number,
    workoutIndex: number,
    value: string
  ) => void;
  onEditExercise: (
    id: number,
    key: keyof SimplifiedExercise,
    value: string | number
  ) => void;
  setState: Updater<BoardState>;
};

export const BoardContext = createContext<BoardContextValue | undefined>(
  undefined
);

export default function ({ children }: PropsWithChildren) {
  const [state, setState] = useImmer<BoardState>({
    note: "",
    data: [],
  });

  const onAddNote = (note: string) => {
    setState((draft) => {
      draft.note = note;
    });
  };

  const onAddWorkout = (exerciseId: number) => {
    setState((draft) => {
      const oldItem = draft.data.find((el) => el?.exercise?.id === exerciseId);

      oldItem?.exercise?.workoutMove.push("");
    });
  };

  const onRemoveWorkout = (exerciseId: number, workoutIndex: number) => {
    setState((draft) => {
      const oldItem = draft.data.find((el) => el?.exercise?.id === exerciseId);

      oldItem?.exercise?.workoutMove.splice(workoutIndex, 1);
    });
  };

  const onEditWorkout = (
    exerciseId: number,
    workoutIndex: number,
    value: string
  ) => {
    setState((draft) => {
      const oldItem = draft.data.find((el) => el?.exercise?.id === exerciseId);

      if (oldItem) {
        let workoutMove = oldItem?.exercise?.workoutMove;

        if (workoutMove) {
          workoutMove[workoutIndex] = value;
        }
      }
    });
  };

  const onAddExercise = (exerciseDto: SimplifiedExerciseDto) => {
    const newData = [...(state.data || []), exerciseDto];
    setState((pre) => ({ ...pre, data: newData }));
    updateLocalStorage(newData);
  };

  const updateLocalStorage = (exerciseDto: SimplifiedExerciseDto[]) => {
    localStorage.setItem(
      "board_data",
      exerciseDto.map((item) => String(item.exercise?.id || "")).join(",")
    );
  };

  const onMirrorImage = (id: number, index: number) => {
    setState((draft) => {
      const oldItem = draft.data.find((el) => el?.exercise?.id === id);

      if (oldItem) {
        const mediaItem = oldItem?.exercise?.otherMedia.find(
          (media, mediaIndex) => index === mediaIndex
        );

        if (mediaItem) {
          mediaItem.mirror = !mediaItem.mirror;
        }
      }
    });
  };

  const onEditExercise = (
    id: number,
    key: keyof SimplifiedExercise,
    value: string | number
  ) => {
    setState((draft) => {
      const index = draft.data.findIndex((el) => el?.exercise?.id === id);

      // @ts-ignore
      draft.data[index].exercise[key] = value;
    });
  };

  const onRemoveExercise = (exerciseId: number) => {
    const newData = state.data.filter((el) => el.exercise?.id !== exerciseId);
    setState((pre) => ({ ...pre, data: newData }));
    updateLocalStorage(newData);
  };

  const onReset = () => {
    setState((draft) => {
      draft.data = [];
      draft.note = "";
    });
  };

  return (
    <BoardContext.Provider
      value={{
        ...state,
        onReset,
        onAddNote,
        onAddWorkout,
        onAddExercise,
        onEditWorkout,
        onMirrorImage,
        onEditExercise,
        onRemoveWorkout,
        onRemoveExercise,
        setState,
      }}
    >
      <Suspense fallback={<SplashScreen />}>{children}</Suspense>
    </BoardContext.Provider>
  );
}
