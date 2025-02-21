"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/app/loading";

export default function OrganizerDashboard() {
  const params = useParams();
  console.log(params);
  const { data: session, status } = useSession();

  const organizerIdFromParams = params.organizerId;
  const isValidOrganizer = session?.user.organizerId === organizerIdFromParams;

  if (!isValidOrganizer) {
    return (
      <div className="flex min-h-screen  items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">Error</h2>
          <p className="text-gray-600 mt-4">
            You do not have access to this organizer&apos;s dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen ">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Welcome to Organizer Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your events, view analytics, and configure settings.
        </p>
      </main>
    </div>
  );
}
