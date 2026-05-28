"use client";

import XPBar from "@/components/XPBar";
import BtnSelecionaFoto from "@/components/BtnSelectPicture";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { useCustomAlert } from "@/contexts/AlertContext";
import { useUser } from "@/contexts/UserContext";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { User } from "@/types/user";

export default function Perfil() {
  const router = useRouter();

  const { user, logout } = useUser();



  const { request } = useApi();
  const { showAlert } = useCustomAlert();

  const [data, setData] = useState<Partial<User>>({
    profilePicture: user?.profilePicture || "",
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [selectedInput, setSelectedInput] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleEdit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.username || !data.name || !data.email) {
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao editar usuário!",
        message: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    if (!emailRegex.test(data.email)) {
      showAlert({
        icon: "/icons/error.png",
        title: "Email inválido!",
        message: "Digite um email válido no formato exemplo@email.com.",
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
      setData({ ...data, profilePicture });
      setSelectedImageFile(null);
      setImagePreview(null);
    }

    const body = {
      ...data,
      profilePicture,
      ...(newPassword !== "" && { password: newPassword }),
    };

    const result = await request({
      endpoint: `/api/parents/`,
      method: "PUT",
      body: body,
    });

    if (result && !result.error) {
      showAlert({
        icon: "/icons/success.png",
        title: "Usuário editado com sucesso!",
        message:
          "Edição realizada com sucesso. Redirecionando para login.",
        onClose: () => logout({silent: true}),
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
    const result = await request({
      endpoint: `/api/parents`,
      method: "DELETE",
    });
    if (result && !result.error) {
      showAlert({
        icon: "/icons/success.png",
        title: "Conta excluída com sucesso.",
        message:
          "Conta excluída com sucesso. Redirecionando para a página de login.",
        onClose: () => logout(),
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
    if (!user) return;

    setData({
      profilePicture: user?.profilePicture || "",
      username: user?.username || "",
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);

  return (
      <div className="flex w-full h-screen items-center justify-center px-14 gap-3 overflow-hidden">
        <div className="flex flex-col w-1/3 gap-4">
          <div className={`flex relative items-center gap-4`}>
            <BtnSelecionaFoto
              type="edit"
              image={imagePreview || user?.profilePicture || ""}
              onChange={(file, preview) => {
                setSelectedImageFile(file);
                setImagePreview(preview || null);
              }}
            />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-2xl bg-linear-to-r from-[#d47489] to-[#7dc3ec] bg-clip-text text-transparent">
                {user?.name}
              </span>
              <span className="text-[#4c4c4c]">{"You're a"}</span>
              <span className="font-bold text-lg bg-linear-to-r from-[#d47489] to-[#7dc3ec] bg-clip-text text-transparent">
                SUPER PARENT
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

          <XPBar progress={50} xp={50} toNext={100} />

          <div className="flex flex-col gap-3">
            <CustomInput
              label="Usuário"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              disabled={!editing}
              selected={selectedInput === "usuario"}
              onClick={() => setSelectedInput("usuario")}
            />

            <CustomInput
              label="Senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!editing}
              selected={selectedInput === "senha"}
              onClick={() => setSelectedInput("senha")}
            />

            <CustomInput
              label="Email"
              type="email"
              value={data.email || ""}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              disabled={!editing}
              selected={selectedInput === "email"}
              onClick={() => setSelectedInput("email")}
            />

            <CustomInput
              label="Nome"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              disabled={!editing}
              selected={selectedInput === "nome"}
              onClick={() => setSelectedInput("nome")}
            />
            <div className="flex">
              {!editing ? (
                <CustomButton
                  icon="pencil.png"
                  text="Alterar Perfil"
                  color="#FFB300"
                  onClick={() => setEditing(!editing)}
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
                      setEditing(!editing);
                      setSelectedInput("");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="ml-32 w-96 h-96 flex bg-[url('/images/super-parent.webp')] bg-contain bg-no-repeat" />
      </div>
  );
}
