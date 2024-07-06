import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./deviceCountChart.scss";
import { useTheme } from "../../contexts/ThemeContext";

const DeviceCountChart = ({ bigChartData }: { bigChartData: any }) => {
  const { themeColors } = useTheme();
  console.log(bigChartData);
  return (
    <div className="bigChartBox">
      <h1 style={{ marginBottom: "20px", color: themeColors.mainColor }}>
        Customer Device Counts
      </h1>
      <div className="chart">
        {bigChartData.length > 0 ? (
          <ResponsiveContainer width="99%" height="100%">
            <AreaChart
              data={bigChartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis dataKey="fullName" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="deviceCount"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="clothes"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="books"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p>No Data Available...</p>
        )}
      </div>
    </div>
  );
};

export default DeviceCountChart;
