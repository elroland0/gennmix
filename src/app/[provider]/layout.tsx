import { ProviderTabs } from "@/components/common/provider-tabs";
import { Header } from "@/components/common/header";
import { ImageList } from "@/components/common/image-list";
import { Suspense } from "react";

export default function AiLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { provider: string };
}) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <div className="w-full max-w-lg mx-auto flex flex-col gap-4 px-4">
          <ProviderTabs provider={params.provider} />
          {children}
        </div>
      </div>
      <Suspense fallback={null}>
        <ImageList />
      </Suspense>
    </div>
  );
}
