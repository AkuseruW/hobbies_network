'use client'
import { createComment } from "@/utils/requests/_comments_request";
import React, { useState, ChangeEvent, KeyboardEvent } from "react";

const InputComment = ({ post_id }: { post_id: string }): JSX.Element => {
  const [comment, setComment] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const data = {
        content: comment,
        post_id,
      };
      await createComment({ data });
      setComment("");
    }
  };

  return (
    <form className="mx-6">
      <div className="">
        <textarea
          value={comment}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Laisse un commentaire..."

          className="resize-none h-12 px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 bg-white dark:bg-gray-800 text-black dark:text-white"
        />
        {/* <div className="absolute inset-y-0 right-4 flex items-center pl-3"> */}
        {/* Add EmojiPicker */}
        {/* <EmojiPicker /> */}
        {/* </div> */}
      </div>
    </form>
  );
};

export default InputComment;
