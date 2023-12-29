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
    pending: 0,
    outgoing: 0,
    failed: 0,
    month: "Jan",
  },
  {
    pending: 0,
    success: 0,
    failed: 0,
    month: "Fev",
  },
  {
    pending: 0,
    success: 0,
    failed: 0,
    month: "Mar",
  },
  {
    pending: 0,
    success: 0,
    failed: 0,
    month: "Apr",
  },
  {
    pending: 0,
    success: 0,
    failed: 0,
    month: "May",
  },
  {
    pending: 0,
    success: 0,
    failed: 0,
    month: "June",
  },
  {
    pending: 0,
    success: 0,
    failed: 0,
    month: "July",
  },
  {
    pending: 0,
    success: 0,
    failed: 0,
    month: "Aug",
  },
  {
    pending: 0,
    success: 0,
    failed: 0,
    month: "Sept",
  },
  {
    pending: 0,
    success: 0,
    failed: 0,
    month: "Oct",
  },
  {
    pending: 0,
    success: 0,
    failed: 0,
    month: "Nov",
  },
  {
    pending: 59,
    success: 37,
    failed: 20,
    month: "Dec",
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
