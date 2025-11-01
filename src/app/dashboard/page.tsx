"use client";

import BarraXP from "@/components/BarraXP";
import Navbar from "@/components/Navbar";
import { useChild } from "@/contexts/ChildContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const barData = [
  { name: "Seg", value: 20 },
  { name: "Ter", value: 35 },
  { name: "Qua", value: 50 },
  { name: "Qui", value: 60 },
];

const pieData = [
  { name: "Segunda", value: 25 },
  { name: "Terça", value: 20 },
  { name: "Quarta", value: 15 },
  { name: "Quinta", value: 25 },
  { name: "Sexta", value: 15 },
];

const COLORS = ["#F87171", "#60A5FA", "#34D399", "#FBBF24", "#FDE68A"];

type DashboardItemProps = {
  width: string;
  text: string;
  number: number;
  icon: string;
  color: string;
  type?: string;
  bgColor?: string;
};

type MedalhaProps = {
  color: string;
  text: string;
};

const DashboardItem = ({
  width,
  text,
  icon,
  number,
  color,
  type,
  bgColor,
}: DashboardItemProps) => {
  return (
    <div
      className={`
                flex justify-between items-center rounded-2xl px-8 py-3
                ${
                  type != "inner"
                    ? "shadow-[inset_0_0_15px_rgba(0,0,0,0.3)]"
                    : "shadow-[0_0_6px_rgba(150,150,150,0.6)]"
                }
              `}
      style={{
        width: width,
        backgroundColor: bgColor || "white",
      }}
    >
      <div className="flex flex-col gap-1">
        <span
          className="font-bold text-[#4c4c4c]"
          style={{ color: type == "inner" ? color : "$4c4c4c" }}
        >
          {text}
        </span>
        <Image src={`/icons/${icon}`} alt="Criança" width={30} height={30} />
      </div>
      <span
        className={`font-bold text-3xl`}
        style={{ color: color || "$4c4c4c" }}
      >
        {number}
      </span>
    </div>
  );
};

const GraficoBarras = () => {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={barData} barSize={40} margin={{ left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {barData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const GraficoPizza = () => {
  return (
    <div className="flex items-center justify-center">
      <ResponsiveContainer width="55%" height={150}>
        <PieChart>
          <Pie
            data={pieData}
            cx="40%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legenda customizada */}
      <div className="flex flex-col gap-2 ml-4">
        {pieData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: COLORS[index % COLORS.length],
              }}
            />
            <span className="text-sm text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Medalha = ({ color, text }: MedalhaProps) => {
  return (
    <div
      className="flex w-full items-center p-3 gap-4 rounded-lg"
      style={{ backgroundColor: color }}
    >
      <Image
        src="/icons/medalha-branca.png"
        alt="medalha"
        width={30}
        height={30}
      />
      <span className="text-white">{text}</span>
    </div>
  );
};

export default function Dashboard() {
  const { child } = useChild();
  const [nomeCrianca, setNomeCrianca] = useState("");
  const [pontos, setPontos] = useState(0);
  const [fasesConcluidas, setFasesConcluidas] = useState(0);
  const [medalhas, setMedalhas] = useState([]);

  useEffect(() => {
    if (child) {
      setNomeCrianca(child.nome);
      setPontos(child.pontos);
      setFasesConcluidas(child.fasesConcluidas);
      setMedalhas(child.medalhas)
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
          <div className="flex relative flex-col w-1/3 mb-4 gap-1 h-20 rounded-md text-[#4c4c4c] shrink-0">
              <span className="text-sm">Dashboard de:</span>
              <span className="font-bold text-xl">
                {nomeCrianca}
              </span>
              <BarraXP />
          </div>

          {/* Linha inicial de itens do dashboard */}
          <div className="flex justify-between">
            <DashboardItem
              width={"36%"}
              text="Atividades vistas (dia)"
              number={pontos}
              icon="atividade.png"
              color="#EF5B6A"
            />
            <DashboardItem
              width={"20%"}
              text="Streak Diário"
              number={fasesConcluidas}
              icon="calendario-azul.png"
              color="#6CD2FF"
            />
            <DashboardItem
              width={"20%"}
              text="Conquistas"
              number={5}
              icon="trofeu.png"
              color="#80D25B"
            />
            <DashboardItem
              width={"18%"}
              text="Medalhas"
              number={medalhas?.length || 0}
              icon="teste.png"
              color="#FFCC4D"
            />
          </div>

          {/* Gráficos e Medalhas */}
          <div className="flex justify-between">
            {/* Gráficos */}
            <div className="flex w-[36%] flex-col gap-3">
              {/* Gráfico 01 - Barras */}
              <div className="flex flex-col rounded-2xl p-6 h-56 gap-4 items-center justify-center bg-white shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]">
                <span className="font-bold text-[#4c4c4c] mt-2 mb-1">
                  Atividades vistas (dia)
                </span>
                <GraficoBarras />
              </div>

              {/* Gráfico 02 - Pizza */}
              <div className="rounded-2xl p-6 h-56 bg-white shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]">
                <span className="font-bold mb-3 text-center text-[#4c4c4c] block w-full">
                  Atividades vistas (dia)
                </span>
                <GraficoPizza />
              </div>
            </div>

            {/* Medalhas */}
            <div className="flex flex-col w-[62%] items-center gap-3 h-full rounded-2xl py-6 px-12 bg-white shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]">
              <span className="font-bold text-[#4c4c4c] mb-2">Conquistas</span>
              <Medalha color="#6CD2FF" text="Medalha de pontualidade" />
              <Medalha color="#EF5B6A" text="Medalha de disciplina" />
              <Medalha color="#C15A36" text="Medalha de pontuação" />
              <Medalha color="#B7B8BA" text="Medalha de ranking" />
              <Medalha color="#EDBB0C" text="Medalha de conclusão" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
