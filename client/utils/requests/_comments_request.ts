import { PostComment } from "@/types/comments_types";
import { BASE_API_URL } from "../_api_config";
import { fetcher } from "../_fetcher";

const apiUrl = (path: string) => `${BASE_API_URL}${path}`;

export const getComments = async ({
  postId,
}: {
  postId: string;
}): Promise<PostComment[]> => {
  try {
    return await fetcher(apiUrl(`/api/post/${postId}/comments`), "GET");
  } catch (error) {
    throw error;
  }
};

export const createComment = async ({
  data,
}: {
  data: { content: string; post_id: string };
}) => {
  try {
    await fetcher(apiUrl(`/api/add-comment`), "POST", {}, JSON.stringify(data));
  } catch (error) {
    throw error;
  }
};
