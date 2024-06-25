import { ExerciseEnum } from "@/lib/exercises/exercise-enum";
import { useRef } from "react";
import BaseWidgetBarChart from "../base-widget-bar-chart/BaseWidgetBarChart";
import BaseWidget from "../base-widget/BaseWidget";
import { calculateFavoriteExercise, getTopFiveExercises } from "./utils/utils";

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
