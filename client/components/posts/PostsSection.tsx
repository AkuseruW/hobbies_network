"use client";
import React, { useCallback, useEffect, useState, useMemo, Suspense } from "react";
import { useInView } from 'react-intersection-observer';
import { Icons } from "../icons";
import { PostData } from "@/types/post_types";
import { useHomeStore } from "@/lib/store/page_store";
import { usePostsStore } from "@/lib/store/posts_store";
import { getPosts } from "@/utils/requests/_posts_requests";
import PostCard from "./PostCard";
import Loading from "../Loading";

const PostsSection = ({ initialPosts }: { initialPosts: PostData[] }) => {
  const { posts, initializePosts, updatePostTimes, addNewPosts } = usePostsStore();
  const { currentPage, setCurrentPage } = useHomeStore();
  const [isEndOfList, setIsEndOfList] = useState(false);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (posts.length === 0) {
      initializePosts(initialPosts);
    }
  }, [initializePosts, initialPosts, posts]);

  const loadMorePosts = useCallback(async () => {
    if (isEndOfList) {
      return;
    }

    const next = currentPage + 1;
    const { posts: newPosts, is_end_of_list } = await getPosts({ page: next });

    if (newPosts?.length) {
      setCurrentPage(next);
      addNewPosts(newPosts);
      if (is_end_of_list) {
        setIsEndOfList(true);
      }
    }

  }, [currentPage, setCurrentPage, addNewPosts, isEndOfList]);

  useEffect(() => {
    if (inView && posts.length >= 10) {
      loadMorePosts();
    }
  }, [inView, loadMorePosts, posts.length]);

  useEffect(() => {
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
