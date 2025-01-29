import { Card } from "@/components/ui/card";
import { Calendar, Clock8, MapPin } from "lucide-react";

export default function RightSideMenu() {
  return (
    <Card className="container h-[400px] w-3/12">
      <div className="flex flex-col items-start p-8">
        <h1 className="text-nowrap text-2xl font-bold">
          WHISKY LIVE JAKARTA 2025
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          <p className="flex items-center gap-1 text-black">
            <Calendar size={20} /> 01 Feb - 02 Feb 2025
          </p>
          <p className="flex items-center gap-1 text-black">
            <Clock8 /> 11:00 - 21:00 WIB
          </p>
          <p className="flex items-center gap-1 text-black">
            <MapPin /> 19 January 2025
          </p>
        </div>
      </div>
    </Card>
  );
}
