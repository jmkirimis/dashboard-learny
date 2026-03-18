"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Child, User } from "@/types";

type UserContextType = {
  user: User | null;
  child: Child | null;
  setUser: (user: User | null) => void;
  setChild: (child: Child | null) => void;
  logout: (options?: { silent?: boolean }) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, initialUser }: { children: ReactNode; initialUser: User | null }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser);
  const [child, setChild] = useState<Child | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Abre modal
  const logout = (options?: { silent?: boolean }) => {
    if (options?.silent) {
      confirmLogout();
    } else {
      setShowLogoutModal(true);
    }
  };

  // Confirma logout
  const confirmLogout = async () => {
    await fetch("/api/logout", { method: "POST" });

    setUser(null);
    setShowLogoutModal(false);
    router.replace("/");
  };

  // Cancela logout
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Recupera criança salva (ex: após refresh)
  useEffect(() => {
    const storedChild = localStorage.getItem("child");
    if (storedChild) {
      setChild(JSON.parse(storedChild));
    }
  }, []);

  // Salva no localStorage quando mudar
  useEffect(() => {
    if (child) localStorage.setItem("child", JSON.stringify(child));
    else localStorage.removeItem("child");
  }, [child]);

  return (
    <UserContext.Provider value={{ user, child, setUser, setChild, logout }}>
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
                className="px-4 py-2 rounded-lg border border-zinc-600 text-zinc-600 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
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
