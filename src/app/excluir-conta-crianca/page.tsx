"use client";

import NavbarLogin from "@/components/NavbarLogin";

export default function Conta() {
  return (
    <div className="flex h-screen overflow-hidden">
      <NavbarLogin />

      <main className="flex-1 flex items-center justify-center bg-white text-zinc-800">
        <div className="flex flex-col w-1/2 items-center justify-center rounded-md p-8 gap-8">
          <span className="text-2xl font-bold">SOLICITAR EXCLUSÃO DA CONTA</span>
          <p className="text-xl text-justify">
            Somente os pais ou responsáveis legais podem excluir ou solicitar a exclusão das contas utilizadas pelas crianças no aplicativo Learny.
            Para excluir uma conta, faça login no painel ou envie um e-mail para <span className="underline text-sky-700 mr-2">joao.kirimis@gmail.com</span>
            a partir do mesmo e-mail usado para criar a conta.
            No caso de envio de email, o pedido será atendido em até 7 dias úteis.
            Nenhum dado pessoal da criança será mantido após a exclusão definitiva.
            </p>

          <a 
              className="text-xl underline text-red-600"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=joao.kirimis@gmail.com&su=Solicitação%20de%20Exclusão%20de%20Conta&body=Olá,%0D%0DQuero solicitar a exclusão da conta do meu filho.&ui=2" target="_blank">
              Enviar Solicitação
            </a>
        </div>
      </main>
    </div>
  );
}
