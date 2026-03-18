"use client";

import Container from "@/components/Container";
import GradientSwitch from "@/components/GradientSwitch";

export default function Configuracoes() {
  return (
    <Container>
      <div className="flex flex-col flex-1 px-18 gap-3 overflow-hidden">
        {/* Início */}
        <div className="flex relative flex-col w-1/3 gap-1 h-20 rounded-md text-[#4c4c4c] shrink-0">
          <span className="font-medium text-sm">Minhas</span>
          <span className="font-bold text-xl">Configurações</span>
        </div>

        <div className="flex w-2/5 flex-col gap-10">
          <div className="flex w-full items-center justify-between">
            <span className="font-medium text-[#4c4c4c]">Efeitos Sonoros</span>
            <GradientSwitch />
          </div>

          <div className="flex w-full items-center justify-between">
            <span className="font-medium text-[#4c4c4c]">
              Apenas o essencial em estatísticas
            </span>
            <GradientSwitch />
          </div>

          <div className="flex w-full items-center justify-between">
            <span className="font-medium text-[#4c4c4c]">
              Sistema “Super Parent”
            </span>
            <GradientSwitch />
          </div>
        </div>
      </div>
    </Container>
  );
}
