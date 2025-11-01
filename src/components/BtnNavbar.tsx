import Image from "next/image";

type Props = {
  icon: string;
  text: string;
  isNavbarOpen: boolean;
  selected?: boolean;
  bgColor?: string;
  onClick?: () => void;
};

export default function BtnNavbar({
  icon,
  text,
  isNavbarOpen,
  selected,
  bgColor,
  onClick,
}: Props) {
  return (
    <button
      className={`flex items-center hover:cursor-pointer ${text == "Estatística" && selected ? "bg-linear-to-r from-[#8f6579] to-[#519ebf]" : ""} ${
        isNavbarOpen ?
        "border border-zinc-200 rounded-md p-2 shadow-[0_0_4px_rgba(150,150,150,0.4)] hover:shadow-[0_0_6px_rgba(100,100,100,0.6)]" : "justify-center"
      }`}
      style={{ 
        backgroundColor: selected ? bgColor : ""
      }}
      onClick={onClick}
    >
      <div
        className={`flex items-center p-1 rounded-md transition text-sm ${
          isNavbarOpen ? "gap-3" : "justify-center"
        }`}
      >
        {
          <Image
            src={`/icons/${icon}`}
            alt="Close"
            width={24}
            height={24}
            className={`transition-all ${
              !isNavbarOpen && "hover:cursor-pointer hover:scale-110"
            }`}
          />
        }
        <span className={`font-bold ${selected && "text-white"}`}>{isNavbarOpen && text}</span>
      </div>
    </button>
  );
}
