"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { ChildWithProgress } from "@/types/child";

type UserContextType = {
  user: User | null;
  child: ChildWithProgress | null;
  setUser: (user: User | null) => void;
  setChild: (child: ChildWithProgress | null) => void;
  logout: (options?: { silent?: boolean }) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Valida o formato mínimo esperado dos dados de usuário salvos no localStorage.
// Se o objeto não bater com o shape esperado, é tratado como dado corrompido/conflitante.
function isValidUser(value: unknown): value is User {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  // O usuário salvo no contexto vem de /api/parents, que não retorna `type`.
  // Validar só os campos que de fato existem evita derrubar a sessão no refresh.
  return (
    typeof candidate.username === "string" &&
    typeof candidate.name === "string"
  );
}

export function UserProvider({ children }: { children: ReactNode; }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [child, setChild] = useState<ChildWithProgress | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Confirma logout
  const confirmLogout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST" });

    setUser(null);
    setShowLogoutModal(false);
    router.replace("/");
  }, [router]);

  // Abre modal
  const logout = useCallback(
    (options?: { silent?: boolean }) => {
      if (options?.silent) {
        confirmLogout();
      } else {
        setShowLogoutModal(true);
      }
    },
    [confirmLogout],
  );

  // Cancela logout
  const cancelLogout = useCallback(() => {
    setShowLogoutModal(false);
  }, []);

  // Limpa qualquer vestígio de sessão (cookie + localStorage) e volta para o login.
  // Usado quando os dados do localStorage entram em conflito/corrupção.
  const clearCorruptedSession = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("child");
    // Limpa o cookie httpOnly no servidor
    fetch("/api/logout", { method: "POST" }).catch(() => {});
    setUser(null);
    setChild(null);
    router.replace("/");
  }, [router]);

  // Recupera usuário e criança salvos (ex: após refresh)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedChild = localStorage.getItem("child");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (!isValidUser(parsedUser)) {
          throw new Error("Dados de usuário em formato inválido");
        }
        setUser(parsedUser);
      }

      // A criança é opcional; só falha se o JSON estiver corrompido
      if (storedChild) {
        setChild(JSON.parse(storedChild));
      }
    } catch (err) {
      console.error(
        "Conflito nos dados de sessão (localStorage). Encerrando sessão e redirecionando para login.",
        err,
      );
      clearCorruptedSession();
    }
  }, [clearCorruptedSession]);

  // Salva usuário no localStorage quando mudar
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Salva criança no localStorage quando mudar
  useEffect(() => {
    if (child) localStorage.setItem("child", JSON.stringify(child));
    else localStorage.removeItem("child");
  }, [child]);

  const value = useMemo(
    () => ({ user, child, setUser, setChild, logout }),
    [user, child, logout],
  );

  return (
    <UserContext.Provider value={value}>
      {children}

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-88">
            <h2 className="text-lg font-semibold mb-4 text-zinc-600">
              Deseja realmente sair?
            </h2>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded-lg border border-zinc-600 text-zinc-600 hover:bg-gray-100 hover:cursor-pointer transition"
              >
                Cancelar
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve ser usado dentro de um UserProvider");
  return context;
}
