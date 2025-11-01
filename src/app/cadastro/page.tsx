"use client";

import BtnSelecionaFoto from "@/components/BtnSelecionaFoto";
import CustomInput from "@/components/CustomInput";
import DatePickerBR from "@/components/DatePickerBR";
import Navbar from "@/components/Navbar";
import NavbarLogin from "@/components/NavbarLogin";
import { useCustomAlert } from "@/contexts/AlertContext";
import { useChild } from "@/contexts/ChildContext";
import { useApi } from "@/hooks/useApi";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { JSX, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type LinhaProgressoProps = {
  step: number;
};

type BtnPaginacaoProps = {
  text: string;
  onClick?: () => void;
};

type BodyType = {
  foto?: string;
  usuario: string;
  senha: string;
  nome: string;
  dataNasc: Dayjs | null;
  email?: string;
};

const LinhaProgresso = ({ step }: LinhaProgressoProps) => {
  const steps = [
    "Tela inicial",
    "Saudação",
    "Cadastro",
    "Confirmação",
    "Login",
  ];

  return (
    <div className="flex relative flex-col justify-center items w-full h-28 px-12 gap-2 bg-[#4c4c4c] rounded-md text-white shrink-0">
      <Image
        src="/images/logo-com-contorno.png"
        alt="Criança"
        width={48}
        height={48}
        className="absolute right-0 top-0"
      />

      <div className="flex items-center justify-between relative w-4/5 mx-auto">
        {/* Linha de fundo */}
        <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-500 -translate-y-1/2"></div>

        {/* Etapas */}
        {steps.map((item, index) => (
          <div key={item} className="flex flex-col items-center relative z-10">
            {/* Bolinha */}
            <div
              className={`w-2.5 h-2.5 rounded-full absolute top-1/4 -translate-y-1/2 ${
                index <= step ? "bg-white" : "bg-gray-400"
              }`}
            ></div>

            {/* Texto */}
            <span
              className={`mt-6 text-md ${
                index === step ? "text-white font-semibold" : "text-gray-300"
              }`}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BtnPaginacao = ({ text, onClick }: BtnPaginacaoProps) => {
  return (
    <button
      className="flex flex-col items-center gap-4 hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-center p-4 rounded-full bg-[rgba(255,255,255,0.3)]">
        {text == "Retornar" || text == "Cadastrar Novamente" ? (
          <FaArrowLeft size={18} />
        ) : (
          <FaArrowRight size={18} />
        )}
      </div>
      <span>{text}</span>
    </button>
  );
};

const LoadingComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center w-[50%] h-full">
      <Image
        src="/gifs/loading.gif"
        alt="Loading"
        width={250}
        height={250}
        unoptimized // muito importante para GIFs animados
      />
    </div>
  );
};

export default function Cadastro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, request } = useApi();
  const { showAlert } = useCustomAlert();
  const { setChild } = useChild();
  const tipo = searchParams.get("tipo");
  const [foto, setFoto] = useState<string | null>("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [dataNasc, setDataNasc] = useState<Dayjs | null>(dayjs());;
  const [step, setStep] = useState(1);

  const handleCadastro = async () => {
    if (!usuario || !senha) {
      showAlert({
        icon:"/icons/erro.png",
        title: "Erro ao fazer cadastro!",
        message: "Por favor, preencha todos os campos obrigatórios.",
      })
      return;
    }

    const rotaCadastro = tipo === "pais" ? "/api/pais" : "/api/criancas";

    const body: BodyType = {
      foto: foto?.trim(),
      usuario: usuario.trim(),
      senha: senha.trim(),
      nome: nome.trim(),
      dataNasc,
    };

    if (tipo === "pais") {
      body.email = email.trim();
    }

    const result = await request({
      endpoint: rotaCadastro,
      method: "POST",
      body: body,
    })

    if (result && !result.error) {
      if (rotaCadastro == "/api/criancas") {
        setChild({
          foto: result.foto,
          usuario: result.usuario,
          nome: result.nome,
          pontos: result.pontos,
          fasesConcluidas: result.fasesConcluidas,
          medalhas: result.medalhas,
        });
      }
      showAlert({
          icon: "/icons/sucesso.png",
          title: "Usuário cadastrado com sucesso!",
          message: "Cadastro realizado com sucesso. Faça o login usufrua do aplicativo!",
        })
    } else {
      showAlert({
          icon: "/icons/erro.png",
          title: "Erro ao cadastrar usuário!",
          message: result.message || "Ocorreu um erro ao cadastrar o usuário",
        })
    }
  }

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
        <BtnSelecionaFoto
            type="add"
            image={foto}
            onChange={(novaImagem: string | null) => setFoto(novaImagem)}
          />
        <div className="flex flex-col w-4/5 gap-3">
          <CustomInput label="Usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)} transparent />
          <CustomInput label="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} isPassword transparent />
          <CustomInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} transparent />
          <CustomInput label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} transparent />
          <div className="flex items-center justify-between px-2 pr-8 py-2 w-full h-16 bg-[rgba(255,255,255,0.3)] rounded-md">
            <DatePickerBR value={dataNasc} onChange={(novaData) => setDataNasc(novaData)} />
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
      {tipo == "pais" ? <NavbarLogin /> : <Navbar />}
      
      <main className="flex-1 flex flex-col bg-white text-zinc-800">
        <div className="flex flex-col flex-1 py-6 px-14 gap-4 overflow-hidden">
          {/* Linha de progreso do cadastro */}
          <LinhaProgresso step={step} />

          {/* Cadastro */}
          <div className="flex-1 flex bg-[url('/images/fundo-gradiente-login.png')] justify-between items-center p-8 gap-2 rounded-md text-white overflow-hidden">
            <div className="flex flex-col items-center justify-center px-30 pt-18 gap-2 w-[25%] h-full rounded-md p-8">
              {step > 1 && (
                <BtnPaginacao
                  text={`${step == 3 ? "Cadastrar Novamente" : "Retornar"}`}
                  onClick={() => setStep(step - 1)}
                />
              )}
            </div>

            {loading ? <LoadingComponent /> : stepsComponents[step]}

            <div className="flex flex-col items-center justify-center px-30 pt-18 gap-2 w-[25%] h-full rounded-md p-8">
              <BtnPaginacao
                text={`${
                  step == 3 && tipo == "pais" ? "Login" : step == 3 && tipo != "pais" ? "Finalizar" : step == 2 ? "Confirmar" : "Avançar"
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
