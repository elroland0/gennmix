import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ImageProvider } from "@/contexts/image-context";
import { ImageList } from "@/components/blocks/image-list";
import { FeedbackPopover } from "@/components/blocks/feedback-popover";
import { Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Image Generator",
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
            <main className="flex flex-col h-screen">
              <div className="flex-1 flex justify-center overflow-y-auto">
                {children}
              </div>
              <Suspense fallback={null}>
                <ImageList />
              </Suspense>
            </main>
          </ImageProvider>
        </TooltipProvider>
        <div className="fixed top-4 right-4">
          <FeedbackPopover />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
