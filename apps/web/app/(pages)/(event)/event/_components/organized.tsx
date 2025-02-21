import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Events } from "@/types/types";

export default function OrganizedProfile({ event }: { event: Events }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={
              event.organizer.logoUrl ||
              "https://images.unsplash.com/photo-1737111869094-80ed40daca91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8"
            }
          />
        </Avatar>

        <div className="flex flex-col">
          <span className="text-sm">Organized by</span>
          <p className="text-md font-semibold">
            {event.organizer.organizerName}
          </p>
        </div>
      </div>
    </div>
  );
}
