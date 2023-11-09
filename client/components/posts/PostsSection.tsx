"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import { useInView } from 'react-intersection-observer';
import { Icons } from "../icons";
import { PostData } from "@/types/post_types";
import { getPosts } from "@/utils/requests/_posts_requests";
import PostCard from "./PostCard";
import { usePostsStore } from "@/lib/store/posts_store";
import { useUserHobbiesStore } from "@/lib/store/hobbies_store";

const PostsSection = ({ initialPosts }: { initialPosts: PostData[] }) => {
  const {
    posts,
    initializePosts,
    addNewPosts,
    isEndOfList,
    changeIsEndOfList,
    updatePostTimes,
    currentPage,
    incrementCurrentPage,
  } = usePostsStore();
  const [ref, inView] = useInView();

  useEffect(() => {
    initializePosts(initialPosts);
  }, [initialPosts]);

  const loadMorePosts = useCallback(async () => {
    // Check if the end of the list has been reached
    if (isEndOfList) {
      return;
    }
    // Load more posts
    const { posts: newPosts, is_end_of_list } = await getPosts({ page: currentPage });

    // Update the current page
    incrementCurrentPage();
    // Append the new posts with updated timestamps to the existing posts
    addNewPosts(newPosts)
    if (is_end_of_list) {
      // Set the end of the list
      changeIsEndOfList();
    }
  }, [currentPage, isEndOfList, incrementCurrentPage]);

  // Load more posts when the user scrolls into view
  useEffect(() => {
    if (inView && posts.length >= 10) {
      loadMorePosts();
    }
  }, [inView, loadMorePosts, posts.length]);


  useEffect(() => {
    // Update post timestamps every 60 seconds
    const intervalId = setInterval(updatePostTimes, 60000);
    return () => clearInterval(intervalId);
  }, [updatePostTimes]);


  // Render the posts
  const postCards = useMemo(() => posts.map((post) => (
    <PostCard key={post.id} data={post} />
  )), [posts]);

  return (
    <div>
      {postCards}

      {!isEndOfList && posts.length >= 10 && (
        <div
          ref={ref}
          className='h-4 col-span-1 my-6 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4'
        >
          <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default React.memo(PostsSection);