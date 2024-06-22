import { Exercise } from "@/lib/exercises/exercise";
import { ExerciseEnum } from "@/lib/exercises/exercise-enum";

export const findExerciseSlugByLabel = (
  dict: Array<[string, Exercise]>,
  labelOrName?: string
): ExerciseEnum | null => {
  // First assume that labelOrName is a slug
  const foundElement = dict.find(([slug]) => slug === labelOrName);
  if (foundElement) return foundElement[0] as ExerciseEnum;

  // Then assume that labelOrName is a label
  const foundElement2 = dict.find(
    ([, exercise]) => exercise.label === labelOrName
  );
  if (foundElement2) return foundElement2[0] as ExerciseEnum;

  return null;
};
