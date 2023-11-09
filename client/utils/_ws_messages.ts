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
        // Handle a new post received over WebSocket.
        const updatedPost = {
          ...data,
          time_of_publication: getTimeSincePublication(created_at),
        };
        addPost(updatedPost);
        break;

      case "post_deleted":
        // Handle a deleted post notification.
        const deletedPostId = data;
        deletePost(deletedPostId);
        break;

      case "post_liked":
        // Handle a post that has been liked by a user.
        const likedPostId = data.post_id;
        likePost(likedPostId);
        break;

      case "post_liked_removed":
        // Handle the removal of a like from a post.
        const dislikedPostId = data.post_id;
        dislikePost(dislikedPostId);
        break;

      case "comment":
        // Handle a new comment added to a post.
        const { post_id } = data;
        updateTotalComments(post_id);
        break;

      case "notification":
        // Handle a new notification received over WebSocket.
        addNotification(data);
        break;

      default:
        break;
    }
  };
};