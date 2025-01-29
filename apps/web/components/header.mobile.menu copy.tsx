import Link from "next/link";
import { Compass } from "lucide-react";
import Profile from "./profile";

export default function HeaderMobileMenu() {
  const isSignedIn = true;
  return (
    <nav className="mt-1 flex w-full flex-col gap-4">
      <Link
        href="/explore"
        className="flex items-center gap-2 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-black"
      >
        <Compass size={20} className="text-black hover:animate-spin" />
        <p className="xl:text-md inline-block text-sm font-semibold text-black dark:hover:text-white">
          Explore
        </p>
      </Link>
      <Link
        href="/create-event"
        className="flex flex-nowrap items-center gap-2 rounded-md bg-black p-3 text-white hover:cursor-pointer"
      >
        <p className="xl:text-md inline-block text-nowrap text-sm font-semibold">
          Create Event
        </p>
      </Link>
      {isSignedIn ? (
        <Profile />
      ) : (
        <Link
          href="/sign-in"
          className="xl:text-md cursor-pointer text-sm hover:underline"
        >
          Sign In
        </Link>
      )}
    </nav>
  );
}
