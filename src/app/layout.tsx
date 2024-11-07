import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ImageProvider } from "@/contexts/image-context";
import { ImageList } from "@/components/common/image-list";
import { Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/common/header";
import { CSPostHogProvider } from "./providers";

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
      <body className={inter.className}>
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
