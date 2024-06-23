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
  return (
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
