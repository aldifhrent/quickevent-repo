import { Card } from "@/components/ui/card";
import { AnalyticsData, BarChartProps } from "@/types/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BarCharts({ data }: BarChartProps) {
  return (
    <Card className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Attendance by Event</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.events}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="eventTitle"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="attendedCount" fill="#0088FE" name="Attended" />
            <Bar
              dataKey="nonAttendedCount"
              fill="#FF8042"
              name="Not Attended"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
