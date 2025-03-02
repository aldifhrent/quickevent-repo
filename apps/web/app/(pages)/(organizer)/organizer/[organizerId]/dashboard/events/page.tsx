"use client";

import { useSession } from "next-auth/react";
import { useOrganizer } from "@/hooks/organizer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Events } from "@/types/types";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function OrganizerDashboardEvents() {
  const params = useParams();
  const session = useSession();
  const { organizer, loading, error } = useOrganizer();
  const [events, setEvents] = useState<Events[]>([]);

  // Fetch events when organizer is available and authenticated
  useEffect(() => {
    if (session.data?.user) {
      const getEvents = async () => {
        try {
          const response = await api(
            "/events/byorg",
            "GET",
            {},
            session.data.user.access_token
          );

          if (response.data) {
            setEvents(response.data); // Set events data
          } else {
            console.log(response.data);
          }
        } catch (err) {
          console.error("Error fetching events:", err);
        }
      };

      getEvents();
    }
  }, [session.data?.user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!organizer) {
    return <div>No organizer data available</div>;
  }

  // Jika sesi ada, lakukan validasi apakah organizerId sesuai
  const organizerIdFromParams = params.organizerId; // Mengambil slug atau id dari URL
  const isValidOrganizer =
    session?.data?.user.organizerId === organizerIdFromParams;
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
    <div className="flex min-h-screen flex-col md:flex-row">
      <main className="flex-1 p-6">
        <h1 className="text-gray-600 mt-2 text-xl font-bold">
          Manage your events
        </h1>

        <div className="mt-6">
          <Button className="inline-block  text-white px-4 py-2 rounded-md">
            <Link
              href={`/organizer/${params.organizerId}/dashboard/events/create`}
              className=""
            >
              Create Event
            </Link>
          </Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mt-10">Events</h3>
          {events.length > 0 ? (
            <div className="mt-6 w-full grid grid-cols-1  lg:grid-cols-3 gap-10">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="mb-4 p-4 bg-white rounded-lg shadow-lg w-[350px]"
                >
                  <h1 className="text-xl font-semibold">{event.title}</h1>

                  <Link
                    href={`/organizer/${params.organizerId}/dashboard/events/${event.slug}/edit`}
                    className="mt-2 block hover:underline"
                  >
                    View Event Details
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
