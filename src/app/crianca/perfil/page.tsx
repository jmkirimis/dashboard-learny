"use client";

import BarraXP from "@/components/BarraXP";
import BtnSelecionaFoto from "@/components/BtnSelecionaFoto";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import GradientSwitch from "@/components/GradientSwitch";
import Navbar from "@/components/Navbar";
import { useCustomAlert } from "@/contexts/AlertContext";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { Child } from "../../../../types";

export default function Perfil() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { request } = useApi();
  const { showAlert } = useCustomAlert();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [childData, setChildData] = useState<Child>({
    profilePicture: "",
    username: "",
    name: "",
    points: 0,
    audio: null,
    phasesCompleted: null,
    medals: null,
    rankingActive: null,
  });
  const [newPassword, setNewPassword] = useState("");
  const [selectedInput, setSelectedInput] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [erroFetch, setErroFetch] = useState(false);

  const handleEdit = async () => {
    if (!childData.username || !childData.name) {
      showAlert({
        icon: "/icons/erro.png",
        title: "Erro ao editar usuário!",
        message: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const result = await request({
      endpoint: `/api/child/${id}`,
      method: "PUT",
      body: { ...childData, password: newPassword },
    });

    if (result && !result.error) {
      showAlert({
        icon: "/icons/sucesso.png",
        title: "Usuário editado com sucesso!",
        message:
          "Edição realizado com sucesso. Aguarde a atualização dos dados na tela.",
        onClose: () => router.refresh(),
      });
    } else {
      showAlert({
        icon: "/icons/erro.png",
        title: "Erro ao editar o usuário!",
        message:
          result.message ||
          "Ocorreu um erro ao editar o usuário. Verifique se os dados estão preenchidos corretamente",
      });
    }
  };

  const handleDelete = async () => {
    const result = await request({
      endpoint: `/api/child/${id}`,
      method: "DELETE",
    });
    if (result && !result.error) {
      showAlert({
        icon: "/icons/sucesso.png",
        title: "Conta excluída com sucesso.",
        message:
          "Conta excluída com sucesso. Redirecionando para a página de login.",
        onClose: () => router.push("/"),
      });
      return;
    } else {
      showAlert({
        icon: "/icons/erro.png",
        title: "Erro ao excluir conta!",
        message:
          result.message ||
          "Ocorreu um erro ao excluir sua conta. Aguarde um pouco e tente novamente.",
      });
    }
  };

  const handleChangeStatus = async (
    type: "ranking" | "audio",
    value: boolean,
  ) => {
    // Monta o corpo do fetch com os valores atuais, substituindo o tipo que mudou
    const body = {
      ranking: type === "ranking" ? value : childData.rankingActive,
      audio: type === "audio" ? value : childData.audio,
    };

    const result = await request({
      endpoint: `/api/child/${id}/status`,
      method: "PUT",
      body: body,
    });

    if (result && !result.error) {
      if (type === "ranking")
        setChildData({ ...childData, rankingActive: value });
      if (type === "audio") setChildData({ ...childData, audio: value });
    } else {
      showAlert({
        icon: "/icons/erro.png",
        title: "Erro ao editar o status!",
        message: result.message || "Ocorreu um erro ao editar o status",
      });
    }
  };

  useEffect(() => {
    if (!id || erroFetch) return;

    const fetchFilho = async () => {
      setLoading(true);
      const result = await request({
        endpoint: `/api/child/${id}`,
        method: "GET",
      });

      if (result && !result.error) {
        setChildData({
          profilePicture: result.profilePicture,
          username: result.username,
          name: result.name,
          points: result.points,
          audio: result.audio,
          rankingActive: result.rankingActive,
          phasesCompleted: result.phasesCompleted ?? null,
          medals: result.medalhas ?? null,
        });
      } else {
        if (result.status === 404) return;
        setErroFetch(true);
        showAlert({
          icon: "/icons/erro.png",
          title: "Erro ao buscar filho!",
          message: result.message || "Erro desconhecido ao carregar filho",
        });
      }
      setLoading(false);
    };

    fetchFilho();
  }, [id, showAlert, erroFetch]);

  const SwitchRanking = () => {
    return (
      <div className="flex items-center w-full h-14 rounded-full bg-linear-to-r from-[#8f6579] to-[#519ebf] shadow-sm p-1">
        <button
          className={`flex ${
            childData.rankingActive
              ? "flex-row-reverse justify-start bg-transparent"
              : "bg-white"
          } items-center w-full h-12 rounded-full gap-4 transition-all duration-300 ease-in-out pr-1 hover:cursor-pointer`}
          onClick={() =>
            handleChangeStatus("ranking", !childData.rankingActive)
          }
        >
          <div
            className={`${
              childData.rankingActive
                ? "w-8 h-8 mb-1"
                : "w-14 h-14 ml-[-0.5vw] mb-[-0.5vh]"
            } bg-contain bg-no-repeat bg-center`}
            style={{
              backgroundImage: `url(/icons/${
                childData.rankingActive ? "ranking.png" : "ranking-circulo.png"
              })`,
            }}
          />
          <div className="flex flex-col leading-tight">
            <span
              className={`text-xs ${childData.rankingActive ? "text-white" : "text-gray-500"}`}
            >
              Rankeamento
            </span>
            <span
              className={`text-sm font-semibold ${
                childData.rankingActive ? "text-white" : "text-gray-800"
              }`}
            >
              {childData.rankingActive ? "Habilitado" : "Desabilitado"}
            </span>
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />

      {/* Logo */}
      <Image
        src="/images/logo-com-contorno.png"
        alt="Logo"
        width={60}
        height={60}
        className="absolute right-14 top-6"
      />

      <main className="flex-1 flex flex-col bg-white py-6 text-zinc-800 font-montserrat">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Image
              src="/gifs/loading.gif"
              alt="Loading"
              width={200}
              height={200}
              unoptimized
            />
          </div>
        ) : (
          <div className="flex w-full h-screen items-center justify-center px-14 gap-20 overflow-hidden">
            <div className="flex flex-col w-1/3 gap-4">
              <div className={`flex relative items-center gap-4`}>
                <BtnSelecionaFoto
                  type="edit"
                  image={childData.profilePicture}
                  onChange={(novaImagem: string | null) =>
                    setChildData({ ...childData, profilePicture: novaImagem })
                  }
                />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-2xl bg-linear-to-r from-[#d47489] to-[#7dc3ec] bg-clip-text text-transparent">
                    {childData.name}
                  </span>
                  <span className="text-[#4c4c4c]">
                    Lv.{" "}
                    <span className="font-bold text-lg">
                      {Math.floor(childData.points / 100)}
                    </span>
                  </span>
                </div>
                {modalAberto ? (
                  <div
                    className="flex flex-col absolute right-0 top-0 items-end w-[55%] py-2 px-3 gap-2 bg-white shadow-[0_0_4px_rgba(150,150,150,0.3)]"
                    onClick={() => setModalAberto(!modalAberto)}
                  >
                    <IoMdClose
                      size={30}
                      className="text-[#4c4c4c] hover:cursor-pointer rounded-lg hover:bg-[#ededed]"
                    />
                    <CustomButton
                      text="Excluir Perfil"
                      color="#4c4c4c"
                      onClick={handleDelete}
                    />
                  </div>
                ) : (
                  <div
                    className=" absolute right-0 top-0 py-2 px-3"
                    onClick={() => setModalAberto(!modalAberto)}
                  >
                    <BsThreeDots
                      size={30}
                      color="#4c4c4c"
                      className="hover:cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <BarraXP pontos={childData.points} />

              <div className="flex flex-col gap-3">
                <CustomInput
                  label="Usuário"
                  value={childData.username}
                  onChange={(e) =>
                    setChildData({ ...childData, username: e.target.value })
                  }
                  disabled={!editando}
                  selected={selectedInput === "usuario"}
                  onClick={() => setSelectedInput("usuario")}
                />

                <CustomInput
                  label="Senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={!editando}
                  selected={selectedInput === "senha"}
                  onClick={() => setSelectedInput("senha")}
                />

                <CustomInput
                  label="Nome"
                  value={childData.name || ""}
                  onChange={(e) =>
                    setChildData({ ...childData, name: e.target.value })
                  }
                  disabled={!editando}
                  selected={selectedInput === "nome"}
                  onClick={() => setSelectedInput("nome")}
                />
                <div className="flex">
                  {!editando ? (
                    <CustomButton
                      icon="lapis.png"
                      text="Alterar Perfil"
                      color="#FFB300"
                      onClick={() => setEditando(!editando)}
                    />
                  ) : (
                    <div className="w-full flex justify-between gap-4">
                      <CustomButton
                        icon="confirmar.png"
                        text="Confirmar"
                        color="#80D25B"
                        onClick={() => {
                          handleEdit();
                        }}
                      />
                      <CustomButton
                        icon="cancelar.png"
                        text="Cancelar"
                        color="#C92939"
                        onClick={() => {
                          setEditando(!editando);
                          setSelectedInput("");
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col w-2/5 items-center">
              <div className="w-2/3">
                <SwitchRanking />
              </div>
              <div className="flex flex-col w-full rounded-2xl px-6 py-12 mt-12 gap-4 items-center justify-center bg-white shadow-[0_0_6px_rgba(150,150,150,0.6)]">
                <div className="flex w-4/5 gap-4 items-center mb-6">
                  <div className="w-10 h-10 bg-[url('/icons/acessibilidade.png')] bg-contain bg-no-repeat" />
                  <span className="font-bold bg-linear-to-r from-[#8f6579] to-[#519ebf] bg-clip-text text-transparent">
                    Acessibilidade
                  </span>
                </div>
                <div className="flex w-4/5 flex-col gap-6">
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium text-zinc-400">
                      Desativar áudio
                    </span>
                    <GradientSwitch
                      enabled={childData.audio}
                      onClick={() =>
                        setChildData({ ...childData, audio: !childData.audio })
                      }
                    />
                  </div>

                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium text-zinc-400">
                      Mudar cores
                    </span>
                    <GradientSwitch />
                  </div>

                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium text-zinc-400">
                      Retirar animações
                    </span>
                    <GradientSwitch />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
