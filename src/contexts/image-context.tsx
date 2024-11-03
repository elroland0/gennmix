"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ImageContextType = {
  images: { url: string; expiresAt: number }[];
  addImage: (url: string, expiresAt: number) => void;
  clearImages: () => void;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<{ url: string; expiresAt: number }[]>(
    []
  );

  useEffect(() => {
    const storedImages = localStorage.getItem("images");
    if (storedImages) {
      const parsedImages = JSON.parse(storedImages);
      const filteredImages = parsedImages.filter(
        (image: { expiresAt: number }) => image.expiresAt > Date.now()
      );
      setImages(filteredImages);
      localStorage.setItem("images", JSON.stringify(filteredImages));
    } else {
      setImages([]);
    }
  }, []);

  const addImage = (url: string, expiresAt: number) => {
    const newImages = [{ url, expiresAt }, ...images];
    setImages(newImages);
    localStorage.setItem("images", JSON.stringify(newImages));
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
