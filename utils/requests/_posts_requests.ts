import { getTimeSincePublication } from "../_date";
import { BASE_API_URL } from "../_api_config";
import { fetcher } from "../_fetcher";
import { PostData } from "@/types/post_types";

const apiUrl = (path: string) => `${BASE_API_URL}${path}`;

const updatePostsWithTime = async (posts: PostData[]) => {
  return posts.map((post) => ({
    ...post,
    time_of_publication: getTimeSincePublication(post.created_at),
  }));
};

export const getPosts = async ({ page = 1 }: { page?: number }) => {
  const { posts, is_end_of_list } = await fetcher(
    apiUrl(`/api/posts?page=${page}`),
    "GET",
    {
      cache: "force-no-store",
    }
  );
  return {
    posts: await updatePostsWithTime(posts),
    is_end_of_list: is_end_of_list,
  };
};

export const getPost = async ({
  postId,
}: {
  postId: string;
}): Promise<PostData> => {
  const data = await fetcher(apiUrl(`/api/post/${postId}`), "GET");
  const postsWithTime = {
    ...data,
    time_of_publication: getTimeSincePublication(data.created_at),
  };
  return postsWithTime;
};

export const deletePost = async ({ postId }: { postId: string }) => {
  await fetcher(apiUrl(`/api/post/${postId}`), "DELETE");
};

export const getUserPosts = async ({ user_id }: { user_id: string }) => {
  const data = await fetcher(apiUrl(`/api/user/${user_id}/posts`), "GET");
  return updatePostsWithTime(data);
};

export const createPost = async ({ formData }: { formData: FormData }) => {
  return await fetcher(apiUrl("/api/post"), "POST", {}, formData);
};

export const getPostsByHobby = async ({ slug }: { slug: string }) => {
  const data = await fetcher(apiUrl(`/api/posts/${slug}`), "GET");
  return updatePostsWithTime(data);
};

export const reportPost = async ({
  reportData,
}: {
  reportData: {
    reported_id: string;
    reason: string;
    details: string;
    reported_type: string;
  };
}) => {
  return await fetcher(
    apiUrl("/api/report"),
    "POST",
    {},
    JSON.stringify(reportData)
  );
};

export const likePost = async ({ postId }: { postId: string }) => {
  try {
    const data = await fetcher(apiUrl(`/api/post/${postId}/like`), "POST");
    return { data };
  } catch (error) {
    console.error("Error liking post:", error);
  }
};
