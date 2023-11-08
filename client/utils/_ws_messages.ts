import { PostData } from "@/types/post_types";
import { getTimeSincePublication } from "./_date";
import { Notification } from "@/types/notifications_types";

export const setupWebSocket = (
  socket: WebSocket,
  addPost: (newPost: PostData) => void,
  deletePost: (postId: string) => void,
  likePost: (postId: string) => void,
  dislikePost: (postId: string) => void,
  addNotification: (newNotification: Notification) => void,
  updateTotalComments: (postId: string) => void
) => {
  socket.onmessage = (event) => {
    const receivedEvent = JSON.parse(event.data);
    const { type, action, data, created_at } = receivedEvent;

    switch (type || action) {
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

      case "notification":
        addNotification(data);
        break;

      default:
        break;
    }
  };
};