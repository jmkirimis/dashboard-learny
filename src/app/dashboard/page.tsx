"use client";

import SelectedCharacter from "@/components/Characters/SelectedCharacter";
import CustomBarChart from "@/components/Charts/CustomBarChart";
import CustomPieChart from "@/components/Charts/CustomPieChart";
import Container from "@/components/Container";
import DashboardItem from "@/components/DashboardItem";
import { useCustomAlert } from "@/contexts/AlertContext";
import { useUser } from "@/contexts/UserContext";
import { useApi } from "@/hooks/useApi";
import { Character } from "@/types/characters";
import { getBarChartData, getPieChartData } from "@/utils/activityCharts";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const { child } = useUser();

  const { request } = useApi();
  const { showAlert } = useCustomAlert();

  const [activities, setActivities] = useState([]);
  const [characters, setCharacters] = useState<Character[]>([]);

  const getChildActivity = useCallback(
    async (id: string) => {
      const result = await request({
        endpoint: `/api/parents/child/${id}/activity`,
        method: "GET",
      });

      if (result && !result.error) {
        setActivities(result);
      } else {
        if (result?.status !== 404) {
          showAlert({
            icon: "/icons/error.png",
            title: "Erro ao carregar dados de atividade!",
            message:
              result.message ||
              "Ocorreu um erro ao carregar os dados de atividade",
          });
        }
      }
    },
    [request, showAlert],
  );

  const getCharactersCatalog = useCallback(async () => {
    const result = await request({
      endpoint: `/api/game/characters`,
      method: "GET",
    });

    if (result && !result.error) {
      setCharacters(result);
    } else {
      if (result?.status !== 404) {
        showAlert({
          icon: "/icons/error.png",
          title: "Erro ao carregar dados dos personagens!",
          message:
            result.message ||
            "Ocorreu um erro ao carregar os dados dos personagens do catálogo",
        });
      }
    }
  }, [request, showAlert]);

  const barData = useMemo(() => {
    return getBarChartData(activities);
  }, [activities]);

  const pieData = useMemo(() => {
    return getPieChartData(activities);
  }, [activities]);

  useEffect(() => {
    if (child?._id) {
      getChildActivity(child._id);
    }

    getCharactersCatalog();
  }, [child, getChildActivity, getCharactersCatalog]);

  return (
    <Container>
      <div className="flex flex-1 flex-col overflow-hidden px-14 py-6">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-1 text-[#4c4c4c]">
          <span className="text-sm">Feedback para:</span>

          <span className="text-2xl font-bold">{child?.name}</span>
        </div>

        {/* STATUS */}
        <div className="mb-3 grid shrink-0 grid-cols-3 gap-4">
          <DashboardItem
            width="100%"
            text="Pontos totais"
            number={child?.points || 0}
            icon="activity.png"
            color="#EF5B6A"
          />

          <DashboardItem
            width="100%"
            text="Streak Diário"
            number={child?.streak || 0}
            icon="calendar-blue.png"
            color="#6CD2FF"
          />

          <DashboardItem
            width="100%"
            text="Personagens"
            number={child?.characters.length || 0}
            icon="trophy.png"
            color="#80D25B"
          />
        </div>

        {/* BOTTOM AREA */}
        <div className="grid grid-cols-2 gap-4">
          {/* LEFT SIDE - CHARTS */}
          <div className="grid grid-rows-2 gap-4">
            {/* BAR CHART */}
            <div
              className="
                flex flex-col rounded-2xl
                bg-white p-6
                shadow-[inset_0_0_10px_rgba(0,0,0,0.15)]
              "
            >
              <span
                className="
                  mb-4 block text-center
                  font-bold text-[#4c4c4c]
                "
              >
                Atividades vistas (dia)
              </span>

              <div className="flex-1">
                <CustomBarChart data={barData} />
              </div>
            </div>

            {/* PIE CHART */}
            <div
              className="
                flex flex-col rounded-2xl
                bg-white p-6
                shadow-[inset_0_0_10px_rgba(0,0,0,0.15)]
              "
            >
              <span
                className="
                  mb-4 block text-center
                  font-bold text-[#4c4c4c]
                "
              >
                Atividades vistas por mundo
              </span>

              <div className="flex flex-1 items-center justify-center">
                <CustomPieChart data={pieData} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - CHARACTERS */}
          <div
            className="
              flex flex-col rounded-2xl
              bg-white py-6 px-12
              shadow-[inset_0_0_10px_rgba(0,0,0,0.15)]
            "
          >
            <span
              className="
                mb-6 text-center
                font-bold text-[#4c4c4c]
              "
            >
              Personagens obtidos
            </span>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
              {child?.characters.map((childCharacter, index) => {
                const catalogCharacter = characters.find(
                  (catalogItem) =>
                    catalogItem.code === childCharacter.characterCode,
                );

                if (!catalogCharacter) return null;

                return (
                  <SelectedCharacter
                    key={index}
                    name={catalogCharacter.name}
                    image={catalogCharacter.image}
                    level={childCharacter.level}
                    characterPoints={childCharacter.characterPoints}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
