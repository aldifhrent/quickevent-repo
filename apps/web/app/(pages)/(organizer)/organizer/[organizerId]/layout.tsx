import Header from "@/components/header";
import Aside from "../_components/aside";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex">
        <Aside />
        {children}
      </div>
    </div>
  );
}
