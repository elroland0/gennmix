import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ImageProvider } from "@/contexts/image-context";
import { ImageList } from "@/components/blocks/image-list";
import { FeedbackPopover } from "@/components/blocks/feedback-popover";
import { Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/common/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gennmix",
  description: "Generate images using various AI services with your API keys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          <ImageProvider>
            <div className="flex flex-col h-screen">
              <div className="flex-1 overflow-y-auto flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center px-4">
                  {children}
                </main>
              </div>
              <Suspense fallback={null}>
                <ImageList />
              </Suspense>
            </div>
          </ImageProvider>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
