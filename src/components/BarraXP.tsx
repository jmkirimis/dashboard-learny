type Props = {
  pontos?: number,
  value?: number,
  max?: number,
}

export default function BarraXP({ value = 100, max = 300 }: Props) {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full bg-white border-2 border-gray-300 rounded-full p-1">
      <div
        className="h-6 bg-linear-to-r from-[#d47489] to-[#7dc3ec] rounded-full flex items-center px-2 text-xs font-semibold text-white select-none transition-all duration-500"
        style={{ width: `${percent}%` }}
      >
        EXP: {value}
      </div>
    </div>
  );
}
