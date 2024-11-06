import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecraftGenerate } from "./recraft-generate";

export function Recraft() {
  return (
    <Tabs defaultValue="generate">
      <TabsList>
        <TabsTrigger value="generate">Generate</TabsTrigger>
      </TabsList>
      <TabsContent value="generate">
        <RecraftGenerate />
      </TabsContent>
    </Tabs>
  );
}
