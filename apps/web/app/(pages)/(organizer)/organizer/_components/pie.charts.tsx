import { Card } from "@/components/ui/card";
import { AnalyticsData } from "@/types/types";
import {
  Tooltip,
  Legend,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

interface PieChartProps {
  name: string;
  value: number;
}
interface PieChartData {
  data: PieChartProps[];
}
export default function PieCharts({ data }: PieChartData) {
  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <Card className="bg-white p-4 rounded-lg shadow w-full">
      <h2 className="text-lg font-semibold mb-4">
        Overall Attendance Distribution
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
