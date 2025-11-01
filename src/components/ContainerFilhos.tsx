/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IoMdAddCircle } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useChild } from "@/contexts/ChildContext";
import { useCustomAlert } from "@/contexts/AlertContext";
import { useApi } from "@/hooks/useApi";

type Props = {
  modalOpen: boolean;
  onClose: () => void;
  toggleButtonRef: React.RefObject<HTMLButtonElement | null>;
};

type Filho = {
  _id: string;
  usuario: string;
  nome: string;
  foto?: string;
};

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Image
        src="/gifs/loading.gif"
        alt="Loading"
        width={100}
        height={100}
        unoptimized
      />
    </div>
  );
};

export default function ContainerFilhos({
  modalOpen,
  onClose,
  toggleButtonRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const { loading, request } = useApi();
  const { setChild } = useChild();
  const [filhos, setFilhos] = useState<Filho[]>([]);
  const [filhoSelecionado, setFilhoSelecionado] = useState<Filho | null>(null);
  const [erroFetch, setErroFetch] = useState(false);

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

  const handleSelect = async (filho: Filho) => {
    const result = await request({
      endpoint: "/api/filhoSelecionado",
      method: "PUT",
      body: { id: filho?._id },
    });

    if (result && !result.error) {
      setFilhoSelecionado(result);
      setChild({
        foto: result.foto,
        usuario: result.usuario,
        nome: result.nome,
        pontos: result.pontos,
        fasesConcluidas: result.fasesConcluidas,
        medalhas: result.medalhas,
      });
    } else {
      showAlert({
        icon: "/icons/erro.png",
        title: "Erro ao selecionar o filho!",
        message:
          result.message ||
          "Ocorreu um erro ao selecionar o filho, aguarde e tente novamente",
      });
    }
  };

  useEffect(() => {
    if (erroFetch) return;
    const carregarFilhos = async () => {
      const result = await request({
        endpoint: "/api/criancas",
        method: "GET",
      });
      if (result && !result.error) {
        setFilhos(result);
      } else {
        if (result.status === 404 || result.status === 401) return;
        setErroFetch(true);
        showAlert({
          icon: "/icons/erro.png",
          title: "Erro ao carregar filhos!",
          message: result.message || "Ocorreu um erro ao carregar os filhos",
        });
      }
    };
    const carregarFilhoSelecionado = async () => {
      const result = await request({
        endpoint: "/api/filhoSelecionado",
        method: "GET",
      });
      if (result && !result.error) {
        setFilhoSelecionado(result);
      } else {
        if (result.status === 404 || result.status === 401) return;
        setErroFetch(true);
        showAlert({
          icon: "/icons/erro.png",
          title: "Erro ao carregar filho selecionado!",
          message:
            result.message || "Ocorreu um erro ao carregar o filho selecionado",
        });
      }
    };
    carregarFilhos();
    carregarFilhoSelecionado();
  }, [modalOpen, erroFetch]);

  return (
    <div
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col items-center justify-center absolute left-56 w-80 top-28 min-h-28 rounded-2xl p-0.5 bg-white shadow-[0_0_12px_rgba(150,150,150,0.7)] z-50"
    >
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="bg-white/10 rounded-2xl p-3 w-80">
          <div className="bg-white/10 rounded-2xl p-3">
            {!filhoSelecionado ? (
              <div className="flex flex-col justify-center items-center">
                <span className="flex text-center mb-4">
                  Cadastre seu primeiro filho
                </span>
                <button className="flex w-full bg-zinc-300 justify-center rounded-lg py-2 hover:cursor-pointer">
                  <div
                    onClick={() => {
                      router.push("/cadastro?tipo=criancas");
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
                          filhoSelecionado.foto
                            ? filhoSelecionado.foto
                            : "/images/avatar.png"
                        })`,
                      }}
                    />
                    <div>
                      <p className="text-lg font-bold text-white">
                        {filhoSelecionado.nome || "Joana"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="hover:cursor-pointer"
                    onClick={() =>
                      router.push(`/crianca/perfil?id=${filhoSelecionado._id}`)
                    }
                  >
                    <Image
                      src="/icons/engrenagem.png"
                      alt="editar"
                      width={35}
                      height={35}
                    />
                  </button>
                </div>

                <div className="w-full">
                  {filhos
                    .filter((f) => f.usuario !== filhoSelecionado.usuario)
                    .map((filho) => (
                      <button
                        key={filho.usuario}
                        onClick={() => handleSelect(filho)}
                        className="flex items-center w-full gap-4 px-4 py-2 mb-2 rounded-lg hover:cursor-pointer hover:bg-zinc-400 transition"
                      >
                        <div
                          className="w-14 h-14 rounded-full bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url(${
                              filho.foto || "/images/avatar.png"
                            })`,
                          }}
                        />
                        <span className="text-[#4c4c4c] font-semibold text-base">
                          {filho.nome}
                        </span>
                      </button>
                    ))}

                  <button
                    className="flex w-full bg-zinc-300 justify-center rounded-lg py-2 hover:cursor-pointer"
                    onClick={() => {
                      router.push("/cadastro?tipo=criancas");
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

            {loading && (
              <p className="text-white text-sm mt-2">Carregando...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
