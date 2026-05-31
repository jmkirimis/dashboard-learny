"use client";

import FeedbackContainer from "@/components/Feedback/FeedbackContainer";
import { useUser } from "@/contexts/UserContext";
import { PhaseCompleted, ProgressWorld } from "@/types/worlds";

export default function Feedback() {
  const { child } = useUser();

  return (
      <div className="flex flex-col pl-14 gap-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-0.5 text-[#4c4c4c]">
          <span className="text-sm font-medium">Feedback para:</span>
          <span className="text-2xl font-bold">{child?.name}</span>
          <hr className="max-w-1/2 mt-1 text-[#bebebe]" />
        </div>

        {/* Mundos */}
        <div className="flex flex-col gap-8 pb-10">
          {child?.worlds?.map((world: ProgressWorld, worldIndex: number) => {
            // Ignora mundos sem fases concluídas
            if (!world.completedPhases?.length) return null;

            return (
              <div key={world.worldCode} className="flex flex-col gap-4">
                {/* Título do mundo */}
                <h1 className="text-2xl font-bold text-[#4c4c4c]">
                  Mundo {worldIndex + 1} - {world.worldCode == "WORLD_1" && "Dinos's Forest"}
                </h1>

                {/* Lista horizontal */}
                <div className="custom-scrollbar w-full overflow-x-auto">
                  <div className="flex flex-row gap-4 min-w-max px-1 pt-1 pb-4">
                    {world.completedPhases.map((phase: PhaseCompleted, index: number) => (
                      <FeedbackContainer
                        key={phase.phaseCode}
                        phaseNumber={index + 1}
                        phaseCode={phase.phaseCode}
                        time={phase.time}
                        points={phase.points}
                        percentage={phase.percentage}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
  );
}
