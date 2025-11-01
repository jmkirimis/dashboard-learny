"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavbarLogin() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`relative h-screen shadow-[4px_0_10px_rgba(0,0,0,0.15)] z-10 ${
          !isOpen && "items-center"
        } bg-white text-[#4c4c4c] transition-all duration-300 ${
          isOpen ? "w-64" : "w-18"
        } flex flex-col p-1`}
      >
        {/* Botão de toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-8 bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.15)] -right-9 p-2 hover:cursor-pointer transition-all"
        >
          <Image
            src="/icons/swipe.png"
            alt="Toggle Sidebar"
            width={20}
            height={20}
          />
        </button>

        {/* Links */}
        <nav className={`flex flex-col gap-3 mt-24 ${isOpen && "p-4"}`}>
          {isOpen ? (
            <div className={`flex flex-col items-center mb-4`}>
              <button
                className="w-[80%] bg-linear-to-br hover:cursor-pointer 
              from-[#a94f5c] 
              via-[#519ebf] via-70% 
              to-[#519ebf] h-40 mb-8 rounded-lg text-white flex flex-col items-center justify-center"
              onClick={() => router.push("/")}
              >
                <Image
                  src="/icons/user.png"
                  alt="User"
                  width={40}
                  height={40}
                  className="mb-3"
                />
                <span className="font-bold text-xl">Entrar</span>
              </button>
              <span className="text-[#4c4c4c]">Entre em sua conta</span>
              <span className="text-[#4c4c4c] font-black">Learny</span>
            </div>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-3 p-1 rounded-md transition text-sm"
            >
              {
                <Image
                  src="/icons/perfil.png"
                  alt="Close"
                  width={32}
                  height={32}
                  className={`transition-all ${
                    !isOpen && "hover:cursor-pointer hover:scale-110"
                  }`}
                />
              }
            </Link>
          )}
          <div
            className={`flex items-center ${
              isOpen &&
              "border border-zinc-200 rounded-md p-1 shadow-md hover:cursor-pointer"
            }`}
          >
            <a
              href="#"
              className="flex items-center gap-3 p-1 rounded-md transition text-sm"
            >
              {
                <Image
                  src="/icons/home.png"
                  alt="Close"
                  width={32}
                  height={32}
                  className={`transition-all ${
                    !isOpen && "hover:cursor-pointer hover:scale-110"
                  }`}
                />
              }
              {isOpen && "Estatística"}
            </a>
          </div>
          <div
            className={`flex items-center ${
              isOpen &&
              "border border-zinc-200 rounded-md p-1 shadow-md hover:cursor-pointer"
            }`}
          >
            <a
              href="https://jmkirimis.github.io/site-learny/"
              target="_blank"
              className="flex items-center gap-3 p-1 rounded-md transition text-sm"
            >
              {
                <Image
                  src="/icons/info.png"
                  alt="Close"
                  width={32}
                  height={32}
                  className={`transition-all ${
                    !isOpen && "hover:cursor-pointer hover:scale-110"
                  }`}
                />
              }
              {isOpen && "Informações"}
            </a>
          </div>
        </nav>
      </aside>
    </div>
  );
}
