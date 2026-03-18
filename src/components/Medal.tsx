import Image from "next/image";

interface Props {
  color: string;
  text: string;
};

export default function Medal({ color, text }: Props) {
  return (
    <div
      className="flex w-full items-center p-3 gap-4 rounded-lg"
      style={{ backgroundColor: color }}
    >
      <Image
        src="/icons/medalha-branca.png"
        alt="medalha"
        width={30}
        height={30}
      />
      <span className="text-white">{text}</span>
    </div>
  );
};