"use client";

import CustomInput from "@/components/CustomInput";
import { useCustomAlert } from "@/contexts/AlertContext";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChildWithProgress } from "@/types/child";
import { useGetData } from "@/hooks/useGetData";
import Image from "next/image";
import DatePickerBR from "@/components/DatePickerBR";
import BtnSelectPicture from "@/components/BtnSelectPicture";

export default function CadastroCrianca() {
  const router = useRouter();

  const { request } = useApi();
  const { getChildData } = useGetData();
  const { showAlert } = useCustomAlert();

  const [childData, setChildData] = useState<Partial<ChildWithProgress>>({
    profilePicture: "",
    username: "",
    password: "",
    name: "",
    birthDate: null,
  });

  const optionImages = [
    "aliens",
    "animals",
    "dinosaurs",
    "games",
    "super-heroes",
    "others",
  ];

  const [selectedInput, setSelectedInput] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!childData.username || !childData.name || !childData.password) {
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao editar usuário!",
        message: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const result = await request({
      endpoint: `/api/parents/children`,
      method: "POST",
      body: { ...childData },
    });

    if (result && !result.error) {
      getChildData();
      showAlert({
        icon: "/icons/successpng",
        title: "Dependente cadastrado com sucesso!",
        message: "Cadastro realizado com sucesso!",
        onClose: () => router.refresh(),
      });
    } else {
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao cadastrar o dependente!",
        message:
          result.message ||
          "Ocorreu um erro cadastrar o dependente. Verifique se os dados estão preenchidos corretamente",
      });
    }
  };

  return (
      <div className="flex flex-col px-20 py-12 gap-16">
        <div>
          <h1 className="font-bold text-xl bg-linear-to-b from-[#519ebf] to-[#9c5869] bg-clip-text text-transparent">
            Formulario de cadastro de dependente
          </h1>
          <hr />
        </div>
        <div className="flex w-full h-screen justify-center px-14 gap-20 overflow-hidden">
          <div className="flex flex-col items-center gap-4">
            <BtnSelectPicture
              type="add"
              variant="dark"
              image={childData?.profilePicture || ""}
              onChange={(novaImagem: string | null) =>
                setChildData({ ...childData, profilePicture: novaImagem })
              }
            />

            <div className="flex flex-col gap-3">
              <CustomInput
                label="Usuário"
                value={childData.username}
                onChange={(e) =>
                  setChildData({ ...childData, username: e.target.value })
                }
                selected={selectedInput === "usuario"}
                onClick={() => setSelectedInput("usuario")}
              />

              <CustomInput
                label="Senha"
                value={childData.password}
                onChange={(e) =>
                  setChildData({ ...childData, password: e.target.value })
                }
                selected={selectedInput === "senha"}
                onClick={() => setSelectedInput("senha")}
              />

              <CustomInput
                label="Nome"
                value={childData.name || ""}
                onChange={(e) =>
                  setChildData({ ...childData, name: e.target.value })
                }
                selected={selectedInput === "nome"}
                onClick={() => setSelectedInput("nome")}
              />
              <div className="flex items-center justify-between px-2 pr-8 py-2 w-full h-16 border border-zinc-200 rounded-md shadow-[0_0_4px_rgba(150,150,150,0.3)]">
                <DatePickerBR
                  variant="dark"
                  value={null}
                  onChange={(novaData) =>
                    setChildData({ ...childData, birthDate: novaData })
                  }
                />
                <Image
                  src="/icons/calendar.png"
                  alt="Calendar Icon"
                  width={32}
                  height={32}
                  style={{
                    filter: "brightness(1) invert(1)",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="w-1 h-2/3 bg-[#bbbbbb] rounded-lg" />

          <div className="flex flex-col w-2/5 gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="font-bold text-xl text-[#4c4c4c]">
                Com qual dessas criaturas seu filho mais se familiariza
              </h1>
              <span className="text-[#4c4c4c]">
                Selecione pelo menos uma criatura
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {optionImages.map((image, index) => (
                <Image
                  key={index}
                  src={`/images/child-options/${image}.png`}
                  width={200}
                  height={200}
                  alt="option"
                />
              ))}
            </div>
            <button
              type="button"
              className="w-full p-3 bg-[#80D25B] rounded-lg"
              onClick={handleRegister}
            >
              <span className="font-bold text-sm text-white">
                Cadastrar filho
              </span>
            </button>
          </div>
        </div>
      </div>
  );
}
