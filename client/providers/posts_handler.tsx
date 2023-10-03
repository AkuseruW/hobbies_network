'use client';
import { useState } from 'react';

interface PostData {
    id: string;
    total_likes: number;
    total_comments: number;
}

const initialPostsState: PostData[] = [];

export const usePosts = () => {
    const [posts, setPosts] = useState<PostData[]>(initialPostsState);

    const initializePosts = (newPosts: PostData[]) => {
        setPosts(newPosts);
    };

    const addNewPosts = (newPosts: PostData[]) => {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    };

    // Function to add a new post to the state
    const addPost = (newPost: PostData) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    // Function to delete a post from the state
    const deletePost = (postId: string) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };

    // Function to increment the like count for a post
    const likePost = (postId: string) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, total_likes: post.total_likes + 1 } : post
            )
        );
    };

    // Function to decrement the like count for a post
    const dislikePost = (postId: string) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, total_likes: post.total_likes - 1 } : post
            )
        );
    };

    // Function to update the total comments count for a post
    const updateTotalComments = (postId: string) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, total_comments: post.total_comments + 1 } : post
            )
        );
    };

    const updatePostTimes = () => {
        // Mettez à jour les horaires des posts ici
    };

    return { posts, addPost, deletePost, likePost, dislikePost, updateTotalComments, initializePosts, addNewPosts, updatePostTimes };
};
