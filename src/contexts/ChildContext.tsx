"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "./UserContext";

type Child = {
  foto: string;
  usuario: string;
  nome: string;
  pontos: number,
  fasesConcluidas: number,
  medalhas: [],
};

type ChildContextType = {
  child: Child | null;
  setChild: (child: Child | null) => void;
};

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export function ChildProvider({ children }: { children: ReactNode }) {
  const [child, setChild] = useState<Child | null>(null);
  const { user } = useUser();

  // 🔁 Recupera criança salva (ex: após refresh)
  useEffect(() => {
    const storedChild = localStorage.getItem("child");
    if (storedChild) {
      setChild(JSON.parse(storedChild));
    }
  }, []);

  // 💾 Salva no localStorage quando mudar
  useEffect(() => {
    if (child) localStorage.setItem("child", JSON.stringify(child));
    else localStorage.removeItem("child");
  }, [child]);

  useEffect(() => {
    if (!user) {
      setChild(null); // limpa automaticamente quando o usuário some
    }
  }, [user]);

  return (
    <ChildContext.Provider value={{ child, setChild }}>
      {children}
    </ChildContext.Provider>
  );
}

export function useChild() {
  const context = useContext(ChildContext);
  if (!context) throw new Error("useChild deve ser usado dentro de um ChildProvider");
  return context;
}
