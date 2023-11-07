import { PostData } from "@/types/post_types";
import { getTimeSincePublication } from "./_date";
import { Notification } from "@/types/notifications_types";

// /**
//  * Setup WebSocket message handler.
//  *
//  * @param socket - WebSocket connection
//  * @param posts - Array of posts
//  * @param setPost - Function to set posts
//  */
// export const setupWebSocketHandler = (
//   socket: WebSocket | null,
//   setPost: (setPosts: PostData) => void
// ) => {
//   if (socket) {
//     socket.onmessage = (event) => {
//       const receivedEvent = JSON.parse(event.data);
//       try {
//         switch (receivedEvent.type) {
//           case "post":
//             // Handle incoming post message
//             const updatedPost: PostData = {
//               ...receivedEvent.data,
//               time_of_publication: getTimeSincePublication(receivedEvent.created_at),
//             };
//             setPost(updatedPost);
//             break;
//           // case "post_deleted":
//           //   // Handle incoming post_deleted message
//           //   const deletedPostId = receivedEvent.data;
//           //   setPost((prevPosts: PostData[]) =>
//           //     prevPosts.filter((post) => post.id !== deletedPostId)
//           //   );
//           //   break;
//           // case "post_liked":
//           //   // Handle incoming post_liked message
//           //   const likedPostId = receivedEvent.data;
//           //   const updatedPosts = posts.map((post) => {
//           //     if (post.id === likedPostId.post_id) {
//           //       return {
//           //         ...post,
//           //         total_likes: post.total_likes + 1,
//           //       };
//           //     }
//           //     return post;
//           //   });
//           //   setPost(updatedPosts);
//           //   break;
//           // case "post_liked_removed":
//           //   // Handle incoming post_liked_removed message
//           //   const dislikedPostId = receivedEvent.data;
//           //   const updatedPosts2 = posts.map((post) => {
//           //     if (post.id === dislikedPostId.post_id) {
//           //       return {
//           //         ...post,
//           //         total_likes: post.total_likes - 1,
//           //       };
//           //     }
//           //     return post;
//           //   });
//           //   setPost(updatedPosts2);
//           //   break;
//           // case "comment":
//           //   // Handle incoming comment message
//           //   const { post_id } = receivedEvent.data;
//           //   const updatedPosts3 = posts.map((post) => {
//           //     if (post.id === post_id) {
//           //       return {
//           //         ...post,
//           //         total_comments: post.total_comments + 1,
//           //       };
//           //     }
//           //     return post;
//           //   });
//           //   setPost(updatedPosts3);
//           //   break;
//           default:
//             break;
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//   }
// };


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