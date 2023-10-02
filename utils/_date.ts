import { UpdatedPostData } from "@/types/date_types";
import { PostData } from "@/types/post_types";

export const getTimeSincePublication = (created_at: string) => {
  const now = new Date();
  const createdAtDate = new Date(created_at + "Z");
  const timeDifference = now.getTime() - createdAtDate.getTime();

  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  } else if (minutes >= 1) {
    return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return `A l'instant`;
  }
};

export const updatePostsWithTime = (posts: PostData[]): UpdatedPostData[] => {
  return posts.map((post) => ({
    ...post,
    time_of_publication: getTimeSincePublication(post.created_at),
  }));
};
