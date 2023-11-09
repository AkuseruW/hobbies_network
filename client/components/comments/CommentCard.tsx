"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWebSocket } from "@/providers/ws_provider";
import { PostComment } from "@/types/comments_types";

const CommentCard = ({ data }: { data: PostComment[] }) => {
  const [comments, setcomments] = useState(data);
  const socket = useWebSocket(); // Get the WebSocket instance

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        try {
          const receivedComment = JSON.parse(event.data);
          if (receivedComment.type === "comment") {
            setcomments((prevComments) => [receivedComment.data, ...prevComments]);
          }
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };
    }
  }, [socket]);

  return (
    <div>
      {comments.map((comment, index) => (
        <article
          key={index}
          className="bg-white p-4 mx-auto my-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-background_dark dark:text-white"
        >
          <footer className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Image
                height={50}
                width={50}
                className="mr-2 w-6 h-6 rounded-full"
                src={comment.user.profile_picture}
                alt={comment.user.username}
              />
              <p>{comment.user.username}</p>
            </div>

          </footer>
          <p className="text-gray-500 dark:text-gray-400">{comment.content}</p>
        </article>
      ))}
    </div>
  );
};

export default CommentCard;