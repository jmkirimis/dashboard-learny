import Image from "next/image";

interface Props {
  icon: string;
  onPress: () => void;
}

export default function BtnAction({ icon, onPress }: Props) {
  return (
    <button
      onClick={onPress}
      className={`
      flex flex-col items-center justify-center rounded-full p-3 gap-4 bg-white shadow-[0_0_6px_rgba(150,150,150,0.6)]
      hover:cursor-pointer
      `}
    >
      <Image src={`/icons/${icon}`} alt="Icon Reacão" width={32} height={32} />
    </button>
  );
}
