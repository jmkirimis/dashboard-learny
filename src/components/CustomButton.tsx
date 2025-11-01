import Image from "next/image";

type Props = {
    icon?: string;
    text: string;
    color: string;
    onClick: () => void;
}

export default function CustomButton({icon, text, color, onClick}: Props) {
  return (
    <button
      className={`flex w-full items-center ${icon ? "justify-between pr-6" : "justify-center"} text-wite rounded-md px-3 ${text == "Excluir Perfil" ? "py-2.5" : "py-4"} hover:cursor-pointer`}
      style={{backgroundColor: color}}
      onClick={onClick}
    >
        { icon &&
            <Image
            src={`/icons/${icon}`}
            alt="Close"
            width={30}
            height={30}
            className={`transition-all hover:cursor-pointer hover:scale-110`}
            />
        }
        <span className="font-semibold text-white w-full text-center select-none">{text}</span>
    </button>
  );
}
