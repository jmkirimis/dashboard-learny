"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = {
  label: string;
  value: string;
  isPassword?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  transparent?: boolean;
  disabled?: boolean;
  selected?: boolean;
};

export default function CustomInput({
  label,
  value,
  isPassword,
  onChange,
  transparent,
  disabled,
  selected,
  onClick, // 🔹 adicione isso
}: Props & { onClick?: () => void }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <div
      className={`
        flex items-center p-4 gap-3 w-full h-14 rounded-md
        ${
          transparent
            ? "bg-[rgba(255,255,255,0.3)]"
            : selected
            ? "border-2 border-[#4c4c4c]"
            : "border border-zinc-200 rounded-md shadow-[0_0_4px_rgba(150,150,150,0.3)]"
        }
      `}
      onClick={onClick} // 🔹 aqui
    >
      <span
        className={`${!transparent && "font-bold text-[#4c4c4c]"} select-none`}
      >
        {label}:
      </span>
      <input
        type={isPassword && !mostrarSenha ? "password" : "text"}
        className={`w-full p-1 ${
          transparent ? "text-white" : "text-[#4c4c4c]"
        } focus:outline-none`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setMostrarSenha((prev) => !prev)}
          className="hover:cursor-pointer"
        >
          {mostrarSenha ? (
            <FaEyeSlash color="white" size={25} />
          ) : (
            <FaEye color="white" size={25} />
          )}
        </button>
      )}
    </div>
  );
}
