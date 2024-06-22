import { ExerciseEnum } from "@/lib/exercises/exercise-enum";
import { ExercisesDictionary } from "@/lib/exercises/exercises-dictionary";
import { BarChart } from "@mui/x-charts";
import { useRef } from "react";

type ExerciseCountData = Record<ExerciseEnum | string, number>;

interface FavoriteExerciseWidgetProps {
  data: ExerciseCountData;
}

export function FavoriteExerciseWidget({ data }: FavoriteExerciseWidgetProps) {
  const dataRef = useRef(getTopFiveExercises(data));
  return (
    <div
      className="blueGray"
      style={{
        height: "180px",
        width: "175px",
        borderRadius: "20px",
      }}
    >
      <div>
        <div className="pt-2">
          <h1 className="robotoFont text-base font-bold text-center text-white">
            Favorite Exercise
          </h1>
          <div className="mt-2">
            <h2 className="verdanaFont text-2xl font-bold text-center text-white">
              {calculateFavoriteExercise(data)}
            </h2>
          </div>
        </div>
        <div className="w-48 h-40">
          {/* Bar chart goes here */}
          <BarChart
            tooltip={{ trigger: "none" }}
            sx={{
              "& .MuiChartsAxis-directionY": {
                display: "none",
              },
              "& .MuiChartsAxis-directionX": {
                display: "none",
              },
              "&& .MuiBarElement-root": {
                rx: 5,
                width: "7px !important",
              },
              paddingBottom: "12px",
            }}
            xAxis={[
              {
                scaleType: "band",
                data: dataRef.current.map(([e, count]) => count),
                disableTicks: true,
                colorMap: {
                  type: "continuous",
                  max: 5,
                  color: ["green", "orange"],
                },
              },
            ]}
            yAxis={[
              {
                disableTicks: true,
              },
            ]}
            series={[
              {
                data: dataRef.current.map(([, count]) => count),
              },
            ]}
          />
        </div>
      </div>
    </div>
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
