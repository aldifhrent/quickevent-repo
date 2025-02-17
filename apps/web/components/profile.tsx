"use client";

import { signOut } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { useOrganizer } from "@/hooks/organizer";
import { Organizer } from "@/types/types";

interface ProfileProps {
  name: string;
  imageUrl: string;
  profileId: string;
}

export default function Profile({ name, imageUrl, profileId }: ProfileProps) {
  const { organizer } = useOrganizer();
  console.log(organizer);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-1 rounded-full p-1 text-center hover:bg-slate-100">
        <Avatar>
          <AvatarImage src={imageUrl || ""} />
        </Avatar>
        <p className="truncate">{name}</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px] flex flex-col ml-12 mt-2">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/profile/${profileId}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Organizer</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            {organizer.length > 0 ? (
              <DropdownMenuSubContent>
                {organizer.map((org: Organizer) => (
                  <DropdownMenuItem key={org.id}>
                    <Link
                      target="_blank"
                      href={`/organizer/${org.slug}/dashboard`}
                      className="w-full"
                    >
                      {org.organizerName}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            ) : (
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Link href="/organizer/create" className="w-full">
                    Create New Organizer
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            )}
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
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
  );
}
