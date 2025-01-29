"use client";

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

export default function Profile() {
  return (
    <div className="flex flex-col">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-2 rounded-full p-2 text-center hover:bg-slate-100">
          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1737111869094-80ed40daca91?w=500&auto=format&fit=crop&q=60" />
          </Avatar>
          <p>Username</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4 mt-2 flex w-[200px] flex-col rounded-lg">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Organizer</DropdownMenuSubTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="mr-2">
                <DropdownMenuItem>Create Organizer</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Delete Organizer</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Profile</DropdownMenuSubTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="mr-2">
                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Change Password</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
