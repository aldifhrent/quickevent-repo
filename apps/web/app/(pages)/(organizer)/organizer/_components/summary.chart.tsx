import { Card } from "@/components/ui/card";
import {
  AnalyticsData,
  SummaryAnalytics,
  SummaryChartProps,
} from "@/types/types";

export default function SummaryCharts({ data }: SummaryChartProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
      <Card className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Total Tickets</h3>
        <p className="text-2xl font-bold">{data.summary.totalTickets}</p>
      </Card>
      <Card className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Total Attended</h3>
        <p className="text-2xl font-bold text-green-600">
          {data.summary.totalAttended}
        </p>
      </Card>
      <Card className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Overall Attendance Rate</h3>
        <p className="text-2xl font-bold text-blue-600">
          {data.summary.overallAttendanceRate}
        </p>
      </Card>
    </div>
  );
}
