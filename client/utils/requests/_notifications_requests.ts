import { BASE_API_URL } from "../_api_config";
import { fetcher } from "../_fetcher";

const apiUrl = (path: string) => `${BASE_API_URL}${path}`;

export const getNotifications = async () => {
  try {
    return await fetcher(apiUrl(`/api/notifications`), "GET");
  } catch (error) {
    throw error;
  }
};
