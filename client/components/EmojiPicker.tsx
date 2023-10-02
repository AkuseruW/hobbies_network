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

  const handleEmojiSelect = (emoji: string) => {
    setContent(content + emoji);
  };

  const handleToggleEmojiPicker = () => {
    setEmojiPickerVisible((prevVisibility) => !prevVisibility);
  };

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (
        emojiPickerVisible &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node)
      ) {
        setEmojiPickerVisible(false);
      }
    },
    [emojiPickerVisible]
  );

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <div className="text-center relative z-1">
      <FaceSmileIcon className="w-6 h-6 text text-accent-color dark:text-accent-color-alt" onClick={handleToggleEmojiPicker} />
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

