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
import { Button } from "@/components/ui/button";

const FormNewPost = ({
    session: currentUser,
    postContent,
    setPostContent,
    hobbies,
    close
}: {
    session: Session;
    postContent: string;
    setPostContent: (content: string) => void;
    hobbies: Hobby[];
    close: () => void;
}) => {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedHobby, setSelectedHobby] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Update the post content state with the new value from the input field
        setPostContent(e.target.value);
    };

    const handleHobbyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Parse the selected hobby ID as an integer
        const selectedHobbyId = parseInt(e.target.value);
        // Update the selected hobby state with the new ID
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
        // Create a copy of the image previews array
        const updatedPreviews = [...imagePreviews];
        // Remove the image preview at the specified index
        updatedPreviews.splice(index, 1);
        // Update the state with the updated image previews
        setImagePreviews(updatedPreviews);

        // Create a copy of the selected images array
        const updatedSelectedImages = [...selectedImages];
        // Remove the selected image at the specified index
        updatedSelectedImages.splice(index, 1);
        // Update the state with the updated selected images
        setSelectedImages(updatedSelectedImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true

        // Create a FormData object to send form data
        const formData = new FormData();
        formData.append("content", postContent); // Add 'content' field to the form data
        formData.append("hobby_id", selectedHobby !== null ? selectedHobby.toString() : ""); // Add 'hobby_id' field to the form data
        // Add selected images to the form data
        selectedImages.forEach((image) => formData.append("images", image));

        try {
            // Send a request to create a new post with the form data
            const res = await createPost({ formData });
            if (res) {
                // Reset form fields and selected images
                setPostContent("");
                setSelectedImages([]);
                setSelectedHobby(null);
                setImagePreviews([]);

                // Set loading state to false and close the modal after a delay
                setTimeout(() => {
                    setIsLoading(false);
                    close();
                }, 2000);
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du formulaire : ", error);
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
                    <Button
                        type="submit"
                        className={`bg-black w-full text-white px-4 py-2 rounded font-semibold ${isLoading ? 'cursor-not-allowed' : 'hover:bg-gray-900 dark:hover:bg-gray-700'
                            } transition-colors`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center mx-auto">
                                <Icons.spinner className="w-6 h-6 animate-spin mr-2" /> En cours...
                            </div>
                        ) : (
                            'Publier'
                        )}
                    </Button>
                </div>
            </form>

        </>
    );
};

export default FormNewPost;
