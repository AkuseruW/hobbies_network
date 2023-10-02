"use client";
import { PostData } from "@/types/post_types";
import UserInfo from "./cards_elements/UserInfoCard";
import PostBody from "./cards_elements/PostCardBody";

const PostCard = ({ data }: { data: PostData }) => {
    return (
        <article className="mb-4 break-inside bg-white dark:bg-gray-800 flex flex-col rounded-lg shadow-md ">
            <div className=" mb-2 p-2">
                <UserInfo data={data} />
            </div>
            <div className="flex-grow">
                <PostBody data={data} />
            </div>
        </article>
    );
};

export default PostCard;
