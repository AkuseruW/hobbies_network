import { PostData } from "@/types/post_types";
import { getTimeSincePublication } from "./_date";

export const setupWebSocket = (
  socket: WebSocket,
  addPost: (newPost: PostData) => void,
  deletePost: (postId: string) => void,
  likePost: (postId: string) => void,
  dislikePost: (postId: string) => void,
  updateTotalComments: (postId: string) => void
) => {
  socket.onmessage = (event) => {
    const receivedEvent = JSON.parse(event.data);
    const { type, data, created_at } = receivedEvent;

    switch (type) {
      case "post":
        const updatedPost = {
          ...data,
          time_of_publication: getTimeSincePublication(created_at),
        };
        addPost(updatedPost);
        break;
        
      case "post_deleted":
        const deletedPostId = data;
        deletePost(deletedPostId);
        break;

      case "post_liked":
        const likedPostId = data.post_id;
        likePost(likedPostId);
        break;

      case "post_liked_removed":
        const dislikedPostId = data.post_id;
        dislikePost(dislikedPostId);
        break;

      case "comment":
        const { post_id } = data;
        updateTotalComments(post_id);
        break;

      default:
        break;
    }
  };
};
