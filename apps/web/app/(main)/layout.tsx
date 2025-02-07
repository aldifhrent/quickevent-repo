import Header from "@/components/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between overflow-y-hidden">
      <Header />
      {children}
    </div>
  );
}
