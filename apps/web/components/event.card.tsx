import { AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { Avatar } from "./ui/avatar";
import { price } from "@/lib/currency";
export default function EventCard() {
  return (
    <div className="h-full w-[330px] rounded-lg border shadow-lg hover:shadow-2xl">
      <div className="flex flex-col rounded-lg bg-white">
        <Image
          src="https://assets.loket.com/neo/production/images/banner/20250106145852_677b8d3c5232e.jpg"
          width={400}
          height={330}
          className="w-full rounded-lg rounded-bl-none rounded-br-none"
          alt="Event Card"
        />
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-lg font-bold dark:text-black">
            Lunar New Year - Mulan Stage Show
          </h1>
          <p className="text-black">19 January 2025</p>
          <p className="font-bold dark:text-black">{price(5000000)}</p>
        </div>
        <div className="mt-2">
          <hr />
          <div className="mb-2 mt-2">
            <div className="h-f flex w-full items-center justify-start gap-2 p-2">
              <Avatar>
                <AvatarImage
                  src="https://images.unsplash.com/photo-1737111869094-80ed40daca91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8"
                  className="w-full"
                />
              </Avatar>
              <p className="dark:text-black">Quick Organizer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
