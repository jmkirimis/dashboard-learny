"use client";

import XPBar from "@/components/XPBar";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import GradientSwitch from "@/components/GradientSwitch";
import { useCustomAlert } from "@/contexts/AlertContext";
import { useApi } from "@/hooks/useApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { ChildWithProgress } from "@/types/child";
import { useUser } from "@/contexts/UserContext";
import { useGetData } from "@/hooks/useGetData";
import BtnSelectPicture from "@/components/BtnSelectPicture";

export default function Perfil() {
  const router = useRouter();
  const { id } = useParams();

  const { loading, request } = useApi();
  const { child } = useUser();
  const { getChildData } = useGetData();
  const { showAlert } = useCustomAlert();

  const [childData, setChildData] = useState<Partial<ChildWithProgress>>({
    profilePicture: child?.profilePicture || "",
    username: child?.username || "",
    name: child?.name || "",
    points: child?.points || 0,
    audioActive: child?.audioActive || null,
    rankingActive: child?.rankingActive || null,
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [selectedInput, setSelectedInput] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(false);

  const levelData = child && getLevelFromXp(child.points);
  const progressPercentage = levelData
    ? (levelData.currentLevelXp / levelData.xpToNextLevel) * 100
    : 0;

  function getLevelFromXp(totalXp: number) {
    let level = 1;

    let accumulatedXp = 0;

    while (true) {
      const xpToNext = Math.floor(80 + 35 * Math.pow(level, 1.28));

      if (accumulatedXp + xpToNext > totalXp) {
        break;
      }

      accumulatedXp += xpToNext;

      level++;
    }

    return {
      level,
      currentLevelXp: totalXp - accumulatedXp,
      xpToNextLevel: Math.floor(80 + 35 * Math.pow(level, 1.28)),
    };
  }

  const handleEdit = async (data = childData) => {
    if (!data.username || !data.name) {
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao editar usuário!",
        message: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    let profilePicture = data.profilePicture || "";

    if (selectedImageFile) {
      const formData = new FormData();
      formData.append("file", selectedImageFile);

      const uploadResult = await request({
        endpoint: "/api/upload",
        method: "POST",
        body: formData,
        hasHeaders: true,
      });

      if (!uploadResult || uploadResult.error) {
        showAlert({
          icon: "/icons/error.png",
          title: "Erro ao enviar imagem!",
          message:
            uploadResult?.message ||
            "Ocorreu um erro ao enviar a imagem para o servidor",
        });
        return;
      }

      profilePicture = uploadResult.url;
      setChildData({ ...data, profilePicture });
      setSelectedImageFile(null);
      setImagePreview(null);
    }

    const body = {
      ...data,
      profilePicture,
      ...(newPassword !== "" && { password: newPassword }),
    };

    const result = await request({
      endpoint: `/api/parents/child/${id}`,
      method: "PUT",
      body,
    });

    if (result && !result.error) {
      getChildData();
      showAlert({
        icon: "/icons/success.png",
        title: "Usuário editado com sucesso!",
        message:
          "Edição realizado com sucesso. Aguarde a atualização dos dados na tela.",
        onClose: () => router.refresh(),
      });
    } else {
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao editar o usuário!",
        message:
          result.message ||
          "Ocorreu um erro ao editar o usuário. Verifique se os dados estão preenchidos corretamente",
      });
    }
  };

  const handleDelete = async () => {
    console.log("entrou aqui")
    const result = await request({
      endpoint: `/api/parents/child/${id}`,
      method: "DELETE",
    });
    if (result.status == 204 && !result.error) {
      getChildData();
      showAlert({
        icon: "/icons/success.png",
        title: "Conta excluída com sucesso.",
        message:
          "Conta excluída com sucesso. Redirecionando para a página inicial.",
        onClose: () => router.push("/"),
      });
      return;
    } else {
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao excluir conta!",
        message:
          result.message ||
          "Ocorreu um erro ao excluir sua conta. Aguarde um pouco e tente novamente.",
      });
    }
  };

  useEffect(() => {
    setChildData({
      profilePicture: child?.profilePicture || "",
      username: child?.username || "",
      name: child?.name || "",
      points: child?.points || 0,
      audioActive: child?.audioActive || null,
      rankingActive: child?.rankingActive || null,
    });
  }, [child]);

  const SwitchRanking = () => {
    return (
      <div className="flex items-center w-full h-14 rounded-full bg-linear-to-r from-[#8f6579] to-[#519ebf] shadow-sm p-1">
        <button
          className={`flex ${
            childData.rankingActive
              ? "flex-row-reverse justify-start bg-transparent"
              : "bg-white"
          } items-center w-full h-12 rounded-full gap-4 transition-all duration-300 ease-in-out pr-1 hover:cursor-pointer`}
          onClick={async () => {
            const newRankingActive = !childData.rankingActive;

            setChildData({
              ...childData,
              rankingActive: newRankingActive,
            });

            handleEdit({
              ...childData,
              rankingActive: newRankingActive,
            });
          }}
        >
          <div
            className={`${
              childData.rankingActive
                ? "w-8 h-8 mb-1"
                : "w-14 h-14 ml-[-0.5vw] mb-[-0.5vh]"
            } bg-contain bg-no-repeat bg-center`}
            style={{
              backgroundImage: `url(/icons/${
                childData.rankingActive ? "ranking.png" : "ranking-gradient.png"
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
        <div className="flex w-full h-screen items-center justify-center px-14 gap-20 overflow-hidden">
          <div className="flex flex-col w-1/3 gap-4">
            <div className={`flex relative items-center gap-4`}>
              <BtnSelectPicture
                type="edit"
                image={imagePreview || childData?.profilePicture || ""}
                onChange={(file, preview) => {
                  setSelectedImageFile(file);
                  setImagePreview(preview || null);
                }}
              />
              <div className="flex flex-col gap-1">
                <span className="font-bold text-2xl bg-linear-to-r from-[#d47489] to-[#7dc3ec] bg-clip-text text-transparent">
                  {childData.name}
                </span>
                <span className="text-[#4c4c4c]">
                  Lv.{" "}
                  <span className="font-bold text-lg">{levelData?.level}</span>
                </span>
              </div>
              {modalOpen ? (
                <div
                  className="flex flex-col absolute right-0 top-0 items-end w-[55%] py-2 px-3 gap-2 bg-white shadow-[0_0_4px_rgba(150,150,150,0.3)]"
                  onClick={() => setModalOpen(!modalOpen)}
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
                  onClick={() => setModalOpen(!modalOpen)}
                >
                  <BsThreeDots
                    size={30}
                    color="#4c4c4c"
                    className="hover:cursor-pointer"
                  />
                </div>
              )}
            </div>

            <XPBar
              progress={progressPercentage}
              xp={levelData?.currentLevelXp}
              toNext={levelData?.xpToNextLevel}
            />

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
                type="password"
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
                    icon="pencil.png"
                    text="Alterar Perfil"
                    color="#FFB300"
                    onClick={() => setEditando(!editando)}
                  />
                ) : (
                  <div className="w-full flex justify-between gap-4">
                    <CustomButton
                      icon="confirm.png"
                      text="Confirmar"
                      color="#80D25B"
                      onClick={() => {
                        handleEdit();
                      }}
                    />
                    <CustomButton
                      icon="cancel.png"
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
                <div className="w-10 h-10 bg-[url('/icons/acessibility.png')] bg-contain bg-no-repeat" />
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
                    enabled={childData.audioActive}
                    onClick={async () => {
                      const newAudioActive = !childData.audioActive;

                      setChildData({
                        ...childData,
                        audioActive: newAudioActive,
                      });

                      handleEdit({
                        ...childData,
                        audioActive: newAudioActive,
                      });
                    }}
                  />
                </div>

                <div className="flex w-full items-center justify-between">
                  <span className="font-medium text-zinc-400">Mudar cores</span>
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
      );
}
