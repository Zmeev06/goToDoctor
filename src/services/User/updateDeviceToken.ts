import { AxiosError } from "axios";
import { ApiClient } from "../Client";

export const updateDeviceToken = async () => {
  const formData = new FormData();
  const deviceToken = localStorage.getItem("deviceToken");
  const userData = localStorage.getItem("userData");

  if (deviceToken) {
    formData.append('bitrixUserId', JSON.parse(userData).user_id)
    formData.append("token", deviceToken);
  }

  try {
    const response = await ApiClient({
      method: "POST",
      url: `user/updateDeviceToken`,
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
