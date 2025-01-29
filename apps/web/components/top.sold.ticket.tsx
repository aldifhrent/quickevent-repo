import { Card } from "./ui/card";

export default function TopSoldTicket() {
  return (
    <Card className="container p-4 mt-20">
      <div className="flex flex-col items-start">
        <h1 className="text-5xl font-bold">Trending</h1>
        {/* Table Data of Ticket with Price, sold / supply ticket */}
      </div>
    </Card>
  );
}
