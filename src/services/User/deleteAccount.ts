import { AxiosError } from "axios";
import { ApiClient } from "../Client";

export const deleteAccount = async () => {
  const formData = new FormData();
  const token = localStorage.getItem("userData");
  if (token) {
    formData.append("token", JSON.parse(token).auth_token);
  }
  try {
    const response = await ApiClient({
      method: "POST",
      url: `user/deleteAccount`,
      data: formData,
    });

    const { data, status } = response;
    if (status === 200) {
      return { data, status };
    } else {
      console.error(`Ошибка на сервере. Статус: ${status}`);
      return { data: null, status };
    }
  } catch (error) {
    const errorStatus = (error as AxiosError)?.response?.status || 500;
    return { data: null, status: errorStatus };
  }
};
