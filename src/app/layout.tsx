import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ImageProvider } from "@/contexts/image-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CSPostHogProvider } from "./providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gennmix",
  description: "Generate images using various AI services with your API keys",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "overflow-hidden")}>
        <CSPostHogProvider>
          <TooltipProvider>
            <ImageProvider>{children}</ImageProvider>
          </TooltipProvider>
          <Toaster />
        </CSPostHogProvider>
      </body>
    </html>
  );
}
