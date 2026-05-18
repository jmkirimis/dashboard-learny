"use client";

interface Props {
  label: string;
  progress: number;
}

export default function ProgressBarCharacter({
  label,
  progress,
}: Props) {
  return (
    <div
      className="
        flex w-full items-center overflow-hidden
        rounded-full border-2 border-[#4C4C4C]
      "
    >
      {/* LABEL */}
      <div
        className="
          flex h-[18px] w-10
          items-center justify-center
          bg-[#4c4c4c]
        "
      >
        <span className="font-montserratBold text-[10px] text-white">
          {label}
        </span>
      </div>

      {/* PROGRESS CONTAINER */}
      <div
        className="
          mr-[5px] flex h-2.5 flex-1
          overflow-hidden rounded-r-[5px]
          bg-white
        "
      >
        <div
          className="
            h-full rounded-r-[5px]
            bg-linear-to-r
            from-[#b25563]
            to-[#669bbb]
            transition-all duration-500 ease-out
          "
          style={{
            width: `${Math.min(Math.max(progress, 0), 100)}%`,
          }}
        />
      </div>
    </div>
  );
}