import ProgressBarCharacter from "./ProgressBarCharacter";

interface Props {
  name: string;
  image: string;
  level: number;
  characterPoints: number;
}

export default function SelectedCharacter({
  name,
  image,
  level,
  characterPoints,
}: Props) {

  const progressLevel = (characterPoints / getCharacterXpToNext(level)) * 100

  function getCharacterXpToNext(level: number) {
    return Math.floor(
      80 + 45 * Math.pow(level - 1, 1.4)
    );
  }

  return (
    <div
      className="
        flex w-full items-center gap-3 rounded-[20px]
        border-2 border-gray-200 bg-white
        px-0 pr-8
        transition-all duration-200
        hover:scale-[1.01]
        hover:shadow-md
      "
    >
      {/* IMAGE */}
      <div
        className={`relative flex h-[100px] w-[120px] items-center justify-center bg-contain bg-no-repeat`}
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* CONTENT */}
      <div className="flex flex-1 flex-col gap-1.5">
        {/* HEADER */}
        <div className="flex items-end justify-between">
          <div className="text-left">
            <h2 className="font-bold text-lg text-gray-700">{name}</h2>
          </div>

          <p className="font-medium text-[20px] text-yellow-500">
            Lv.
            <span className="font-bold text-[26px]">
              {level.toString().padStart(2, "0")}
            </span>
          </p>
        </div>

        {/* PROGRESS */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBarCharacter
              label={`${progressLevel < 100 ? progressLevel : "100"}%`}
              progress={progressLevel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
