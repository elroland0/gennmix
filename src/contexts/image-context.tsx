"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ImageContextType = {
  images: {
    id: string;
    ai: "dall-e" | "recraft";
    model: string;
    prompt: string;
    size: string;
    url: string;
    expiresAt: number;
  }[];
  addImage: (
    ai: "dall-e" | "recraft",
    model: string,
    prompt: string,
    size: string,
    url: string,
    expiresAt: number
  ) => { id: string };
  clearImages: () => void;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<
    {
      id: string;
      ai: "dall-e" | "recraft";
      model: string;
      prompt: string;
      size: string;
      url: string;
      expiresAt: number;
    }[]
  >([]);

  useEffect(() => {
    const storedImages = localStorage.getItem("images");
    if (storedImages) {
      const parsedImages = JSON.parse(storedImages) as {
        id: string;
        ai: "dall-e" | "recraft";
        model: string;
        prompt: string;
        size: string;
        url: string;
        expiresAt: number;
      }[];
      const filteredImages = parsedImages.filter(
        (image) => image.expiresAt > Date.now()
      );

      setImages(filteredImages);
      localStorage.setItem("images", JSON.stringify(filteredImages));
    } else {
      setImages([]);
    }
  }, []);

  const addImage = (
    ai: "dall-e" | "recraft",
    model: string,
    prompt: string,
    size: string,
    url: string,
    expiresAt: number
  ) => {
    const id = crypto.randomUUID();
    const newImages = [
      { id, ai, model, prompt, size, url, expiresAt },
      ...images,
    ];
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
