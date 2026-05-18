"use client";

import Container from "@/components/Container";
import FeedbackContainer from "@/components/Feedback/FeedbackContainer";
import { useUser } from "@/contexts/UserContext";
import { PhaseCompleted, ProgressWorld } from "@/types/worlds";

export default function Feedback() {
  const { child } = useUser();

  return (
    <Container>
      <div className="flex flex-col pl-14 gap-6">
        {/* Header */}
        <div className="flex relative flex-col rounded-md text-[#4c4c4c] shrink-0">
          <span className="text-sm">Feedback de:</span>
          <span className="font-bold text-xl">{child?.name}</span>
          <hr className="w-50 mt-1 text-[#4c4c4c]" />
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
                  Mundo {worldIndex + 1}
                </h1>

                {/* Lista horizontal */}
                <div className="w-full overflow-x-auto">
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
    </Container>
  );
}
