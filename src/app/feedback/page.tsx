"use client";

import Navbar from "@/components/Navbar";
import { useChild } from "@/contexts/ChildContext";
import Image from "next/image";
import { useEffect, useState } from "react";

type ScoreComponentProps = {
  color: string;
  label: string;
  value: string;
  icon: string;
}

const ScoreComponent = ({color, label, value, icon}: ScoreComponentProps) => {
  return(
    <div 
      className="flex relative flex-col items-center justify-center w-26 px-4 py-2 border-5 rounded-2xl"
      style={{borderColor: color}}
    >
      <span 
        className="font-medium text-center text-sm"
        style={{color: color}}
      >{label}</span>
      <span className="font-bold text-sm">{value}</span>
      <div className="bg-white rounded-full p-0.5 absolute -right-2.5 -top-2.5">
        <Image
          src={`/icons/${icon}`}
          alt="Relogio"
          width={21}
          height={29}
        />
      </div>
    </div>
  );
}

type BtnReacaoProps = {
  icon: string;
}
const BtnReacao = ({icon}: BtnReacaoProps) => {
  return (
    <div className={`
      flex flex-col items-center justify-center rounded-full p-3 gap-4 bg-white shadow-[0_0_6px_rgba(150,150,150,0.6)]
      hover:cursor-pointer
      `}
    >
        <Image
          src={`/icons/${icon}`}
          alt="Icon Reacão"
          width={32}
          height={32}
        />
      </div>
  );
}

const FeedbackComponent = () => {
  return(
    <div className="flex flex-col rounded-2xl p-4 gap-3 bg-white shadow-[0_0_6px_rgba(150,150,150,0.6)]">
      <div className="h-14 px-4 flex items-center mb-2 bg-[url('/images/fundo-dino.png')] bg-cover bg-no-repeat">
        <span className="font-bold text-xl text-white">{"Dino's Forest"}</span>
      </div>
      <div className="flex mx-8 justify-between">
        <ScoreComponent color="#FFB300" label="Tempo de Conclusão" value="2:16" icon="relogio.png" />
        <ScoreComponent color="#80D25B" label="Total de Pontos" value="100" icon="lupa.png" />
        <ScoreComponent color="#6CD2FF" label="Total de acertos" value="100%" icon="Porcentagem.png" />
      </div>
      <hr className="text-zinc-300 rounded-md my-2" />
      <div className="flex mx-20 justify-between">
        <BtnReacao icon="cara-feliz.png" />
        <BtnReacao icon="comentario.png" />
        <BtnReacao icon="coracao.png" />
      </div>
    </div>
  );
}

export default function Feedback() {
  const { child } = useChild();
  const [nomeCrianca, setNomeCrianca] = useState("");

  useEffect(() => {
    if (child) {
      setNomeCrianca(child.nome);
    }
  }, [child])

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

      <main className="flex-1 flex flex-col bg-white py-6 text-zinc-800 font-montserrat">
        <div className="flex flex-col flex-1 px-14 gap-3 overflow-hidden">
          {/* Início */}
          <div className="flex relative flex-col mb-2 w-1/3 gap-1 rounded-md text-[#4c4c4c] shrink-0">
            <span className="text-sm">Dashboard de:</span>
            <span className="font-bold text-xl">
              {nomeCrianca}
            </span>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-6">
            <FeedbackComponent />
            <FeedbackComponent />
            <FeedbackComponent />
            <FeedbackComponent />
          </div>

        </div>
      </main>
    </div>
  );
}
