import { PostData } from "@/types/post_types";
import { getTimeSincePublication } from "./_date";

/**
 * Setup WebSocket message handler.
 *
 * @param socket - WebSocket connection
 * @param posts - Array of posts
 * @param setPosts - Function to set posts
 */
export const setupWebSocketHandler = (
  socket: WebSocket | null,
  posts: PostData[],
  setPosts: React.Dispatch<React.SetStateAction<PostData[]>>
) => {
  if (socket) {
    socket.onmessage = (event) => {
      const receivedEvent = JSON.parse(event.data);
      try {
        switch (receivedEvent.type) {
          case "post":
            // Handle incoming post message
            const updatedPost: PostData = {
              ...receivedEvent.data,
              time_of_publication: getTimeSincePublication(receivedEvent.created_at),
            };
            setPosts((prevPosts: PostData[]) => [updatedPost, ...prevPosts]);
            break;
          case "post_deleted":
            // Handle incoming post_deleted message
            const deletedPostId = receivedEvent.data;
            setPosts((prevPosts: PostData[]) =>
              prevPosts.filter((post) => post.id !== deletedPostId)
            );
            break;
          case "post_liked":
            // Handle incoming post_liked message
            const likedPostId = receivedEvent.data;
            const updatedPosts = posts.map((post) => {
              if (post.id === likedPostId.post_id) {
                return {
                  ...post,
                  total_likes: post.total_likes + 1,
                };
              }
              return post;
            });
            setPosts(updatedPosts);
            break;
          case "post_liked_removed":
            // Handle incoming post_liked_removed message
            const dislikedPostId = receivedEvent.data;
            const updatedPosts2 = posts.map((post) => {
              if (post.id === dislikedPostId.post_id) {
                return {
                  ...post,
                  total_likes: post.total_likes - 1,
                };
              }
              return post;
            });
            setPosts(updatedPosts2);
            break;
          case "comment":
            // Handle incoming comment message
            const { post_id } = receivedEvent.data;
            const updatedPosts3 = posts.map((post) => {
              if (post.id === post_id) {
                return {
                  ...post,
                  total_comments: post.total_comments + 1,
                };
              }
              return post;
            });
            setPosts(updatedPosts3);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(error);
      }
    };
  }
};
