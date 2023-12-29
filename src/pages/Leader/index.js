import { Box } from "@mui/material";
import { BarChart, axisClasses } from "@mui/x-charts";

function Leader() {
  return (
    <Box>
      <BarsDataset />
    </Box>
  );
}

export default Leader;
const chartSetting = {
  yAxis: [
    {
      label: "Số lượng (đơn)",
    },
  ],
  width: 1150,
  height: 500,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-20px, 0)",
    },
    padding: "6px",
    marginLeft: "60px",
    alignSelf: "center",
  },
};
const dataset = [
  {
    pending: 112,
    success: 70,
    failed: 27,
    month: "",
  },
];

const valueFormatter = (value) => `${value} đơn`;

function BarsDataset() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: "band", dataKey: "month" }]}
      series={[
        {
          dataKey: "pending",
          label: "Đang vận chuyển",
          valueFormatter,
          color: "#ff9800",
        },
        {
          dataKey: "success",
          label: "Thành công",
          valueFormatter,
          color: "#4caf50",
        },
        {
          dataKey: "failed",
          label: "Thất bại",
          valueFormatter,
          color: "#d32f2f",
        },
      ]}
      {...chartSetting}
    />
  );
}
