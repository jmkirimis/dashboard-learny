import { useCustomAlert } from "@/contexts/AlertContext";
import { useApi } from "./useApi";
import { useUser } from "@/contexts/UserContext";

export function useGetData() {
  const { request } = useApi();
  const { showAlert } = useCustomAlert();
  const { setUser, setChild } = useUser();

  const getUserData = async () => {
    const result = await request({
      endpoint: "/api/parents",
      method: "GET",
    });

    if (result && !result.error) {
      setUser(result);
    } else {
      if (result.status === 404) return;
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao buscar filho selelcionado!",
        message:
          result.message || "Ocorreu um erro ao buscar o filho selecionado",
      });
    }
  };

  const getChildData = async () => {
    const result = await request({
      endpoint: "/api/parents/child/selected",
      method: "GET",
    });

    if (result && !result.error) {
      setChild(result);
    } else {
      if (result.status === 404) {
        setChild(null);
        return
      } 
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao buscar filho selelcionado!",
        message:
          result.message || "Ocorreu um erro ao buscar o filho selecionado",
      });
    }
  };
  
  return {
    getUserData,
    getChildData,
  };
}
