import Image from "next/image";

interface Props {
  icon: string;
}

export default function BtnAction({icon}: Props){
  return (
    <div className={`
      flex flex-col items-center justify-center rounded-full p-3 gap-4 bg-white shadow-[0_0_6px_rgba(150,150,150,0.6)]
      hover:cursor-pointer
      `}
    >
        <Image
          src={`/icons/${icon}`}
          alt="Icon Reacão"
          width={32}
          height={32}
        />
      </div>
  );
}