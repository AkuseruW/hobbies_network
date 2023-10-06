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

export const getNotificationsAdmin = async ({
  page = "1",
  search,
}: {
  page?: string;
  search?: string;
}) => {
  try {
    return await fetcher(apiUrl(`/api/admin_notifications`), "GET");
  } catch (error) {
    throw error;
  }
};


export const notification_is_read = async ({ notification_id }: { notification_id: number }) => {
  try {
    return await fetcher(apiUrl(`/api/notification_is_read/${notification_id}`), "DELETE");
  } catch (error) {
    throw error;
  }
}