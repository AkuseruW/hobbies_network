"use client";
import React, { useCallback, useEffect, useState, useMemo, Suspense } from "react";
import { useInView } from 'react-intersection-observer';
import { Icons } from "../icons";
import { PostData } from "@/types/post_types";
import { useHomeStore } from "@/lib/store/page_store";
import { v4 as uuid } from 'uuid'
import { getPosts } from "@/utils/requests/_posts_requests";
import PostCard from "./PostCard";
import Loading from "../Loading";
import { getTimeSincePublication, updatePostsWithTime } from "@/utils/_date";
import { useWebSocket } from "@/providers/ws_provider";
import { setupWebSocketHandler } from "@/utils/_ws_messages";

const PostsSection = ({ initialPosts }: { initialPosts: PostData[] }) => {
  const [posts, setPosts] = useState(initialPosts);
  const socket = useWebSocket();
  const { currentPage, setCurrentPage } = useHomeStore();
  const [isEndOfList, setIsEndOfList] = useState(false);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (posts.length === 0) {
      setPosts(initialPosts);
    }
  }, [initialPosts, posts]);

  const loadMorePosts = useCallback(async () => {
    if (isEndOfList) {
      return;
    }

    const next = currentPage + 1;
    const { posts: newPosts, is_end_of_list } = await getPosts({ page: next });

    if (newPosts?.length) {
      setCurrentPage(next);
      // Append the new posts with updated timestamps to the existing posts
      setPosts((prev) => [...(prev?.length ? prev : []), ...updatePostsWithTime(newPosts)]);
      if (is_end_of_list) {
        setIsEndOfList(true);
      }
    }

  }, [currentPage, isEndOfList, setCurrentPage]);

  /**
  * Load more posts when the user scrolls into view
  */
  useEffect(() => {
    if (inView && posts.length >= 10) {
      loadMorePosts();
    }
  }, [inView, loadMorePosts, posts.length]);

  /**
  * Set up WebSocket event handling for posts
  */
  useEffect(() => {
    setupWebSocketHandler(socket, posts, setPosts);
  }, [socket, posts, setPosts]);

  /**
  * Set up WebSocket event handling for posts
  */
  const updatePostTimes = useCallback(() => {
    // Update the timestamps of all posts
    const updatedPosts = posts.map((post) => ({
      ...post,
      time_of_publication: getTimeSincePublication(post.created_at),
    }));
    setPosts(updatedPosts);
  }, [posts]);

  useEffect(() => {
    // Update post timestamps every 60 seconds
    const intervalId = setInterval(updatePostTimes, 60000);
    return () => clearInterval(intervalId);
  }, [updatePostTimes]);

  const postCards = useMemo(() => posts.map((post) => (
    <Suspense key={post.id} fallback={<Loading />}>
      <PostCard data={post} />
    </Suspense>
  )), [posts]);

  return (
    <div>
      {postCards}

      {posts.length >= 10 && (
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
