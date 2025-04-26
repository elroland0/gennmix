import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ImageProvider } from "@/contexts/image-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CSPostHogProvider } from "./providers";
import { cn } from "@/lib/utils";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RED Ad Media Image-Frontend",
  description:
    "Image-Frontend für Kunden & Mitarbeiter von RED Ad Media – Upload, Verwaltung und Teilen Ihrer Bildwelten im Corporate Design",
  icons: {
    icon: "/favicon-red.svg", // euer RED-Favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={cn(inter.className, "overflow-hidden bg-white")}>
        <CSPostHogProvider>
          <TooltipProvider>
            <ImageProvider>{children}</ImageProvider>
          </TooltipProvider>
          <Toaster />
          <SonnerToaster expand />
        </CSPostHogProvider>
      </body>
    </html>
  );
}
