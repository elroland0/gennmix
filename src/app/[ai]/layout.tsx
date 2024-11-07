import { AiTabs } from "@/components/common/ai-tabs";

export default function AiLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ai: string };
}) {
  return (
    <div className="w-full max-w-lg flex flex-col gap-4">
      <AiTabs ai={params.ai} />
      {children}
    </div>
  );
}
