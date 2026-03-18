"use client";

import XPBar from "@/components/XPBar";
import CustomBarChart from "@/components/Charts/CustomBarChart";
import CustomPieChart from "@/components/Charts/CustomPieChart";
import Container from "@/components/Container";
import DashboardItem from "@/components/DashboardItem";
import Medal from "@/components/Medal";
import { useUser } from "@/contexts/UserContext";
import { ChildDataDashboard, MedalItem } from "@/types";
import { useEffect, useState } from "react";

const medalColors: Record<string, string> = {
  "Iniciando!": "#80D25B", 
  "A todo o vapor!": "#EF5B6A",
  "Desvendando!": "#6CD2FF",
};

export default function Dashboard() {
  const { child } = useUser();

  const [childData, setData] = useState<ChildDataDashboard>({
    profilePicture: child?.profilePicture || "",
    username: child?.username || "",
    name: child?.name || "",
    points: child?.points || 0,
    phasesCompleted: child?.phasesCompleted || null,
    medals: child?.medals || null,
  });

  useEffect(() => {
    if (!child) return;

    setData({
      profilePicture: child?.profilePicture || "",
      username: child?.username || "",
      name: child?.name || "",
      points: child?.points || 0,
      phasesCompleted: child?.phasesCompleted || null,
      medals: child?.medals || null,
    });
  }, [child]);

  return (
    <Container>
      <div className="flex flex-col flex-1 px-14 gap-3 overflow-hidden">
        {/* Início */}
        <div className="flex relative flex-col w-1/3 mb-4 gap-1 h-20 rounded-md text-[#4c4c4c] shrink-0">
            <span className="text-sm">Dashboard de:</span>
            <span className="font-bold text-xl">
              {childData?.name}
            </span>
            <XPBar points={childData?.points} />
        </div>

        {/* Linha inicial de itens do dashboard */}
        <div className="flex justify-between">
          <DashboardItem
            width={"36%"}
            text="Atividades vistas (dia)"
            number={childData?.points || 0}
            icon="atividade.png"
            color="#EF5B6A"
          />
          <DashboardItem
            width={"20%"}
            text="Streak Diário"
            number={childData?.phasesCompleted || 0}
            icon="calendario-azul.png"
            color="#6CD2FF"
          />
          <DashboardItem
            width={"20%"}
            text="Conquistas"
            number={childData?.medals?.length || 0}
            icon="trofeu.png"
            color="#80D25B"
          />
          <DashboardItem
            width={"18%"}
            text="Medalhas"
            number={0}
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
              <CustomBarChart />
            </div>

            {/* Gráfico 02 - Pizza */}
            <div className="rounded-2xl p-6 h-56 bg-white shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]">
              <span className="font-bold mb-3 text-center text-[#4c4c4c] block w-full">
                Atividades vistas (dia)
              </span>
              <CustomPieChart />
            </div>
          </div>

          {/* Medalhas */}
          <div className="flex flex-col w-[62%] items-center gap-3 h-full rounded-2xl py-6 px-12 bg-white shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]">
            <span className="font-bold text-[#4c4c4c] mb-2">Conquistas</span>
            {childData?.medals?.map((item: MedalItem, index) => (
                <Medal
                  key={item._id}
                  color={medalColors[item.name] || "#6CD2FF"}
                  text={item.name}
                />
              ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
