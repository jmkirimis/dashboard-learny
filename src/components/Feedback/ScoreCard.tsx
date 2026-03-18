import Image from "next/image";

interface Props {
  color: string;
  label: string;
  value: string;
  icon: string;
}

export default function ScoreCard({color, label, value, icon}: Props){
  return(
    <div 
      className="flex relative flex-col items-center justify-center w-26 px-4 py-2 border-5 rounded-2xl"
      style={{borderColor: color}}
    >
      <span 
        className="font-medium text-center text-sm"
        style={{color: color}}
      >{label}</span>
      <span className="font-bold text-sm">{value}</span>
      <div className="bg-white rounded-full p-0.5 absolute -right-2.5 -top-2.5">
        <Image
          src={`/icons/${icon}`}
          alt="Icon Pontuação"
          width={21}
          height={29}
        />
      </div>
    </div>
  );
}
