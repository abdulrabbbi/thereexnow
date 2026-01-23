import { ExerciseDto, Users } from "@/graphql/generated";
import { HoldType, PerformType } from "@/hooks/use-mock-data";

export type LabelValue = {
  label: string;
  value: string;
};

export type MediaType = {
  url: string;
  mirror?: boolean;
  fileName?: string;
  type: "image" | "video";
};

export type SimplifiedExercise = ExerciseDto["exercise"] & {
  workoutMove: Array<string>;
  otherMedia: Array<MediaType>;
};

export type SimplifiedExerciseDto = {
  exercise?: SimplifiedExercise;
  products?: ExerciseDto["products"];
  isFavorite: ExerciseDto["isFavorite"];
  favoriteCount: ExerciseDto["favoriteCount"];
};

export type ExerciseDetailsType = {
  set: number;
  hold: number;
  reps: number;
  note: string;
  perform: number;
  holdType: HoldType;
  performType: PerformType;
  workoutMove: Array<string>;
};

export type HtmlStateType = {
  user?: Users;
  note?: string;
  author: string;
  exercises: Array<SimplifiedExercise>;
};
