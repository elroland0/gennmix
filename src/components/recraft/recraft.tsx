import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecraftGenerate } from "./recraft-generate";
import { RecraftVectorize } from "./recraft-vectorize";

export function Recraft() {
  return (
    <Tabs defaultValue="generate">
      <TabsList>
        <TabsTrigger value="generate">Generate</TabsTrigger>
        <TabsTrigger value="vectorize">Vectorize</TabsTrigger>
      </TabsList>
      <TabsContent value="generate">
        <RecraftGenerate />
      </TabsContent>
      <TabsContent value="vectorize">
        <RecraftVectorize />
      </TabsContent>
    </Tabs>
  );
}
