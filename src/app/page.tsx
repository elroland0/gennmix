import { ProviderTabs } from "@/components/common/provider-tabs";
import redLogoLeft from "../../public/red-logo-left.svg";
import redLogoRight from "../../public/red-logo-right.svg";
import Image from "next/image";
import { Header } from "@/components/common/header";
import ShineBorder from "@/components/ui/shine-border";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-white">
      <Header logoSrc="/red-ad-media-logo.svg" /> {/* Header nimmt jetzt euer Logo */}
      <div className="h-full flex items-center justify-center px-4 mb-16">
        {/* Linke Brand-Illu */}
        <div className="flex-1 flex justify-center">
          <Image
            src={redLogoLeft}
            alt="RED Ad Media Branding"
            className="hidden xl:block max-w-xs translate-y-20"
          />
        </div>
        {/* Zentrale Headline & Tabs */}
        <div className="flex-initial flex flex-col items-center">
          <h1 className="max-w-2xl text-3xl md:text-7xl text-center font-semibold md:leading-[0.75] mb-4">
            RED Ad Media Image-Frontend für<br/>
            <span className="text-3xl text-red-600">Kunden &amp; Mitarbeiter</span>
          </h1>
          <p className="text-neutral-500 mb-8">
            Upload, Verwaltung und Teilen eurer Bildwelten – sicher, schnell und in eurem Corporate Design.
          </p>
          <ShineBorder className="p-0 min-h-0 border-red-600" duration={20} borderRadius={4}>
            <ProviderTabs provider="" accentColor="red" />
          </ShineBorder>
        </div>
        {/* Rechte Brand-Illu */}
        <div className="flex-1 flex justify-center">
          <Image
            src={redLogoRight}
            alt="RED Ad Media Branding"
            className="hidden xl:block max-w-xs -translate-y-20"
          />
        </div>
      </div>
    </div>
  );
}
