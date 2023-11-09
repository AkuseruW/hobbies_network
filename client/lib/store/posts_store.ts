import { PostData } from "@/types/post_types";
import { getTimeSincePublication } from "@/utils/_date";
import { create } from "zustand";

interface PostsState {
  posts: PostData[];
  currentPage: number;
  isEndOfList: boolean;
  initializePosts: (initialPosts: PostData[]) => void;
  addPost: (newPost: PostData) => void;
  addNewPosts: (newPosts: PostData[]) => void;
  incrementCurrentPage: () => void;
  changeIsEndOfList: () => void;

  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  dislikePost: (postId: string) => void;
  updatePostTimes: () => void;
  updateTotalComments: (postId: string) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [], // Initialize the posts array.
  currentPage: 2, // Initialize the current page to 2.
  isEndOfList: false, // Initialize the end of list status.

  // Initialize the posts array with initial data
  initializePosts: (initialPosts) => {
    set(
      { posts: initialPosts }
    );
  },

  // Add a new post to the beginning of the posts array
  addPost: (newPost) => {
    set((state) => {
      return {
        posts: [newPost, ...state.posts],
      };
    });
  },

  // Delete a post from the posts array by its ID
  deletePost: (postId) => {
    set((state) => {
      const updatedPosts = state.posts.filter((post) => post.id !== postId);
      return { posts: updatedPosts };
    });
  },

  // Add new posts to the end of the posts array and update their time of publication
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

  // Increment the current page by 1
  incrementCurrentPage: () => {
    // Increment the current page by 1.
    set((state) => ({ currentPage: state.currentPage + 1 }));
  },

  // Change the end of list status
  changeIsEndOfList: () => {
    // Change the end of list status.
    set((state) => ({ isEndOfList: state.isEndOfList ? false : true }));
  },

  // Increment the total likes count for a specific post
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

  // Decrement the total likes count for a specific post
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

  // Increment the total comments count for a specific post
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

  // Update the time of publication for all posts
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
