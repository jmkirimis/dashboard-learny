type Props = {
  pontos?: number,
}

export default function BarraXP({ pontos = 150 }: Props) {

  const progressoNivel = pontos % 100; // resto da divisão
  const percent = Math.min((progressoNivel / 100) * 100, 100);

  return (
    <div className="w-full bg-white border-2 border-gray-300 rounded-full p-1 relative">
      <div
        className="h-6 bg-linear-to-r from-[#d47489] to-[#7dc3ec] rounded-full flex items-center px-2 text-xs font-semibold text-white select-none transition-all duration-500"
        style={{ width: `${percent}%` }}
      >
        <span className={`w-full absolute ${progressoNivel < 30 && "text-[#4c4c4c]"}`}>EXP: {progressoNivel} / 100</span>
      </div>
    </div>
  );
}
