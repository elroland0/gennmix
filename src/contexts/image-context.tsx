"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Ai = "openai" | "recraft" | "ideogram";
type ImageGenerateInput = {
  type?: "generate";
  ai: Ai;
  model: string;
  prompt: string;
  size: string;
  url: string;
  expiresAt: number;
};
type ImageVectorizeInput = {
  type: "vectorize";
  ai: Ai;
  url: string;
  expiresAt: number;
};
export type Image = { id: string } & (ImageGenerateInput | ImageVectorizeInput);

type ImageContextType = {
  images: Image[];
  addImage: (data: ImageGenerateInput | ImageVectorizeInput) => { id: string };
  clearImages: () => void;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const storedImages = localStorage.getItem("images");
    if (storedImages) {
      const parsedImages = JSON.parse(storedImages) as Image[];
      const filteredImages = parsedImages.filter(
        (image) => image.expiresAt > Date.now()
      );
      setImages(filteredImages);
      localStorage.setItem("images", JSON.stringify(filteredImages));
    } else {
      setImages([]);
    }
  }, []);

  const addImage = (data: ImageGenerateInput | ImageVectorizeInput) => {
    const id = crypto.randomUUID();
    const newImage = { ...data, id } as Image;
    const newImages = [newImage, ...images];
    localStorage.setItem("images", JSON.stringify(newImages));
    setImages(newImages);
    return { id };
  };

  const clearImages = () => {
    setImages([]);
    localStorage.removeItem("images");
  };

  return (
    <ImageContext.Provider value={{ images, addImage, clearImages }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImages() {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error("useImages must be used within an ImageProvider");
  }
  return context;
}
