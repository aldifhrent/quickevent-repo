import { Card } from "@/components/ui/card";
import { Calendar, Clock8, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Events } from "@/types/types";

export default function RightSideMenu({ event }: { event: Events }) {
  if (!event) {
    return null; // or a loading state if preferred
  }

  // Formatting start and end dates
  const formattedStartDate = format(new Date(event.eventStartDate), "dd MMMM ");
  const formattedEndDate = format(new Date(event.eventEndDate), "dd MMM yyyy");
  const eventStartDate = format(new Date(event.eventStartDate), "HH:mm");
  const eventEndDate = format(new Date(event.eventEndDate), "HH:mm");

  return (
    <Card className="h-full w-full  lg:w-6/12 mt-16">
      <div className="flex flex-col items-start p-4">
        <h1 className="text-nowrap text-md lg:text-xl font-bold">
          {event.title}
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          <p className="flex items-center gap-1 text-black text-nowrap text-md">
            <Calendar size={20} /> {formattedStartDate} - {formattedEndDate}
          </p>
          <p className="flex items-center gap-1 text-black ">
            <Clock8 /> {eventStartDate} - {eventEndDate} WIB
          </p>
          <p className="flex items-center gap-1 text-slate-500">
            <MapPin />
          </p>
        </div>
      </div>
    </Card>
  );
}
