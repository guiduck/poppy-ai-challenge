"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

export default function ImageInput({
  onImage,
  hasImage,
}: Readonly<{
  onImage: (b64: string) => void;
  hasImage: boolean;
}>) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        onImage(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <Button
        type="button"
        variant={hasImage ? "default" : "outline"}
        onClick={() => inputRef.current?.click()}
        className={`text-xs px-2 py-1 break-words text-center  ${
          hasImage ? "bg-green-600 text-white hover:text-green-600" : ""
        }`}
      >
        {hasImage ? "Image ready!" : "Upload file"}
      </Button>
    </>
  );
}
