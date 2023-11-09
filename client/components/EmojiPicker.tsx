import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaceSmileIcon } from '@heroicons/react/24/outline';

interface EmojiPickerProps {
  content?: string;
  setContent: (content: string) => void;
}

const emojis = ['😀', '😍', '🥰', '😎', '🤩', '😊', '😂', '😇', '🤔'];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ content, setContent }) => {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Function to handle emoji selection.
  const handleEmojiSelect = (emoji: string) => {
    // Append the selected emoji to the current content.
    setContent(content + emoji);
  };

  // Function to toggle the visibility of the emoji picker.
  const handleToggleEmojiPicker = () => {
    setEmojiPickerVisible((prevVisibility) => !prevVisibility); // Toggle the visibility
  };

  // Function to handle clicks outside of the emoji picker.
  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (
        emojiPickerVisible &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node)
      ) {
        // If the emoji picker is visible and a click occurs outside, hide it.
        setEmojiPickerVisible(false);
      }
    },
    [emojiPickerVisible]
  );

  // Add a click event listener to the document to handle outside clicks.
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    // Clean up the event listener when the component unmounts.
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <div className="text-center relative z-1">
      <svg onClick={handleToggleEmojiPicker}  className="text-yellow-600 h-9 p-1.5 rounded-full bg-yellow-100 w-9 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
        <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-6h6"></path>
      </svg>
      {emojiPickerVisible && (
        <div className="absolute bottom-5 right-0 mb-4 z-10" ref={emojiPickerRef}>
          <div className="py-4 rounded-[20px] shadow-lg bg-zinc-200/[.5] dark:bg-gray-800 border border-zinc-200 dark:border-gray-700 w-[190px]">
            <div className="w-full flex justify-center items-center dark:bg-gray-800">
              <div className="flex flex-wrap justify-center max-w-[300px]">
                {emojis.map((emoji, index) => (
                  <span
                    key={index}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="text-[22px] cursor-pointer hover:text-blue-500 m-[4px] p-[6px] rounded-[8px] bg-zinc-100/[.15] dark:bg-gray-700/[.15] transition duration-200 hover:bg-zinc-200/[.7] dark:hover:bg-gray-700"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;

