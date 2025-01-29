import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const salesData = {
  day: [
    { rank: 1, ticket: "VIP Gold", sold: 120, volume: 100 },
    { rank: 2, ticket: "Regular", sold: 90, volume: 85 },
    { rank: 3, ticket: "VIP Silver", sold: 75, volume: 70 },
  ],
  week: [
    { rank: 1, ticket: "VIP Gold", sold: 820, volume: 780 },
    { rank: 2, ticket: "Regular", sold: 700, volume: 680 },
    { rank: 3, ticket: "VIP Silver", sold: 640, volume: 620 },
  ],
  month: [
    { rank: 1, ticket: "VIP Gold", sold: 3000, volume: 2900 },
    { rank: 2, ticket: "Regular", sold: 2600, volume: 2500 },
    { rank: 3, ticket: "VIP Silver", sold: 2100, volume: 2000 },
  ],
  year: [
    { rank: 1, ticket: "VIP Gold", sold: 36000, volume: 35000 },
    { rank: 2, ticket: "Regular", sold: 31000, volume: 30500 },
    { rank: 3, ticket: "VIP Silver", sold: 28000, volume: 27500 },
  ],
};

export default function SoldCardTab() {
  return (
    <Tabs defaultValue="day" className="w-[400px] mt-8">
      <TabsList className="flex justify-center gap-4 bg-gray-100 p-2 rounded-lg">
        <TabsTrigger value="day" className="text-md font-medium">
          Day
        </TabsTrigger>
        <TabsTrigger value="week" className="text-md font-medium">
          Week
        </TabsTrigger>
        <TabsTrigger value="month" className="text-md font-medium">
          Month
        </TabsTrigger>
        <TabsTrigger value="year" className="text-md font-medium">
          Year
        </TabsTrigger>
      </TabsList>
      {Object.entries(salesData).map(([key, data]) => (
        <TabsContent key={key} value={key}>
          <div className="space-y-4 mt-4">
            {data.map((item) => (
              <div
                key={item.rank}
                className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-green-600">
                    #{item.rank}
                  </span>
                  <div>
                    <p className="text-md font-medium">{item.ticket}</p>
                    <p className="text-sm text-gray-500">
                      Volume: {item.volume} purchases
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {item.sold} tickets sold
                </span>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
