"use client";

import CustomInput from "@/components/CustomInput";
import DatePickerBR from "@/components/DatePickerBR";
import NavbarLogin from "@/components/Navbar/NavbarLogin";
import { useCustomAlert } from "@/contexts/AlertContext";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import ProgressLine from "@/components/ProgressLine";
import BtnPaginate from "@/components/BtnPaginate";
import Loading from "../loading";
import BtnSelectPicture from "@/components/BtnSelectPicture";
import { User } from "@/types/user";

export default function Cadastro() {
  const router = useRouter();

  const { loading, request } = useApi();
  const { showAlert } = useCustomAlert();

  const [data, setData] = useState<Partial<User>>({
    profilePicture: "",
    username: "",
    password: "",
    name: "",
    email: "",
    birthDate: null,
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [step, setStep] = useState(1);

  const handleRegister = async () => {
    if (!data.username || !data.password || !data.name || !data.birthDate) {
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao fazer cadastro!",
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
      setData({ ...data, profilePicture });
    }

    const result = await request({
      endpoint: "/api/parents",
      method: "POST",
      body: { ...data, profilePicture },
    });

    if (result && !result.error) {
      showAlert({
        icon: "/icons/success.png",
        title: "Usuário cadastrado com sucesso!",
        message:
          "Cadastro realizado com sucesso. Faça o login usufrua do aplicativo!",
      });
    } else {
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao cadastrar usuário!",
        message: result.message || "Ocorreu um erro ao cadastrar o usuário",
      });
    }
  };

  const stepsComponents: Record<number, JSX.Element> = {
    1: (
      <div
        className="
      flex flex-col items-center justify-center w-1/2
      py-20 rounded-lg
      gap-8 bg-[rgba(255,255,255,0.4)]
      "
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">Bem vindo (a) ao</span>
          <span className="text-3xl font-bold">LEARNY</span>
        </div>
        <Image
          src="/images/logo-big.png"
          alt="Logo"
          width={150}
          height={150}
        />
      </div>
    ),
    2: (
      <div className="flex flex-row w-full">
        <div className="flex flex-col absolute -ml-48 w-72 gap-3">
          <h1 className="font-bold text-3xl">Cadastre-se</h1>
          <span className="text-lg">
            Faça o seu cadastro inserindo seus dados
          </span>
        </div>
        <div className="flex flex-col items-center w-full h-full">
          <BtnSelectPicture
            type="add"
            image={imagePreview || data.profilePicture || ""}
            onChange={(file, preview) => {
              setSelectedImageFile(file);
              setImagePreview(preview || null);
            }}
          />
          <div className="flex flex-col w-4/5 gap-3">
            <CustomInput
              label="Usuário"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              transparent
            />
            <CustomInput
              label="Senha"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              isPassword
              transparent
            />
            <CustomInput
              label="Email"
              value={data.email || ""}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              transparent
            />
            <CustomInput
              label="Nome"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              transparent
            />
            <div className="flex items-center justify-between px-2 pr-8 py-2 w-full h-16 bg-[rgba(255,255,255,0.3)] rounded-md">
              <DatePickerBR
                value={data.birthDate || null}
                variant="dark"
                onChange={(novaData) =>
                  setData({ ...data, birthDate: novaData })
                }
              />
              <Image
                src="/icons/calendar.png"
                alt="Calendar Icon"
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    3: (
      <div
        className="
        flex flex-col items-center justify-center 
        rounded-lg
        bg-[rgba(255,255,255,0.4)] px-16 py-12
      "
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl font-bold">Sucesso</span>
          <span className="text-xl">
            Cadastro de responsável realizado com sucesso
          </span>
        </div>
        <div className="w-70 h-70 bg-[url('/images/elephant.png')] bg-cover bg-no-repeat" />
      </div>
    ),
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <NavbarLogin />

      <main className="flex-1 flex flex-col bg-white text-zinc-800">
        <div className="flex flex-col flex-1 py-6 px-14 gap-4 overflow-hidden">
          {/* Linha de progreso do cadastro */}
          <ProgressLine step={step} />

          {/* Cadastro */}
          <div className="flex-1 flex bg-[url('/images/bg-gradient.png')] justify-between items-center p-8 gap-2 rounded-md text-white overflow-hidden">
            <div className="flex flex-col items-center justify-center px-30 pt-18 gap-2 w-[25%] h-full rounded-md p-8">
              {step > 1 && (
                <BtnPaginate
                  text={`${step == 3 ? "Cadastrar Novamente" : "Retornar"}`}
                  onClick={() => setStep(step - 1)}
                />
              )}
            </div>

            {loading ? <Loading /> : stepsComponents[step]}

            <div className="flex flex-col items-center justify-center px-30 pt-18 gap-2 w-[25%] h-full rounded-md p-8">
              <BtnPaginate
                text={`${
                  step == 3 ? "Login" : step == 2 ? "Confirmar" : "Avançar"
                }`}
                onClick={() => {
                  if (step < 3) setStep(step + 1);
                  if (step == 2) handleRegister();
                  if (step == 3) router.push("/");
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
