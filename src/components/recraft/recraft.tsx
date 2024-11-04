import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecraftGenerate } from "./recraft-generate";

export function Recraft() {
  return (
    <Tabs defaultValue="generate">
      <TabsList className="bg-blue-100">
        <TabsTrigger value="generate">Generate</TabsTrigger>
      </TabsList>
      <TabsContent value="generate">
        <RecraftGenerate />
      </TabsContent>
    </Tabs>
  );
}
