"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OrganizedProfile from "../../_components/organized";
import RightSideMenu from "../../_components/rightside.menu";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import { Events } from "@/types/types";

const Transactions = () => {
  const session = useSession();
  const params = useParams();

  const [event, setEvent] = useState<Events | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const ticketPrice = event?.price || 0;
  const totalPrice = ticketCount * ticketPrice;

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api(session.data?.user.access_token).get(
        `/events/${params.slug}`
      );
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
  }, [params.slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="container mt-16 p-4">
      <div className="flex flex-col lg:flex-row justify-between">
        {/* Left Section */}
        <div className="w-full lg:w-8/12 flex-col">
          {/* Event Image */}
          <div className="mt-4">
            <Image
              src={event.imageUrl || "https://example.com/default-image.jpg"}
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

          {/* Divider */}
          <hr className="mt-4" />

          {/* Purchase Form */}
          <div className="mt-4 p-6 border rounded-lg bg-white shadow-lg">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>

            {/* Ticket Selection */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Select Ticket Quantity:
              </label>
              <Input
                type="number"
                min="1"
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Order Summary */}
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <p className="mt-2 text-gray-700">
                Ticket Price: IDR {ticketPrice.toLocaleString()}
              </p>
              <p className="mt-1 text-gray-700">Quantity: {ticketCount}</p>
              <p className="mt-2 text-lg font-bold">
                Total: IDR {totalPrice.toLocaleString()}
              </p>
            </div>

            {/* Payment Information */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Name:</label>
              <Input
                type="text"
                placeholder="Your Full Name"
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Email:</label>
              <Input
                type="email"
                placeholder="Your Email Address"
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Payment Method:
              </label>
              <select className="w-full p-2 border rounded-lg">
                <option>Credit Card</option>
                <option>Bank Transfer</option>
                <option>GoPay</option>
                <option>OVO</option>
              </select>
            </div>

            <Button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Confirm Payment
            </Button>
          </div>
        </div>

        {/* Right Side Menu */}
        <RightSideMenu event={event} />
      </div>
    </div>
  );
};

export default Transactions;
