import Image from "next/image";

interface Props {
  step: number;
};

export default function ProgressLine({ step }: Props) {
  const steps = [
    "Tela inicial",
    "Saudação",
    "Cadastro",
    "Confirmação",
    "Login",
  ];

  return (
    <div className="flex relative flex-col justify-center items w-full h-28 px-12 gap-2 bg-[#4c4c4c] rounded-md text-white shrink-0">
      <Image
        src="/images/logo-com-contorno.png"
        alt="Logo"
        width={48}
        height={48}
        className="absolute right-0 top-0"
      />

      <div className="flex items-center justify-between relative w-4/5 mx-auto">
        {/* Linha de fundo */}
        <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-500 -translate-y-1/2"></div>

        {/* Etapas */}
        {steps.map((item, index) => (
          <div key={item} className="flex flex-col items-center relative z-10">
            {/* Bolinha */}
            <div
              className={`w-2.5 h-2.5 rounded-full absolute top-1/4 -translate-y-1/2 ${
                index <= step ? "bg-white" : "bg-gray-400"
              }`}
            ></div>

            {/* Texto */}
            <span
              className={`mt-6 text-md ${
                index === step ? "text-white font-semibold" : "text-gray-300"
              }`}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};