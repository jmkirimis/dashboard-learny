/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useCustomAlert } from "@/contexts/AlertContext";
import { useUser } from "@/contexts/UserContext";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestParams = {
  endpoint: string;
  method?: HttpMethod;
  body?: any;
  hasHeaders?: boolean;
};

type ApiError = {
  error: boolean;
  status: number;
  message?: string;
};

type UseApiReturn<T> = {
  loading: boolean;
  request: (params: RequestParams) => Promise<T | ApiError>;
};

export function useApi<T = any>(): UseApiReturn<T> {
  const { logout } = useUser();
  const { showAlert } = useCustomAlert();
  const [loading, setLoading] = useState(false);

  const request = async ({
    endpoint,
    method = "GET",
    body,
    hasHeaders = true,
  }: RequestParams): Promise<T | ApiError> => {
    setLoading(true);

    const headers: Record<string, string> = {};
    if (hasHeaders) {
      if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }
    }

    try {
      const res = await fetch(`${endpoint}`, {
        method,
        headers: Object.keys(headers).length ? headers : undefined,
        body: method !== "GET" && body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
      });

      if (res.status === 204) {
        return { error: false, status: 204 } as any;
      }

      const result = await res.json();

      if (res.status === 401) {
        showAlert({
          id: "sessao-expirada",
          icon: "/icons/erro.png",
          title: "Sessão expirada!",
          message: "Sua sessão expirou. Efetuando redirecionamento para login.",
          onClose: () => logout(),
        });
        return { error: true, status: 401, message: "Sessão expirada" };
      }

      if (!res.ok) {
        return { error: true, status: res.status, message: result.error || "Erro inesperado." };
      }

      return result;
    } catch (err) {
      console.error(err);
      return { error: true, status: 500, message: "Não foi possível conectar ao servidor." };
    } finally {
      setLoading(false);
    }
  };

  return { loading, request };
}
