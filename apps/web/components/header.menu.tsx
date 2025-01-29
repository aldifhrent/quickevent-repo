import Link from "next/link";
import { Compass } from "lucide-react";
import Profile from "./profile";

export default function HeaderMenu() {
  const isSignedIn = false;
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
        <p className="xl:text-md inline-block text-sm font-semibold text-black dark:text-white">
          Explore
        </p>
      </Link>

      <Link
        href="/create-event"
        className="flex max-w-[200px] flex-nowrap items-center gap-2 rounded-md bg-black p-3 text-white hover:cursor-pointer dark:bg-white dark:text-black"
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
      {/* <ThemeButton /> */}
    </nav>
  );
}
