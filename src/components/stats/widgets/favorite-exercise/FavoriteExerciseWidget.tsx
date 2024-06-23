import { ExerciseEnum } from "@/lib/exercises/exercise-enum";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { useRef } from "react";
import BaseWidgetBarChart from "../base-widget-bar-chart/BaseWidgetBarChart";
import BaseWidget from "../base-widget/BaseWidget";

type ExerciseCountData = Record<ExerciseEnum | string, number>;

interface FavoriteExerciseWidgetProps {
  data: ExerciseCountData;
}

export function FavoriteExerciseWidget({ data }: FavoriteExerciseWidgetProps) {
  const dataRef = useRef(getTopFiveExercises(data));
  return (
    <BaseWidget
      title="Favorite Exercise"
      subtitle={calculateFavoriteExercise(data)}
    >
      <BaseWidgetBarChart
        xAxisData={dataRef.current.map(([e, count]) => count)}
        seriesData={dataRef.current.map(([e, count]) => count)}
      />
    </BaseWidget>
  );
}

const calculateFavoriteExercise = (
  data: Record<ExerciseEnum | string, number>
): string => {
  // Sort the exercises by count
  const sortedExercises = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return ExercisesDictionary[sortedExercises[0][0] as ExerciseEnum].label;
};

const getTopFiveExercises = (
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
