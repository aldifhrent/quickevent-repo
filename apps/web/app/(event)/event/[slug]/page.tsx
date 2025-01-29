import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "lucide-react";
import Image from "next/image";
import RightSideMenu from "../components/rightside.menu";
import TabMenu from "../components/tab.menu";

export default function ExploreDetails() {
  return (
    <div className="container mt-20">
      <div className="flex justify-between">
        <div className="flex w-8/12 flex-col">
          <div className="mt-4">
            <Image
              src="https://assets.loket.com/neo/production/images/banner/20250106145852_677b8d3c5232e.jpg"
              alt="Event"
              width={1200}
              height={900}
              className=""
            />
          </div>
          <div className="mt-8 flex justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1737111869094-80ed40daca91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8" />
              </Avatar>

              <div className="flex flex-col">
                <span className="text-sm">Organised by</span>
                <p className="text-md font-semibold">Chad Davies</p>
              </div>
            </div>
            <Badge>
              <Ticket /> Only 12 tickets left
            </Badge>
          </div>
          <hr className="mt-4" />
          <TabMenu />
        </div>
        <RightSideMenu />
      </div>
    </div>
  );
}
