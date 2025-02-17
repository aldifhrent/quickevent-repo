import EventList from "@/app/(pages)/(event)/_components/event.list";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen flex-col">
        <Hero />
        {/* <Category /> */}
        <EventList />
      </main>
    </div>
  );
}
