import { AiTabs } from "@/components/blocks/ai-tabs";

export default function AiLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ai: string };
}) {
  return (
    <div className="w-full max-w-lg flex flex-col gap-4 px-4 py-12">
      <AiTabs ai={params.ai} />
      {children}
    </div>
  );
}
