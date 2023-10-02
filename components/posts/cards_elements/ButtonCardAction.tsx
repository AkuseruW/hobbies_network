'use client';
import React, { useState } from "react";
import { HeartIcon, ChatBubbleLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import { PostData } from "@/types/post_types";
import { likePost } from "@/utils/requests/_posts_requests";
import { useLike } from "@/providers/like_provider";

const BtnAction = ({ data, handleToggleInput }: { data: PostData; handleToggleInput?: () => void }) => {
    const { toggleLike } = useLike();
    const initialLiked = data.userHasLiked;
    const [isLiked, setIsLiked] = useState(initialLiked);


    const handleLikePost = async () => {
        try {
            const response = await likePost({ postId: data.id });

            if (response) {
                toggleLike(data.id);
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div className="px-4 flex items-center justify-between gap-x-2 mt-2">
            <button
                onClick={handleLikePost}
                className="py-2 px-2 sm:px-3 font-medium rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 border dark:border-slate-700 flex-1 sm:w-[200px] flex justify-center ml-2 sm:ml-0 mt-2 sm:mt-0"
            >
                {isLiked ? (
                    <HeartIconFilled className="h-6 w-6 text-red-500" />
                ) : (
                    <HeartIcon className="h-6 w-6 text-gray-500" />
                )}
            </button>
            <button
                className="py-2 px-2 sm:px-3 font-medium rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 border dark:border-slate-700  flex-1 sm:w-[200px] flex justify-center ml-2 sm:ml-0 mt-2 sm:mt-0"
                onClick={handleToggleInput}
            >
                <ChatBubbleLeftIcon className="h-6 w-6 text-gray-500" />
            </button>
            <button className="py-2 px-2 sm:px-3 font-medium rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 border dark:border-slate-700  flex-1 sm:w-[200px] flex justify-center ml-2 sm:ml-0 mt-2 sm:mt-0">
                <PaperAirplaneIcon className="h-6 w-6 text-gray-500" />
            </button>
        </div>

    );
};

export default BtnAction;