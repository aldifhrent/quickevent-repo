"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";
import PieCharts from "../../../_components/pie.charts";
import BarCharts from "../../../_components/bar.chart";
import SummaryCharts from "../../../_components/summary.chart";
import DetailedTable from "../../../_components/detailed.table";
import { AnalyticsData, PieChartProps } from "@/types/types";
import PageNoSession from "./page.nosession";
import PageError from "./page.error";

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const params = useParams();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!session?.user?.organizerId) {
          throw new Error("Organizer ID not found in session");
        }

        const response = await fetch(
          "http://localhost:9000/api/v1/events/analytics",
          {
            headers: {
              Authorization: `Bearer ${session?.user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch analytics data");
        }

        setAnalyticsData(data.data);
        setError(null);
      } catch (err) {
        console.error("Analytics fetch error:", err);

        setAnalyticsData(null);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.access_token) {
      fetchAnalytics();
    }
  }, [session]);

  if (!session) {
    return <PageNoSession />;
  }

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-500">Loading analytics data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <PageError error={error} />;
  }

  if (!analyticsData?.events || analyticsData.events.length === 0) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Events Found
            </h2>
            <p className="text-gray-600">You haven't created any events yet.</p>
            <button
              onClick={() =>
                (window.location.href = `/organizer/${params.organizerId}/dashboard/events/create`)
              }
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Create Your First Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pieChartData: PieChartProps[] = [
    { name: "Attended", value: analyticsData.summary.totalAttended },
    { name: "Not Attended", value: analyticsData.summary.totalNonAttended },
  ];

  return (
    <div className="flex flex-col min-h-screen  w-full px-0 lg:px-8">
      <div className="flex flex-col p-8 lg:p-12">
        <h1 className="text-2xl font-bold mb-6">Event Analytics</h1>

        <SummaryCharts data={analyticsData} />
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full">
          <BarCharts data={analyticsData} />
          {/* Pie Chart */}
          <PieCharts data={pieChartData} />
        </div>

        {/* Detailed Table */}
        <DetailedTable data={analyticsData} />
      </div>
    </div>
  );
}
