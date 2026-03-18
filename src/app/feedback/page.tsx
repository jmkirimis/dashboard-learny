"use client";

import Container from "@/components/Container";
import FeedbackContainer from "@/components/Feedback/FeedbackContainer";
import { useUser } from "@/contexts/UserContext";

export default function Feedback() {
  const { child } = useUser();

  return (
    <Container>
      <div className="flex flex-col flex-1 px-14 gap-3 overflow-hidden">
        {/* Início */}
        <div className="flex relative flex-col mb-2 w-1/3 gap-1 rounded-md text-[#4c4c4c] shrink-0">
          <span className="text-sm">Dashboard de:</span>
          <span className="font-bold text-xl">
            {child ? child.name : "Usuário"}
          </span>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-6">
          <FeedbackContainer tempo="1:30" pontos="100" porcentagem="100" />
          <FeedbackContainer tempo="1:00" pontos="80" porcentagem="80" />
          <FeedbackContainer tempo="2:00" pontos="150" porcentagem="100" />
          <FeedbackContainer tempo="1:20" pontos="120" porcentagem="100" />
        </div>

      </div>
    </Container>
  );
}
