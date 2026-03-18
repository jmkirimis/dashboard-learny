"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BtnNavbar from "./BtnNavbar";
import { useUser } from "@/contexts/UserContext";
import ContainerChildren from "../ContainerChildren";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, child, logout } = useUser();
  const [isOpen, setIsOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleButtonRef = useRef<HTMLButtonElement>(null);

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
            className={`${!isOpen && "rotate-180"}`}
          />
        </button>

        {/* Links */}
        <nav className={`flex flex-col gap-3 mt-6 ${isOpen && "p-4"}`}>
          {isOpen ? (
            <div className={`flex flex-col items-center mb-4`}>
              <div
                className="w-40 h-40 flex items-end justify-end pr-2 pb-2 bg-cover bg-center bg-no-repeat rounded-lg mb-4"
                style={{
                  backgroundImage: `url(${user?.profilePicture || "/images/user.png"})`,
                }}
              >
                <button
                  ref={toggleButtonRef}
                  className={`w-10 h-10 bg-cover bg-center bg-no-repeat rounded-full ${child?.profilePicture && "border-2 border-white"} hover:cursor-pointer`}
                  style={{
                    backgroundImage: `url(${child ? child.profilePicture || "/images/avatar.png" : "/images/add.png"})`,
                  }}
                  onClick={() => setModalOpen(prev => !prev)}
                />
              </div>
              <span className="text-[#4c4c4c] font-bold">{user?.name}</span>
              <span className="text-[#4c4c4c] text-[0.75rem]">{"You're a"}</span>
              <span className="font-bold bg-linear-to-r from-[#d47489] to-[#7dc3ec] bg-clip-text text-transparent">
                SUPER PARENT
              </span>
            </div>
          ) : (
            <a className="flex items-center gap-3 p-1 rounded-md transition text-sm">
              {
                <div
                  className="w-10 h-10 flex items-end justify-end pr-2 pb-2 bg-[url('/images/pai.png')] bg-contain bg-no-repeat rounded-full mb-4"
                  style={{
                    backgroundImage: `url(${user?.profilePicture || "/images/pai.png"})`,
                  }}
                />
              }
            </a>
          )}
          <BtnNavbar
            icon={pathname === "/dashboard" ? "estatistica-branco.png" : "estatistica.png"}
            text="Estatística"
            isNavbarOpen={isOpen}
            selected={pathname === "/dashboard"}
            onClick={() => router.push("/dashboard")}
          />
          <BtnNavbar
            icon={pathname === "/feedback" ? "sino-branco.png" : "sino.png"}
            text="Feedback"
            isNavbarOpen={isOpen}
            selected={pathname === "/feedback"}
            bgColor="#6CD2FF"
            onClick={() => router.push("/feedback")}
          />
          <BtnNavbar
            icon={pathname === "/perfil" ? "perfil-branco.png" : "perfil2.png"}
            text="Perfil"
            isNavbarOpen={isOpen}
            selected={pathname === "/perfil"}
            bgColor="#80D25B"
            onClick={() => router.push("/perfil")}
          />
          <BtnNavbar
            icon={pathname == "/configuracoes" ? "config-branco.png" : "config.png"}
            text="Configurações"
            isNavbarOpen={isOpen}
            selected={pathname == "/configuracoes"}
            bgColor="#FFB300"
            onClick={() => router.push("/configuracoes")}
          />
          {isOpen && <hr className="text-zinc-400 rounded-md my-3" />}
          <BtnNavbar
            icon="sair.png"
            text="Sair"
            isNavbarOpen={isOpen}
            onClick={logout}
          />
        </nav>
        {modalOpen && 
          <ContainerChildren 
            modalOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            toggleButtonRef={toggleButtonRef} 
          />
        }
      </aside>
    </div>
  );
}
