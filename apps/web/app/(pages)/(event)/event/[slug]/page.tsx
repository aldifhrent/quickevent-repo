/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "lucide-react";
import Image from "next/image";
import RightSideMenu from "../_components/rightside.menu";
import TabMenu from "../_components/tab.menu";
import OrganizedProfile from "../_components/organized";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Events } from "@/types/types";
import axios from "axios";

const EventDetails = () => {
  const session = useSession();
  const params = useParams();

  const [event, setEvent] = useState<Events | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:9000/api/v1/events/${params.slug}`,
        {
          headers: {
            Authorization: `Bearer ${session.data?.user.access_token}`,
          },
        }
      );

      console.log("FETCH EVENT ID", res.data.data);
      setEvent(res.data.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (params.slug) {
      fetchEvent();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="container mt-16 p-4 ">
      <div className="flex flex-col lg:flex-row justify-between">
        {/* Left Section */}
        <div className="w-full lg:w-8/12 flex-col">
          {/* Event Image */}
          <div className="mt-4">
            <Image
              src={
                event.imageUrl ||
                "https://assets.loket.com/neo/production/images/banner/20250106145852_677b8d3c5232e.jpg"
              }
              alt="Event"
              width={1200}
              height={900}
              className="w-full rounded-lg"
            />
          </div>

          {/* Event Information */}
          <div className="mt-8 flex justify-between">
            <OrganizedProfile event={event} />
            <Badge className="flex gap-1">
              <Ticket /> {event.availableSeats} / {event.totalTicket} Ticket
            </Badge>
          </div>

          <hr className="mt-4" />

          <TabMenu event={event} />
        </div>

        {/* Right Side Menu */}
        <RightSideMenu event={event} />
      </div>
    </div>
  );
};

export default EventDetails;
