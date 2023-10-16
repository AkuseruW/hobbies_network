import { BASE_API_URL } from "../_api_config";
import { fetcher } from "../_fetcher";


const apiUrl = (path: string) => `${BASE_API_URL}${path}`;

export const getChatUuid = async ({ user_id }: { user_id: number }) => {
    try {
        return await fetcher(apiUrl(`/api/conversations/start/${user_id}`), "GET");
    } catch (error) {
        throw error;
    }
};

export const getChatMessages = async ({ room_id }: { room_id: string }) => {
    try {
        return await fetcher(apiUrl(`/api/conversations/${room_id}`), "GET");
    } catch (error) {
        throw error;
    }
};

export const sendChatMessage = async ({
    room_id,
    content,
}: {
    room_id: string;
    content: string;
}) => {
    try {
        return await fetcher(
            apiUrl(`/api/conversations/${room_id}/message`),
            "POST",
            {},
            JSON.stringify({ content })
        );
    } catch (error) {
        throw error;
    }
};