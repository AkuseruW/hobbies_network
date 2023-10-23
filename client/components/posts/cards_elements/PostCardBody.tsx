import React, { useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import BtnAction from "./ButtonCardAction";
import { PostData } from "@/types/post_types";
import InputComment from "@/components/comments/InputComment";
import PostImagesCarousel from "./PostImages";

interface PostBodyProps {
    data: PostData;
}

const PostBody: React.FC<PostBodyProps> = ({
    data,
}) => {
    const [showCommentInput, setShowCommentInput] = useState(false);

    const handleToggleInput = async () => {
        setShowCommentInput(!showCommentInput);
    };

    return (
        <section>
            <Link href={`/post/${data.id}`} className="py-4 text-text" prefetch={false}>
                <p className="text-sm sm:text-base py-4 px-2 mx-2 whitespace-pre-wrap">{data.content.slice(0, 500)}
                    {data.content.length > 200 && <span>... <span className="text-blue-500">lire la suite</span></span>}
                </p>
                <p className="text-blue-500 text-sm sm:text-base py-4 px-2 mx-2 whitespace-pre-wrap">
                    {data.hobby ? `#${data.hobby.name}` : ""}
                </p>
                {data.post_images_urls.length > 0 && (
                    <PostImagesCarousel images={data.post_images_urls} />
                )}
            </Link>

            <div className="flex gap-4  flex-col p-2">
                <div className="flex px-2 mx-2 ">
                    <div className="cursor-pointer text-blue-500 dark:text-text_dark"> {data.total_likes} Likes </div>
                    <div className="cursor-pointer text-blue-500 ml-auto dark:text-text_dark">
                        {data.total_comments} commentaires
                    </div>
                </div>
                <Separator className="dark:bg-gray-500"/>
                <BtnAction data={data} handleToggleInput={handleToggleInput} />
                {showCommentInput && <InputComment post_id={data.id} />}
            </div>
        </section>
    );
};

export default PostBody;
