"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "./event.card";
import useEmblaCarousel from "embla-carousel-react";

interface UpcomingEventsProps {
  upcomingEvents: any[];
  isLoading: boolean;
  error: string | null;
}

export default function UpcomingEvents({
  upcomingEvents,
  isLoading,
  error,
}: UpcomingEventsProps) {
  return (
    <Card className="w-full p-8">
      <h2 className="text-xl font-bold">Upcoming Event</h2>

      <div className="mt-10">
        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : upcomingEvents.length === 0 ? (
          <p className="text-center text-gray-500">No events found</p>
        ) : (
          <EventSlider events={upcomingEvents} />
        )}
      </div>
    </Card>
  );
}

function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 p-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="p-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="mt-4 h-4 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </Card>
      ))}
    </div>
  );
}

function EventSlider({ events }: { events: any[] }) {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    align: "start",
    dragThreshold: 1,
  });

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 [&>*]:shrink-0 [&>*]:basis-[80%] sm:[&>*]:basis-[50%] md:[&>*]:basis-[33.3333%] lg:[&>*]:basis-[25%] xl:[&>*]:basis-[20%]">
          {events.map((event) => (
            <div key={event.id} className="p-2">
              <EventCard {...event} imageUrl={event.imageUrl} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
