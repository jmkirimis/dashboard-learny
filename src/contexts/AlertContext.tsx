"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import CustomAlert from "@/components/CustomAlert";

type AlertData = {
  icon: string;
  title: string;
  message: string;
  onClose?: () => void;
  onRedirect?: () => void;
  id?: string; // opcional: para evitar duplicados
};

type AlertContextType = {
  showAlert: (data: AlertData) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useCustomAlert() {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useCustomAlert must be used within AlertProvider");
  return context;
}

type Props = { children: ReactNode };

export function AlertProvider({ children }: Props) {
  const [queue, setQueue] = useState<AlertData[]>([]);
  const [current, setCurrent] = useState<AlertData | null>(null);
  const [visible, setVisible] = useState(false);

  // Ref para rastrear alertas já exibidos
  const shownAlertsRef = useRef<Set<string>>(new Set());

  const showAlert = (data: AlertData) => {
    const alertId = data.id || `${data.title}-${data.message}`;
    
    // Se já mostrou esse alerta, não adiciona na fila
    if (shownAlertsRef.current.has(alertId)) return;

    // Se for alerta crítico de sessão, bloqueia outros alertas
    if (alertId === "sessao-expirada" && current) return;

    // Limpa fila para alerta crítico
    if (alertId === "sessao-expirada") {
      setQueue([]);
    }

    shownAlertsRef.current.add(alertId);
    setQueue(prev => [...prev, { ...data, id: alertId }]);
  };

  // Exibir o próximo alerta da fila
  useEffect(() => {
    if (!current && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
      setVisible(true);
    }
  }, [queue, current]);

  const handleClose = useCallback(() => {
    if (!current) return;

    setVisible(false);

    if (current.onClose) current.onClose();
    if (current.onRedirect) current.onRedirect();

    // Se não for alerta crítico, remove do Set para permitir exibir novamente no futuro
    if (current.id !== "sessao-expirada") {
      shownAlertsRef.current.delete(current.id || `${current.title}-${current.message}`);
    }

    setTimeout(() => setCurrent(null), 300);
  }, [current]);

  // Auto-fechar após 5 segundos
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => handleClose(), 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, handleClose]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {current && (
        <div
          className={`fixed inset-0 z-40 flex items-start justify-end 
            bg-black/40 transition-opacity duration-300
            ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={handleClose}
        >
          <CustomAlert
            icon={current.icon}
            visible={visible}
            title={current.title}
            message={current.message}
            onClose={handleClose}
          />
        </div>
      )}
    </AlertContext.Provider>
  );
}
