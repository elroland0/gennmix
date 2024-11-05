import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdeogramGenerate } from "./ideogram-generate";

export function Ideogram() {
  return (
    <Tabs defaultValue="generate">
      <TabsList>
        <TabsTrigger value="generate">Generate</TabsTrigger>
      </TabsList>
      <TabsContent value="generate">
        <IdeogramGenerate />
      </TabsContent>
    </Tabs>
  );
}
