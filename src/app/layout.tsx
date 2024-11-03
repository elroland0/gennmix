import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DalleForm } from "@/components/blocks/dalle-form";
import { ImageProvider } from "@/contexts/image-context";
import { ImageList } from "@/components/blocks/image-list";
import { FeedbackPopover } from "@/components/blocks/feedback-popover";
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
        <ImageProvider>
          <main className="flex flex-col h-screen">
            <div className="flex-1 py-10 overflow-y-auto flex flex-col md:justify-center">
              <Tabs
                defaultValue="dall-e"
                className="w-full max-w-lg mx-auto px-4"
              >
                <TabsList>
                  <TabsTrigger value="dall-e">DALL-E</TabsTrigger>
                </TabsList>
                <TabsContent value="dall-e">
                  <DalleForm />
                </TabsContent>
              </Tabs>
              {children}
            </div>
            <ImageList />
          </main>
        </ImageProvider>
        <div className="fixed top-4 right-4">
          <FeedbackPopover />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
