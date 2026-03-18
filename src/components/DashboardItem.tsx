import Image from "next/image";

interface Props {
  width: string;
  text: string;
  number: number;
  icon: string;
  color: string;
  type?: string;
  bgColor?: string;
}

export default function DashboardItem({
  width,
  text,
  icon,
  number,
  color,
  type,
  bgColor,
}: Props) {
  return (
    <div
      className={`
                flex justify-between items-center rounded-2xl px-8 py-3
                ${
                  type != "inner"
                    ? "shadow-[inset_0_0_15px_rgba(0,0,0,0.3)]"
                    : "shadow-[0_0_6px_rgba(150,150,150,0.6)]"
                }
              `}
      style={{
        width: width,
        backgroundColor: bgColor || "white",
      }}
    >
      <div className="flex flex-col gap-1">
        <span
          className="font-bold text-[#4c4c4c]"
          style={{ color: type == "inner" ? color : "$4c4c4c" }}
        >
          {text}
        </span>
        <Image src={`/icons/${icon}`} alt="Criança" width={30} height={30} />
      </div>
      <span
        className={`font-bold text-3xl`}
        style={{ color: color || "$4c4c4c" }}
      >
        {number}
      </span>
    </div>
  );
}
