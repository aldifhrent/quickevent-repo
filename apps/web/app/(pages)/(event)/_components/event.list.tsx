"use client";

import UpcomingEvents from "./event.upcoming";
import NewEvents from "./event.new";
import { useEvents } from "@/hooks/events";

export default function EventList() {
  const { upcomingEvents, newEvents, isLoading, error } = useEvents();

  return (
    <div className="container flex flex-col items-center mt-20 mb-20 p-6">
      {/* Kirim data dari useEvents sebagai props */}
      <UpcomingEvents
        upcomingEvents={upcomingEvents}
        isLoading={isLoading}
        error={error}
      />
      <NewEvents newEvents={newEvents} isLoading={isLoading} error={error} />
    </div>
  );
}
