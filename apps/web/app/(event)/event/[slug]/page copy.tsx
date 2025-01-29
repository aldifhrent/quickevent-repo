import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Ticket } from "lucide-react";
import Image from "next/image";

export default function ExploreDetails() {
  return (
    <div className="container mt-20">
      <div className="flex flex-col">
        <div className="">
          <h1 className="mb-4 text-2xl font-bold">
            Sip&Ink BYO Tattooing Experience For Fun
          </h1>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center space-x-2">
              <span className="text-teal-500">
                <MapPin />
              </span>
              <p className="text-gray-700">
                35 Swan St, 35 Swan St, Beerwah, 4519, Australia
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Image
            src="https://assets.loket.com/neo/production/images/banner/20250106145852_677b8d3c5232e.jpg"
            alt="Event"
            width={900}
            height={900}
            className=""
          />
        </div>

        <div className="flex items-center gap-4">
          <div>
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1737111869094-80ed40daca91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8" />
            </Avatar>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Organised by</span>
            <p className="text-md font-semibold">Chad Davies</p>
          </div>
        </div>
        {/* Tambahkan ml-auto di sini */}
        <div className="ml-auto">
          <Badge className="h-12 w-fit gap-1">
            <Ticket /> Only 12 tickets left
          </Badge>
        </div>
        <Tabs defaultValue="day" className="mt-8 w-[400px]">
          <TabsList className="flex justify-center gap-4 rounded-lg bg-gray-100 p-2">
            <TabsTrigger value="description" className="text-md font-medium">
              Description
            </TabsTrigger>
            <TabsTrigger value="ticket" className="text-md font-medium">
              Ticket
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <div className="mt-4 space-y-4"></div>
          </TabsContent>
        </Tabs>
      </div>
      <hr />
    </div>
  );
}
