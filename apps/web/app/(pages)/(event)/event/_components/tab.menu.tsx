"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { price } from "@/lib/currency";
import { Events } from "@/types/types";

export default function TabMenu({ event }: { event: Events }) {
  return (
    <Tabs defaultValue="description" className=" w-full ">
      <TabsList className="ml-auto flex items-center gap-6 rounded-t-lg border-b-2 border-gray-200 p-1">
        {/* Description Tab */}
        <TabsTrigger
          value="description"
          className="text-md font-medium py-2 px-6 transition-all duration-300 ease-in-out relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Description
        </TabsTrigger>

        {/* Ticket Tab */}
        <TabsTrigger
          value="ticket"
          className="text-md font-medium py-2 px-6 transition-all duration-300 ease-in-out relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Ticket
        </TabsTrigger>
      </TabsList>

      {/* Content for Description Tab */}
      <TabsContent
        value="description"
        className="mt-4 p-6 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Event Description
        </h2>
        <p className="mt-2 text-gray-600">{event.description}</p>
      </TabsContent>

      {/* Content for Ticket Tab */}
      <TabsContent
        value="ticket"
        className="mt-4 p-6 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Ticket Information
        </h2>

        <div className="mt-6 p-4 border rounded-lg shadow-md bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            {event.ticketType} TICKET
          </h3>
          <p className="mt-2 text-gray-600">
            {event.ticketType === "FREE"
              ? "Access to all general areas and sessions."
              : "Includes premium seating and exclusive perks."}
          </p>

          <p className="mt-4 text-xl font-bold text-indigo-600">
            {price(event.price)}
          </p>
          <Link href={`/event/${event.slug}/transactions`}>
            <Button className="mt-4 w-full bg-indigo-500 text-white hover:bg-indigo-600">
              Buy Ticket
            </Button>
          </Link>
        </div>
      </TabsContent>
    </Tabs>
  );
}
