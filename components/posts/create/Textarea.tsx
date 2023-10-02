import { Session } from "@/types/sessions_types";

interface TextAreaInputProps {
    postContent: string;
    handlePostContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    currentUser: Session;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ postContent, handlePostContentChange, currentUser }) => {
    return (
        <div className="mb-4">
            <textarea
                id="postContent"
                name="postContent"
                className="w-full p-2 focus:outline-none h-32 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-300 resize-none"
                required
                value={postContent}
                onChange={handlePostContentChange}
                placeholder={`Quoi de nouveau, ${currentUser.firstname} ?`}
            />
        </div>
    );
};

export default TextAreaInput;
