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
import { HobbiesSelect } from "./DialogHobby";
import { useToast } from '@/components/ui/use-toast';


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
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState(false);
    const [selectedHobby, setSelectedHobby] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const handlePostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Update the post content state with the new value from the input field
        setPostContent(e.target.value);
    };

    const handleHobbyChange = (id: number) => {
        // Parse the selected hobby ID as an integer
        const selectedHobbyId = parseInt(id.toString());
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
        if (!isValid) {
            setError(true);
            toast({
                description: "Veuillez remplir tous les champs obligatoires.",
                variant: "destructive"
            })
            setIsLoading(false);
            return;
        }

        try {
            // Send a request to create a new post with the form data
            const res = await createPost({ formData });
            if (res) {
                if (res.detail) {
                    setError(true);
                    toast({
                        description: res.detail,
                        variant: "destructive"
                    })
                    setIsLoading(false);
                    return;
                }
                
                // Reset form fields and selected images
                setPostContent("");
                setSelectedImages([]);
                setSelectedHobby(null);
                setImagePreviews([]);

                // Set loading state to false and close the modal after a delay
                setTimeout(() => {
                    setIsLoading(false);
                    close();
                }, 1000);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Erreur lors de l'envoi du formulaire : ", error);
        }
    };

    return (
        <>
            <div className="flex justify-between">
                <UserInformation currentUser={currentUser} />
                <HobbiesSelect hobbies={hobbies} selectedHobby={selectedHobby} handleHobbyChange={handleHobbyChange} setIsValid={setIsValid} error={error} />
            </div>

            <form onSubmit={handleSubmit} className="dark:text-white ">
                <TextAreaInput
                    postContent={postContent}
                    handlePostContentChange={handlePostContentChange}
                    currentUser={currentUser}
                />
                <ImagePreviews
                    imagePreviews={imagePreviews}
                    handleRemoveImage={handleRemoveImage}
                />
                <div className="bsolute bottom-0 p-4 w-full">
                    <div className="flex bg-gray-50 dark:bg-secondary_dark border border-purple-100 dark:border-gray-400 rounded-2xl p-2 shadow-sm items-center">
                        <div className="lg:block hidden ml-1"> Ajouter a votre post</div>
                        <div className="flex flex-1 items-center lg:justify-end justify-center space-x-2">
                            <EmojiPicker content={postContent} setContent={setPostContent} />
                            <ImageInput handleImageChange={handleImageChange} />
                            {/* <svg className="text-red-600 h-9 p-1.5 rounded-full bg-red-100 w-9 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"> </path></svg> */}
                            {/* <svg className="text-green-600 h-9 p-1.5 rounded-full bg-green-100 w-9 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                            <svg className="text-pink-600 h-9 p-1.5 rounded-full bg-pink-100 w-9 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"> </path></svg>
                            <svg className="text-pink-600 h-9 p-1.5 rounded-full bg-pink-100 w-9 cursor-pointer" id="veiw-more" hidden fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"> </path></svg>
                            <svg className="text-pink-600 h-9 p-1.5 rounded-full bg-pink-100 w-9 cursor-pointer" id="veiw-more" hidden fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <svg className="text-purple-600 h-9 p-1.5 rounded-full bg-purple-100 w-9 cursor-pointer" id="veiw-more" hidden fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path> </svg> */}
                            {/* <svg className="hover:bg-gray-200 h-9 p-1.5 rounded-full w-9 cursor-pointer" id="veiw-more" uk-toggle="target: #veiw-more; animation: uk-animation-fade" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"> </path></svg> */}

                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <Button
                            type="submit"
                            className={`bg-black dark:bg-background_light dark:text-text_light w-full text-white px-4 py-2 rounded font-semibold ${isLoading ? 'cursor-not-allowed' : 'hover:bg-gray-900 dark:hover:bg-gray-300'
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
                </div>
            </form >
        </>
    );
};

export default FormNewPost;
