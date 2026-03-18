"use client";

import CustomInput from "@/components/CustomInput";
import DatePickerBR from "@/components/DatePickerBR";
import Navbar from "@/components/Navbar/Navbar";
import NavbarLogin from "@/components/Navbar/NavbarLogin";
import { useCustomAlert } from "@/contexts/AlertContext";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { JSX, useState } from "react";
import { BodyRegisterType } from "@/types";
import ProgressLine from "@/components/ProgressLine";
import BtnPaginate from "@/components/BtnPaginate";
import Loading from "../loading";
import BtnSelectPicture from "@/components/BtnSelectPicture";

export default function Cadastro() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { loading, request } = useApi();
  const { showAlert } = useCustomAlert();

  const [data, setData] = useState<BodyRegisterType>({
    profilePicture: "",
    username: "",
    password: "",
    name: "",
    email: "",
    birthDate: null,
  });

  const [step, setStep] = useState(1);
  const type = searchParams.get("tipo");

  const handleCadastro = async () => {
    if (!data.username || !data.password || !data.name || !data.birthDate) {
      showAlert({
        icon: "/icons/erro.png",
        title: "Erro ao fazer cadastro!",
        message: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const rotaCadastro = type === "pais" ? "/api/parents" : "/api/children";

    const body: BodyRegisterType = {
      profilePicture: data?.profilePicture?.trim() || null,
      username: data.username.trim(),
      password: data.password.trim(),
      name: data.name.trim(),
      birthDate: data.birthDate,
    };

    if (type === "pais") {
      body.email = data.email?.trim();
    }

    const result = await request({
      endpoint: rotaCadastro,
      method: "POST",
      body: body,
    });

    if (result && !result.error) {
      showAlert({
        icon: "/icons/sucesso.png",
        title: "Usuário cadastrado com sucesso!",
        message: "Cadastro realizado com sucesso. Faça o login usufrua do aplicativo!",
      });
    } else {
      showAlert({
        icon: "/icons/erro.png",
        title: "Erro ao cadastrar usuário!",
        message: result.message || "Ocorreu um erro ao cadastrar o usuário",
      });
    }
  };

  const stepsComponents: Record<number, JSX.Element> = {
    1: (
      <div className="flex flex-col items-center justify-center w-[50%] h-full gap-8">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">Bem vindo (a) ao</span>
          <span className="text-3xl font-bold">LEARNY</span>
        </div>
        <Image
          src="/images/logo-grande.png"
          alt="Logo"
          width={150}
          height={150}
        />
        <span className="text-center">
          Facilitando o processo de aprendizagem para crianças <br />
          diagnosticadas com transtorno do espectro autista
        </span>
      </div>
    ),
    2: (
      <div className="flex flex-col items-center justify-center w-[50%] h-full">
        <BtnSelectPicture
          type="add"
          image={data.profilePicture}
          onChange={(novaImagem: string | null) =>
            setData({ ...data, profilePicture: novaImagem })
          }
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
          {type == "pais" && (
            <CustomInput
              label="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              transparent
            />
          )}
          <CustomInput
            label="Nome"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            transparent
          />
          <div className="flex items-center justify-between px-2 pr-8 py-2 w-full h-16 bg-[rgba(255,255,255,0.3)] rounded-md">
            <DatePickerBR
              value={data.birthDate}
              onChange={(novaData) => setData({ ...data, birthDate: novaData })}
            />
            <Image
              src="/icons/calendario.png"
              alt="Calendar Icon"
              width={32}
              height={32}
            />
          </div>
        </div>
      </div>
    ),
    3: (
      <div className="flex flex-col items-center justify-center w-[50%] h-full gap-8">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">Cadastro concluido com sucesso</span>
        </div>
        <Image src="/images/elefante.png" alt="Logo" width={150} height={150} />
      </div>
    ),
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {type == "pais" ? <NavbarLogin /> : <Navbar />}

      <main className="flex-1 flex flex-col bg-white text-zinc-800">
        <div className="flex flex-col flex-1 py-6 px-14 gap-4 overflow-hidden">
          {/* Linha de progreso do cadastro */}
          <ProgressLine step={step} />

          {/* Cadastro */}
          <div className="flex-1 flex bg-[url('/images/fundo-gradiente-login.png')] justify-between items-center p-8 gap-2 rounded-md text-white overflow-hidden">
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
                  step == 3 && type == "pais"
                    ? "Login"
                    : step == 3 && type != "pais"
                      ? "Finalizar"
                      : step == 2
                        ? "Confirmar"
                        : "Avançar"
                }`}
                onClick={() => {
                  if (step < 3) setStep(step + 1);
                  if (step == 2) handleCadastro();
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
