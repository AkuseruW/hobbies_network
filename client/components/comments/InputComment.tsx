'use client'
import { createComment } from "@/utils/requests/_comments_request";
import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import EmojiPicker from "../EmojiPicker";
import { useToast } from "../ui/use-toast";

const InputComment = ({ post_id }: { post_id: string }): JSX.Element => {
  const [comment, setComment] = useState<string>("");
  const { toast } = useToast()


  // Handle changes in the textarea input.
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  // Handle key press events in the textarea.
  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if the Enter key is pressed without the Shift key.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      // Prepare the comment data.
      const data = {
        content: comment,
        post_id,
      };
      // Call the createComment function to create the comment.
      await createComment({ data });
      // Clear the comment input.
      setComment("");
      // Toast the user.
      toast({
        description: "Commentaire publie!",
      })
    }
  };

  return (
    <form className="mx-6">
      <div className="relative">
        <textarea
          value={comment}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Laisse un commentaire..."
          className="resize-none h-12 px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 bg-white dark:bg-secondary_dark text-black dark:text-white"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <EmojiPicker content={comment} setContent={setComment} />
        </div>
      </div>
    </form>
  );
};

export default InputComment;
