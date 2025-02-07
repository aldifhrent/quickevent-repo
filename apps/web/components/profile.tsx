"use client";

import { signOut } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { useOrganizer } from "@/hooks/organizer";

interface ProfileProps {
  name: string;
  imageUrl: string;
  profileId: string;
}

export default function Profile({ name, imageUrl, profileId }: ProfileProps) {
  const { organizer } = useOrganizer();

  return (
    <div className="flex flex-col">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-2 rounded-full p-2 text-center hover:bg-slate-100">
          <Avatar>
            <AvatarImage src={imageUrl || ""} />
          </Avatar>
          <p className="text-nowrap">{name}</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4 mt-2 flex w-[200px] flex-col rounded-lg dark:bg-white">
          <DropdownMenuSub>
            <DropdownMenuItem>
              <Link href={`/profile/${profileId}`}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSubTrigger>Organizer</DropdownMenuSubTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="mr-2">
                {organizer.length > 0 ? (
                  organizer.map(
                    (
                      org: {
                        organizerId: string;
                        organizerName: string;
                        id: string;
                      },
                      index: number
                    ) => (
                      <DropdownMenuItem key={org.id || index}>
                        {org.organizerName}
                      </DropdownMenuItem>
                    )
                  )
                ) : (
                  <DropdownMenuItem>
                    <Link href="/organizer/create">Create Organizer</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>History</DropdownMenuSubTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="mr-2">
                <DropdownMenuItem>
                  <Link href="/organizer/create">Transactions</Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem
            onClick={() =>
              signOut({
                redirectTo: "/",
              })
            }
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
