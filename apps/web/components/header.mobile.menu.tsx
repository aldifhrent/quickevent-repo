/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Compass } from "lucide-react";
import Profile from "../components/profile";

interface menuMobileProps {
  session: any;
}
export default function HeaderMobileMenu({ session }: menuMobileProps) {
  return (
    <nav className="mt-1 flex w-full flex-col gap-4">
      <Link
        href="/event/explore"
        className="flex items-center gap-2 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-black"
      >
        <Compass size={20} className="text-black hover:animate-spin" />
        <p className="xl:text-md inline-block text-sm font-semibold text-black dark:hover:text-white">
          Explore Events
        </p>
      </Link>
      {session ? (
        <Profile
          profileId={session?.user.id || ""}
          name={session?.user.name || ""}
          imageUrl={
            session?.user.imageUrl ||
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
          }
        />
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
