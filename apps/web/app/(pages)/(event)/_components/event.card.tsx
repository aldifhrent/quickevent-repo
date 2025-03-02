import { AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { Avatar } from "../../../../components/ui/avatar";
import { price } from "@/lib/currency";
import { format } from "date-fns";
import Link from "next/link";
import { Card } from "../../../../components/ui/card";
import { Events } from "@/types/types";

export default function EventCard(props: Events) {
  return (
    <Card className="w-[300px] overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/event/${props.slug}`} className="flex h-full flex-col">
        <div className="relative">
          <Image
            src={props.imageUrl}
            width={400}
            height={330}
            className="aspect-video w-full object-fill"
            alt={props.title}
          />
          <span
            className={`absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-medium ${
              props.attendedEvent >= props.totalTicket
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {props.attendedEvent >= props.totalTicket
              ? "Sold Out"
              : "Available"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h1 className="line-clamp-2 text-lg font-bold">{props.title}</h1>

          <p className="mt-2 text-sm text-slate-600">
            {format(props.eventStartDate, "dd MMMM yyyy")} -{" "}
            {format(props.eventEndDate, "dd MMMM yyyy")}
          </p>

          <p className="mt-2 text-xl font-bold">
            {props.price === 0 ? "FREE" : price(props.price)}
          </p>

          <div className="mt-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage width={100} src={props.organizer.logoUrl || ""} />
              </Avatar>
              <p className="text-sm text-slate-600">
                {props.organizer.organizerName}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
