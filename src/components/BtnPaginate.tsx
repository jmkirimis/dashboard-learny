import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Props {
  text: string;
  onClick?: () => void;
};

export default function BtnPaginate({ text, onClick }: Props) {
  return (
    <button
      className="flex flex-col items-center gap-4 hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-center p-4 rounded-full bg-[rgba(255,255,255,0.3)]">
        {text == "Retornar" || text == "Cadastrar Novamente" ? (
          <FaArrowLeft size={18} />
        ) : (
          <FaArrowRight size={18} />
        )}
      </div>
      <span>{text}</span>
    </button>
  );
};