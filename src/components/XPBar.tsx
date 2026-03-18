type Props = {
  points?: number,
}

export default function XPBar({ points = 150 }: Props) {

  const progress = points % 100;
  const percent = Math.min((progress / 100) * 100, 100);

  return (
    <div className="w-full bg-white border-2 border-gray-300 rounded-full p-1 relative">
      <div
        className="h-6 bg-linear-to-r from-[#d47489] to-[#7dc3ec] rounded-full flex items-center px-2 text-xs font-semibold text-white select-none transition-all duration-500"
        style={{ width: `${percent}%` }}
      >
        <span className={`w-full absolute ${progress < 30 && "text-[#4c4c4c]"}`}>EXP: {progress} / 100</span>
      </div>
    </div>
  );
}
