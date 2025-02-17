"use client";

import { useParams } from "next/navigation";

export default function OrganizerDashboard() {
  const params = useParams();

  return <div>{params.id}</div>;
}
