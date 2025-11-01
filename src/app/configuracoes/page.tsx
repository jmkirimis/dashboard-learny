"use client";

import GradientSwitch from "@/components/GradientSwitch";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Configuracoes() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />

      {/* Logo */}
      <Image
        src="/images/logo-com-contorno.png"
        alt="Criança"
        width={60}
        height={60}
        className="absolute right-14 top-6"
      />

      <main className="flex-1 flex flex-col bg-white py-12 text-zinc-800 font-montserrat">
        <div className="flex flex-col flex-1 px-18 gap-3 overflow-hidden">
          {/* Início */}
          <div className="flex relative flex-col w-1/3 gap-1 h-20 rounded-md text-[#4c4c4c] shrink-0">
              <span className="font-medium text-sm">Minhas</span>
              <span className="font-bold text-xl">
                Configurações
              </span>
          </div>

          <div className="flex w-2/5 flex-col gap-10">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium text-[#4c4c4c]">Efeitos Sonoros</span>
              <GradientSwitch />
            </div>

            <div className="flex w-full items-center justify-between">
              <span className="font-medium text-[#4c4c4c]">Apenas o essencial em estatísticas</span>
              <GradientSwitch />
            </div>
            
            <div className="flex w-full items-center justify-between">
              <span className="font-medium text-[#4c4c4c]">Sistema “Super Parent”</span>
              <GradientSwitch />
            </div>
          </div>

          
          
        </div>
      </main>
    </div>
  );
}
