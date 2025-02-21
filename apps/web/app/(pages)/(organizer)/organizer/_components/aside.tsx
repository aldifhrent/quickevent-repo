"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";

export default function Aside() {
  const params = useParams();
  return (
    <aside className="w-24 lg:w-64 bg-white shadow-md p-4 border-r min-h-screen">
      <h2 className="hidden lg:inline-block text-xl font-semibold mb-4">
        Dashboard
      </h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              href={`/organizer/${params.organizerId}/dashboard/events`}
              className="flex items-center p-2 rounded hover:bg-gray-200"
            >
              <Calendar className="mr-2 " />
              <span className="hidden lg:block">Events</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/organizer/${params.organizerId}/dashboard/transactions`}
              className="flex items-center p-2 rounded hover:bg-gray-200"
            >
              <DollarSign className="mr-2 " />
              <span className="hidden lg:block">Transactions</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/organizer/${params.organizerId}/dashboard/analytics`}
              className="flex items-center p-2 rounded hover:bg-gray-200"
            >
              <TrendingUp className="mr-2 " />
              <span className="hidden lg:block">Analytics</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
