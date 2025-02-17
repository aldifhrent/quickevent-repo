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
    <Card className="w-[300px] h-full flex flex-col gap-10 rounded-lg shadow-lg">
      <Link
        href={`/event/${props.slug}`}
        className="h-full w-full flex flex-col hover:shadow-xl"
      >
        <div className="flex flex-col rounded-lg gap-4 h-full">
          <Image
            src="https://assets.loket.com/neo/production/images/banner/20250106145852_677b8d3c5232e.jpg"
            width={400}
            height={330}
            className="w-full rounded-lg rounded-bl-none rounded-br-none"
            alt="Event Card"
          />
          <div className="flex flex-col gap-4 p-4">
            <h1 className="text-lg font-bold dark:text-black text-nowrap">
              {props.title}
            </h1>
            <p className="text-slate-600">
              {format(props.eventStartDate, "dd MMMM yyyy")} -{" "}
              {format(props.eventEndDate, "dd MMMM yyyy")}
            </p>
            <p className="font-bold dark:text-black text-xl">
              {price(props.price)}
            </p>
          </div>
          <div className="mt-auto">
            {" "}
            {/* Pastikan bagian ini ada di bawah */}
            <hr />
            <div className="mb-2 mt-2">
              <div className="flex w-full items-center justify-start gap-2 p-2">
                <Avatar>
                  <AvatarImage
                    src={
                      props.organizer?.logoUrl ||
                      "https://images.unsplash.com/photo-1737111869094-80ed40daca91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8"
                    }
                    className="w-full"
                  />
                </Avatar>
                <p className="dark:text-black">
                  {props.organizer?.organizerName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
