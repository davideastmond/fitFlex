import { BarChart } from "@mui/x-charts";

interface BaseWidgetBarChartProps {
  xAxisData: Array<any>;
  seriesData: Array<number>;
}

// This is a template for a bar chart component just so the code can remain DRY
export default function BaseWidgetBarChart({
  xAxisData,
  seriesData,
}: BaseWidgetBarChartProps) {
  if (seriesData.length === 0) return null;
  return (
    <BarChart
      tooltip={{ trigger: "none" }}
      height={150}
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
        position: "relative",
        top: "-35px",
      }}
      yAxis={[
        {
          disableTicks: true,
        },
      ]}
      xAxis={[
        {
          scaleType: "band",
          data: xAxisData,
          disableTicks: true,
          colorMap: {
            type: "continuous",
            max: 5, // POIJ
            color: ["green", "orange"], // POIJ
          },
        },
      ]}
      series={[{ data: seriesData }]}
    />
  );
}
