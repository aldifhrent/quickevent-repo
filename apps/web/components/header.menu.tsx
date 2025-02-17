/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Compass } from "lucide-react";
import Profile from "./profile";

interface HeaderMenuProps {
  session: any;
}

export default function HeaderMenu({ session }: HeaderMenuProps) {
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      <Link
        href="/event/explore"
        className="flex items-center gap-2 rounded-full p-2 hover:bg-slate-100 dark:text-black dark:hover:text-black"
      >
        <Compass
          size={20}
          className="text-black hover:animate-spin hover:text-black dark:text-white"
        />
        <p className="xl:text-md inline-block text-sm font-semibold text-black dark:text-white text-nowrap">
          Explore Events
        </p>
      </Link>

      {session ? (
        <div className="flex items-center gap-2">
          <Profile
            profileId={session?.user?.id || ""}
            name={session?.user?.name || "User"}
            imageUrl={
              session?.user?.imageUrl ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
            }
          />
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <Link
            href="/sign-in"
            className="xl:text-md cursor-pointer text-sm hover:underline"
          >
            Sign In
          </Link>
          /
          <Link
            href="/sign-up"
            className="xl:text-md cursor-pointer text-sm hover:underline"
          >
            Sign Up
          </Link>
        </div>
      )}
      {/* <ThemeButton className="hidden xl:flex" /> */}
    </nav>
  );
}
