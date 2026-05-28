"use client";

import { useUser } from "@/contexts/UserContext";

export default function BoasVindas() {
  const { user } = useUser();


  return (
      <div className="flex flex-col flex-1 gap-2 px-14 overflow-hidden">
        {/* Início */}
        <div className="flex relative flex-col w-1/3 mb-4 gap-1 h-20 rounded-md shrink-0 bg-linear-to-b from-[#ab4c59] to-[#70819c] bg-clip-text text-transparent">
          <span className="font-bold text-3xl">Boas Vindas,</span>
          <span className="text-xl font-medium">{user?.name}</span>
          <hr className="w-full h-4 text-[#eaeaea]" />
        </div>

        {/* Linha inicial de itens do dashboard */}
        <div className="w-full h-60 bg-[url('/images/home/principal.webp')] bg-cover bg-no-repeat rounded-md shrink-0 mb-6" />

        <div className="flex flex-col gap-4">
          <h1 className="text-[#4c4c4c] font-bold text-xl">Mês dos autistas</h1>
          <div className="custom-scrollbar w-full overflow-x-auto">
            <div className="flex flex-row gap-6 min-w-max px-1 pt-1 pb-4">
              <div className="h-60 w-[845px] shrink-0 rounded-md bg-[url('/images/home/banner2.webp')] bg-cover bg-center" />
              <div className="h-60 w-[271px] shrink-0 rounded-md bg-[url('/images/home/banner3.webp')] bg-cover bg-center" />
              <div className="h-60 w-[271px] shrink-0 rounded-md bg-[url('/images/home/banner4.webp')] bg-cover bg-center" />
            </div>
          </div>
        </div>
      </div>
  );
}
