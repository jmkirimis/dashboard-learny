import BtnAction from "./BtnAction";
import ScoreCard from "./ScoreCard";

type Props = {
  tempo: string;
  pontos: string;
  porcentagem: string;
}

export default function FeedbackContainer ({tempo, pontos, porcentagem}: Props) {
  return(
    <div className="flex flex-col rounded-2xl p-4 gap-3 bg-white shadow-[0_0_6px_rgba(150,150,150,0.6)]">
      <div className="h-14 px-4 flex items-center mb-2 bg-[url('/images/fundo-dino.png')] bg-cover bg-no-repeat">
        <span className="font-bold text-xl text-white">{"Dino's Forest"}</span>
      </div>
      <div className="flex mx-8 justify-between">
        <ScoreCard color="#FFB300" label="Tempo de Conclusão" value={tempo} icon="relogio.png" />
        <ScoreCard color="#80D25B" label="Total de Pontos" value={pontos} icon="lupa.png" />
        <ScoreCard color="#6CD2FF" label="Total de acertos" value={porcentagem} icon="porcentagem.png" />
      </div>
      <hr className="text-zinc-300 rounded-md my-2" />
      <div className="flex mx-20 justify-between">
        <BtnAction icon="cara-feliz.png" />
        <BtnAction icon="comentario.png" />
        <BtnAction icon="coracao.png" />
      </div>
    </div>
  );
}