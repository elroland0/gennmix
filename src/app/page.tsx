import { ProviderTabs } from "@/components/common/provider-tabs";
import pictures from "../../public/pictures.svg";
import pictures2 from "../../public/pictures2.svg";
import Image from "next/image";
import { Header } from "@/components/common/header";
import ShineBorder from "@/components/ui/shine-border";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="h-full flex items-center justify-center px-4 mb-16">
        <div className="flex-1 flex justify-center">
          <Image
            src={pictures}
            alt="pictures"
            className="hidden xl:block max-w-xs translate-y-20"
          />
        </div>
        <div className="flex-initial flex flex-col items-center">
          <h1 className="max-w-2xl text-3xl md:text-7xl text-center font-semibold md:leading-[0.75] mb-4">
            Web UI Client for{" "}
            <span className="text-3xl">Generative AI Models</span>
          </h1>
          <p className="text-neutral-500 mb-8">
            Generate images using various AI services with your API keys
          </p>
          <ShineBorder className="p-0 min-h-0" duration={20}>
            <ProviderTabs provider="" />
          </ShineBorder>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src={pictures2}
            alt="pictures"
            className="hidden xl:block max-w-xs -translate-y-20"
          />
        </div>
      </div>
    </div>
  );
}
