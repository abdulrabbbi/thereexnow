import { FirebaseErrorCatalogs } from "@/assets/data/firebase-catalog";
import { GLOBAL_CONFIG } from "@/global-config";
import { ExerciseDto, Exercises } from "@/graphql/generated";
import { MediaType, SimplifiedExerciseDto } from "@/types";
import { FirebaseError } from "firebase/app";

// Removing Double Slashes from URLs
function cleanUrl(url: string) {
  // Split after protocol
  const parts = url.split("://");
  // Clean all double slashes in the path part
  parts[1] = parts[1].replace(/\/+/g, "/");
  // Rejoin
  return parts.join("://");
}

export function getAssetsUrl(url?: string | undefined | null) {
  if (url && url.includes("/files")) {
    url = url.replaceAll("/files", "");
  }

  if (url) {
    if (url?.startsWith?.("http")) {
      const cleanedUrl = cleanUrl(url);

      var strippedUrl = new URL(cleanedUrl);

      let pathname = strippedUrl.pathname.startsWith("/")
        ? strippedUrl.pathname.slice(1)
        : strippedUrl.pathname;

      if (pathname.endsWith("mp4") && pathname.startsWith("images/images/")) {
        pathname = pathname.replace("images/images/", "");
      }

      return `${GLOBAL_CONFIG.assetsDir}files/${pathname}`;
    }

    const pathname = url.startsWith("/") ? url.slice(1) : url;

    return url && `${GLOBAL_CONFIG.assetsDir}files/${pathname}`;
  }

  return "";
}

export function simplifyExercise(exerciseDto: ExerciseDto) {
  const formattedExercise: SimplifiedExerciseDto = {
    ...exerciseDto,
    // @ts-ignore
    exercise: {
      ...exerciseDto.exercise,
      ...exerciseNoteParser(exerciseDto.exercise?.note ?? ""),
      otherMedia: getOtherMedia(exerciseDto.exercise?.otherMediaUrl ?? ""),
    },
  };

  return formattedExercise;
}

export function getOtherMedia(otherMedia: Exercises["otherMediaUrl"]) {
  if (otherMedia) {
    return JSON.parse(otherMedia) as Array<MediaType>;
  }

  return [];
}

export type NoteWorkoutType = {
  note: string;
  workoutMove: Array<string>;
};

export function exerciseNoteParser(note: string): NoteWorkoutType {
  try {
    const parsedNote = JSON.parse(note);

    if ("workoutMove" in parsedNote) {
      return parsedNote as NoteWorkoutType;
    } else {
      return {
        note: note,
        workoutMove: [],
      };
    }
  } catch (error) {
    return {
      note: note,
      workoutMove: [],
    };
  }
}

export function exerciseNoteStrigify(note: string, workoutMove: Array<string>) {
  const formattedNote = {
    note: note,
    workoutMove: workoutMove,
  };

  return JSON.stringify(formattedNote);
}

export function getResponseError(error: any) {
  if (error instanceof FirebaseError) return FirebaseErrorCatalogs[error?.code];
  else error;
}
