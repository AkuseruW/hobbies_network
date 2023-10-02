import { PostData } from "@/types/post_types";
import { getTimeSincePublication } from "@/utils/_date";
import { create } from "zustand";

interface PostsState {
  posts: PostData[];
  initializePosts: (initialPosts: PostData[]) => void;
  addPost: (newPost: PostData) => void;
  addNewPosts: (newPosts: PostData[]) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  dislikePost: (postId: string) => void;
  updatePostTimes: () => void;
  updateTotalComments: (postId: string) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  initializePosts: (initialPosts) => {
    set({ posts: initialPosts });
  },

  addPost: (newPost) => {
    const timeSincePublication = getTimeSincePublication(newPost.created_at);
    set((state) => ({
      posts: [{ ...newPost, timeSincePublication }, ...state.posts],
    }));
  },

  addNewPosts: (newPosts) => {
    set((state) => ({
      posts: [
        ...state.posts,
        ...newPosts.map((post) => ({
          ...post,
          time_of_publication: getTimeSincePublication(post.created_at),
        })),
      ],
    }));
  },

  deletePost: (postId) => {
    set((state) => ({
      posts: state.posts.filter((post) => post?.id !== postId),
    }));
  },

  likePost: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post?.id === postId
          ? {
              ...post,
              total_likes: post.total_likes + 1,
              userHasLiked: true,
            }
          : post
      ),
    }));
  },

  dislikePost: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post?.id === postId
          ? {
              ...post,
              total_likes: post.total_likes > 0 ? post.total_likes - 1 : 0,
              userHasLiked: false,
            }
          : post
      ),
    }));
  },

  updateTotalComments: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post?.id === postId) {
          return {
            ...post,
            total_comments: post.total_comments + 1,
          };
        }
        return post;
      }),
    }));
  },

  updatePostTimes: () => {
    set((state) => {
      const updatedPosts = state.posts.map((post) => ({
        ...post,
        time_of_publication: getTimeSincePublication(post.created_at),
      }));
      return { posts: updatedPosts };
    });
  },
}));
