import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecraftGenerate } from "./recraft-generate";
import { RecraftVectorize } from "./recraft-vectorize";
import { RecraftRemoveBackground } from "./recraft-remove-background";

export function Recraft() {
  return (
    <Tabs defaultValue="generate">
      <TabsList>
        <TabsTrigger value="generate">Generate</TabsTrigger>
        <TabsTrigger value="vectorize">Vectorize</TabsTrigger>
        <TabsTrigger value="remove-background">Remove Background</TabsTrigger>
      </TabsList>
      <TabsContent value="generate">
        <RecraftGenerate />
      </TabsContent>
      <TabsContent value="vectorize">
        <RecraftVectorize />
      </TabsContent>
      <TabsContent value="remove-background">
        <RecraftRemoveBackground />
      </TabsContent>
    </Tabs>
  );
}
