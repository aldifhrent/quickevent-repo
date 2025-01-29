import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabMenu() {
  return (
    <Tabs defaultValue="description" className="mt-8 w-full">
      <TabsList className="ml-auto flex items-center gap-4 rounded-lg border">
        <TabsTrigger value="description" className="text-md font-medium">
          Description
        </TabsTrigger>
        <TabsTrigger value="week" className="text-md font-medium">
          Ticket
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description"></TabsContent>
    </Tabs>
  );
}
