import Category from "./category";
import EventCard from "./event.card";
import { Card } from "./ui/card";
export default function EventList() {
  return (
    <Card className="container mb-20 mt-20 w-full items-center p-4 shadow-2xl dark:bg-white">
      <Category />

      <div className="mt-8 grid grid-cols-1 gap-10 p-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </Card>
  );
}
