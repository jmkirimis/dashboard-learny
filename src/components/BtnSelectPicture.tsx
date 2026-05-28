"use client";

import { useEffect, useRef } from "react";

interface Props {
  type: "add" | "edit";
  variant?: "dark" | "light";
  image: string | null;
  onChange: (file: File | null, previewUrl?: string | null) => void;
}

export default function BtnSelectPicture({
  type = "add",
  variant,
  image,
  onChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    onChange(file, previewUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      {type === "edit" ? (
        <button
          onClick={handleClick}
          className="w-40 h-40 flex items-end justify-end pr-2 pb-2 bg-cover bg-center bg-no-repeat rounded-lg hover:cursor-pointer"
          style={{
            backgroundImage: `url(${image || "/images/avatar-big.png"})`,
          }}
        >
          <div className="w-8 h-8 bg-[url('/icons/edit.png')] bg-contain bg-no-repeat rounded-full" />
        </button>
      ) : (
        <button onClick={handleClick} className="hover:cursor-pointer">
          <div
            className="w-32 h-32 mb-4 rounded-lg bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${
                image
                  ? image
                  : variant === "dark"
                    ? "/images/camera-dark.png"
                    : "/images/camera.png"
              })`,
            }}
          />
        </button>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
