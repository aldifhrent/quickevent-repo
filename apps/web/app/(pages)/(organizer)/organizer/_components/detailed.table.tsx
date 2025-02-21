import { Card } from "@/components/ui/card";
import { AnalyticsData } from "@/types/types";

interface DetailedTableProps {
  data: AnalyticsData;
}

export default function DetailedTable({ data }: DetailedTableProps) {
  return (
    <Card className="mt-8 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold p-4 border-b">
        Detailed Event Statistics
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left shadow-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Total Tickets</th>
              <th className="px-6 py-3">Attended</th>
              <th className="px-6 py-3">Not Attended</th>
              <th className="px-6 py-3">Attendance Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.events.map((event: any, index: number) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{event.eventTitle}</td>
                <td className="px-6 py-4">
                  {event.totalTickets.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {event.attendedCount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {event.nonAttendedCount.toLocaleString()}
                </td>
                <td className="px-6 py-4">{event.attendanceRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
