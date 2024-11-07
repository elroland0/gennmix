import { AiTabs } from "@/components/common/ai-tabs";

export default function Home() {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold mb-4">Select an AI service</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Generate images using various AI services with your API keys
      </p>
      <AiTabs ai="" />
    </div>
  );
}
