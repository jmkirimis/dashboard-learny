"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { IoMdAddCircle } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useCustomAlert } from "@/contexts/AlertContext";
import { useApi } from "@/hooks/useApi";
import { useUser } from "@/contexts/UserContext";
import { Child } from "@/types/child";
import Loading from "./Loading";
import { useGetData } from "@/hooks/useGetData";

type Props = {
  modalOpen: boolean;
  onClose: () => void;
  toggleButtonRef: React.RefObject<HTMLButtonElement | null>;
};

export default function ContainerChildren({
  modalOpen,
  onClose,
  toggleButtonRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { showAlert } = useCustomAlert();
  const { loading, request } = useApi();
  const { child } = useUser();
  const { getChildData } = useGetData();

  const [loadingChildren, setLoadingChildren] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);

  const handleSelect = async (child: Child) => {
    const result = await request({
      endpoint: "/api/parents",
      method: "PUT",
      body: {
        selectedChild: child._id,
      },
    });

    if (result && !result.error) {
      getChildData();
    } else {
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao selecionar o filho!",
        message:
          result.message ||
          "Ocorreu um erro ao selecionar o filho, aguarde e tente novamente",
      });
    }
  };

  const loadChildren = useCallback(async () => {
    setLoadingChildren(true);

    const result = await request({
      endpoint: "/api/parents/children",
      method: "GET",
    });

    if (result && !result.error) {
      setChildren(result);
    } else {
      if (result?.status !== 404) {
        showAlert({
          icon: "/icons/error.png",
          title: "Erro ao carregar filhos!",
          message: result.message || "Ocorreu um erro ao carregar os filhos",
        });
      }
      setChildren([]);
    }

    setLoadingChildren(false);
  }, [request, showAlert]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Se clicou no container ou no botão do toggle, não fecha
      if (
        containerRef.current?.contains(event.target as Node) ||
        toggleButtonRef?.current?.contains(event.target as Node)
      ) {
        return;
      }

      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, toggleButtonRef]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren, modalOpen]);

  return (
    <div
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col items-center justify-center absolute left-56 w-80 top-24 min-h-28 rounded-2xl p-0.5 bg-white shadow-[0_0_12px_rgba(150,150,150,0.7)] z-50"
    >
      {loading || loadingChildren ? (
        <Loading />
      ) : (
        <div className="bg-white/10 rounded-2xl p-3 w-80">
          <div className="bg-white/10 rounded-2xl p-3">
            {!children.length ? (
              <div className="flex flex-col justify-center items-center">
                <span className="flex text-center mb-4">
                  Cadastre seu primeiro filho
                </span>
                <button className="flex w-full bg-zinc-300 justify-center rounded-lg py-2 hover:cursor-pointer">
                  <div
                    onClick={() => {
                      router.push("/crianca/cadastro");
                      router.refresh();
                    }}
                    className="flex items-center justify-center"
                  >
                    <IoMdAddCircle name="add-circle" size={30} color="#fff" />
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="w-full bg-[#EF5B6A] flex items-center justify-between px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-full bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${
                          child?.profilePicture
                            ? child?.profilePicture
                            : "/images/avatar.png"
                        })`,
                      }}
                    />
                    <div>
                      <p className="text-lg font-bold text-white">
                        {child?.name || "Joana"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="hover:cursor-pointer bg-white rounded-full p-2"
                    onClick={() =>
                      router.push(`/crianca/perfil?id=${child?._id}`)
                    }
                  >
                    <Image
                      src="/icons/config.png"
                      alt="Editar"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>

                <div className="w-full">
                  {children
                    .filter((f) => f.username !== child?.username)
                    .map((child) => (
                      <button
                        key={child.username}
                        onClick={() => handleSelect(child)}
                        className="flex items-center w-full gap-4 px-4 py-2 mb-2 rounded-lg hover:cursor-pointer hover:bg-zinc-400 transition"
                      >
                        <div
                          className="w-12 h-12 rounded-full bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url(${
                              child.profilePicture || "/images/avatar.png"
                            })`,
                          }}
                        />
                        <span className="text-[#4c4c4c] font-semibold text-base">
                          {child.name}
                        </span>
                      </button>
                    ))}

                  <button
                    className="flex w-full bg-zinc-300 justify-center rounded-lg py-2 hover:cursor-pointer"
                    onClick={() => {
                      router.push("/crianca/cadastro");
                      router.refresh();
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <IoMdAddCircle name="add-circle" size={30} color="#fff" />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
