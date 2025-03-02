"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const session = useSession();

  if (!session) {
    redirect("/event/explore");
  }
  if (session) {
    redirect("/event/explore");
  }
  return <div></div>;
}
