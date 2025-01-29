import Header from "@/components/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div className="container mt-10">{children}</div>
    </div>
  );
}
