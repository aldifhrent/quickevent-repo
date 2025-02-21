"use client";

import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";
import OrganizedProfile from "../_components/organized";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Events } from "@/types/types";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "@/app/loading";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EventDetails = () => {
  const session = useSession();
  const params = useParams();

  const [event, setEvent] = useState<Events | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Mulai dengan loading true

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.slug || !session.data?.user.access_token) return;

      try {
        const res = await axios.get(
          `http://localhost:9000/api/v1/events/${params.slug}`,
          {
            headers: {
              Authorization: `Bearer ${session.data.user.access_token}`,
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

    fetchEvent();
  }, [params.slug, session.data?.user.access_token]); // Pastikan dependency tidak berubah-ubah

  // Format tanggal menggunakan useMemo agar tidak dihitung ulang setiap render
  const formattedDate = useMemo(() => {
    if (!event) return "";
    return `${format(event.eventStartDate, "dd MMMM yyyy", { locale: id })} - ${format(event.eventEndDate, "dd MMMM yyyy", { locale: id })}`;
  }, [event]);

  if (loading) {
    return <Loading />;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
        <Image
          src={event.imageUrl || "/placeholder-event.jpg"}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 mb-6">
              <Badge variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </Badge>

              <Badge variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </Badge>
            </div>
          </div>

          {/* Organizer Profile */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <OrganizedProfile event={event} />
            </CardContent>
          </Card>

          {/* Event Description */}
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">About This Event</h2>
            <div className="whitespace-pre-wrap">{event.description}</div>
          </div>
        </div>

        {/* Right Column - Ticket Information */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ticket Price</h3>
                  <p className="text-2xl font-bold">
                    {event.price === 0
                      ? "Free"
                      : `IDR ${event.price.toLocaleString()}`}
                  </p>
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {event.attendedEvent >= event.totalTicket ? (
                      <>
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="text-red-500">Sold Out</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-500">
                          Tickets Available
                        </span>
                      </>
                    )}
                  </h3>

                  <div className="flex justify-between text-sm font-medium">
                    <span>{event.attendedEvent} Sold</span>
                    <span>{event.totalTicket} Total</span>
                  </div>

                  {/* Progress Bar */}
                  <Progress
                    value={(event.attendedEvent / event.totalTicket) * 100}
                    className="h-2"
                  />

                  {/* Remaining Tickets Info */}
                  <p className="text-sm text-gray-600">
                    {event.attendedEvent >= event.totalTicket ? (
                      ""
                    ) : (
                      <>
                        <span className="font-semibold">
                          {event.totalTicket - event.attendedEvent}
                        </span>{" "}
                        tickets remaining
                      </>
                    )}
                  </p>
                  {event.attendedEvent >= event.totalTicket ? (
                    ""
                  ) : (
                    <Button className="w-full">
                      <Link href={`/event/${params.slug}/transactions`}>
                        Get Ticket
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <div />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
