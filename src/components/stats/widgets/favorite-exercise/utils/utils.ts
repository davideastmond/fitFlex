import { ExerciseEnum } from "@/lib/exercises/exercise-enum";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";

export const calculateFavoriteExercise = (
  data: Record<ExerciseEnum | string, number>
): string => {
  if (Object.keys(data).length === 0) {
    return "No data";
  }
  // Sort the exercises by count
  const sortedExercises = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return ExercisesDictionary[sortedExercises[0][0] as ExerciseEnum].label;
};

export const getTopFiveExercises = (
  data: Record<ExerciseEnum | string, number>
): Array<[string, number]> => {
  // Take the most popular 5 exercises, make sure it's in the middle of the array and then pick the other 5 at random
  const sortedExercises = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const topFive = sortedExercises.slice(0, 5);

  // Shuffle the array
  for (let i = topFive.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [topFive[i], topFive[j]] = [topFive[j], topFive[i]];
  }

  return topFive;
};
