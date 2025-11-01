"use client";

import { useRef } from "react";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { useCustomAlert } from "@/contexts/AlertContext";

type Props = {
  type?: "add" | "edit";
  image?: string | null;
  onChange?: (newImage: string | null) => void;
};

const LoadingComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src="/gifs/loading.gif"
        alt="Loading"
        width={200}
        height={200}
        unoptimized // muito importante para GIFs animados
      />
    </div>
  );
};

export default function BtnSelecionaFoto({
  type = "add",
  image,
  onChange,
}: Props) {
  const { loading, request } = useApi();
  const { showAlert } = useCustomAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const result = await request({
      endpoint: "/api/upload",
      method: "POST",
      body: formData,
      hasHeaders: true,
    });

    if (result && !result.error) {
      if (onChange) onChange(result.url);
    } else {
      showAlert({
        icon: "/icons/erro.png",
        title: "Erro ao enviar imagem!",
        message:
          result.message ||
          "Ocorreu um erro ao enviar a imagem para o servidor",
      });
    }
  };

  return (
    <div className="relative">
      {loading ? (
        <LoadingComponent />
      ) : type === "edit" ? (
        <button
          onClick={handleClick}
          className="w-40 h-40 flex items-end justify-end pr-2 pb-2 bg-cover bg-center bg-no-repeat rounded-lg hover:cursor-pointer"
          style={{
            backgroundImage: `url(${image || "/images/pai.png"})`,
          }}
        >
          <div className="w-8 h-8 bg-[url('/icons/editar.png')] bg-contain bg-no-repeat rounded-full" />
        </button>
      ) : (
        <button onClick={handleClick} className="hover:cursor-pointer">
          <div
            className="w-28 h-28 mb-4 rounded-lg bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${image || "/images/camera.png"})` }}
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
