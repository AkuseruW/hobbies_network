"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWebSocket } from "@/providers/ws_provider";
import { PostComment } from "@/types/comments_types";

const CommentCard = ({ data }: { data: PostComment[] }) => {
  const [comments, setcomments] = useState(data);
  const socket = useWebSocket();

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

  console.log(comments)
  return (
    <div>
      {comments.map((comment, index) => (
        <article
          key={index}
          className="bg-white p-4 mx-auto my-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:text-white"
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
            <button
              id={`dropdownComment${index + 1}Button`}
              data-dropdown-toggle={`dropdownComment${index + 1}`}
              className="p-2 text-sm font-medium text-center text-gray-400 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50  dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              type="button"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
              </svg>
            </button>
          </footer>
          <p className="text-gray-500 dark:text-gray-400">{comment.content}</p>
        </article>
      ))}
    </div>
  );
};

export default CommentCard;