import { useState } from "react";
import { Icons } from "@/components/icons";
import { Hobby } from "@/types/hobby_types";
import { Session } from "@/types/sessions_types";
import ImagePreviews from "./ImagePreviews";
import UserInformation from "./UserInformation";
import TextAreaInput from "./Textarea";
import ImageInput from "./ImageInput";
import EmojiPicker from "@/components/EmojiPicker";
import { createPost } from "@/utils/requests/_posts_requests";

const FormNewPost = ({
    session: currentUser,
    postContent,
    setPostContent,
    hobbies,
}: {
    session: Session;
    postContent: string;
    setPostContent: (content: string) => void;
    hobbies: Hobby[];
}) => {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedHobby, setSelectedHobby] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPostContent(e.target.value);
    };

    const handleHobbyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedHobbyId = parseInt(e.target.value);
        setSelectedHobby(selectedHobbyId);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            // Create an array of temporary URLs for the selected images and set them as the image previews
            const previews = selectedFiles.map((file) => URL.createObjectURL(file));
            setImagePreviews(previews);
            setSelectedImages(selectedFiles);
        }
    };

    const handleRemoveImage = (index: number) => {
        // Remove the temporary URL for the image
        URL.revokeObjectURL(imagePreviews[index]);
        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);
        setImagePreviews(updatedPreviews);

        const updatedSelectedImages = [...selectedImages];
        updatedSelectedImages.splice(index, 1);
        setSelectedImages(updatedSelectedImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("content", postContent);
        formData.append("hobby_id", selectedHobby !== null ? selectedHobby.toString() : "");
        selectedImages.forEach((image) => formData.append("images", image));

        try {
            const res = await createPost({ formData });
            if (res) {
                setPostContent("");
                setSelectedImages([]);
                setSelectedHobby(null);
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du formulaire : ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <UserInformation currentUser={currentUser} />

            <form onSubmit={handleSubmit} className="dark:text-white">
                <TextAreaInput
                    postContent={postContent}
                    handlePostContentChange={handlePostContentChange}
                    currentUser={currentUser}
                />
                <div className="flex items-center justify-end mt-2">
                    <div className="flex-shrink-0 mr-2">
                        <ImageInput handleImageChange={handleImageChange} />
                    </div>
                    <div className="flex-shrink-0">
                        <EmojiPicker content={postContent} setContent={setPostContent} />
                    </div>
                </div>
                <ImagePreviews
                    imagePreviews={imagePreviews}
                    handleRemoveImage={handleRemoveImage}
                />
                <select
                    id="hobby"
                    name="hobby"
                    onChange={handleHobbyChange}
                    value={selectedHobby || ""}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300 my-4"
                >
                    <option value="">Sélectionnez un hobby</option>
                    {hobbies.map((hobby) => (
                        <option key={hobby.id} value={hobby.id}>
                            {hobby.name}
                        </option>
                    ))}
                </select>

                <div className="text-center">
                    <button
                        type="submit"
                        className={`bg-black w-full text-white px-4 py-2 rounded font-semibold ${isLoading ? 'cursor-not-allowed' : 'hover:bg-gray-900 dark:hover:bg-gray-700'
                            } transition-colors`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Icons.spinner />
                        ) : (
                            'Publier'
                        )}
                    </button>
                </div>
            </form>

        </>
    );
};

export default FormNewPost;
