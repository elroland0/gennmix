import { AiTabs } from "@/components/blocks/ai-tabs";

export default function Home() {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold mb-8">Select an AI service</h1>
      <AiTabs ai="" />
    </div>
  );
}
