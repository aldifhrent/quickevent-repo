import UpcomingEvents from "./event.upcoming";

import NewEvents from "./event.new";

export default function EventList() {
  return (
    <div className="container flex flex-col items-center mt-20 mb-20 p-6 ">
      <UpcomingEvents />
      <NewEvents />
    </div>
  );
}
