import { PieChartItem } from "@/utils/dataTypes";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { CustomLegend } from "./CustomLegend";

interface CustomPieChartProps {
  data: PieChartItem[];
  colors: string[];
}

export const CustomPieChart = ({ data, colors }: CustomPieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart className="recharts">
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          tabIndex={-1}
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell
              className="pointer-events-auto"
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" content={<CustomLegend />} />{" "}
      </PieChart>
    </ResponsiveContainer>
  );
};
