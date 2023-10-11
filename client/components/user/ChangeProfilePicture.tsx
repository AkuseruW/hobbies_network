'use client'
import { Button } from '@/components/ui/button'
import React, { useRef, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from '../ui/separator'
import ImageUpload from '../auth/setupProfile/ImageUpload '
import { useToast } from '../ui/use-toast'
import { updateProfilPicture } from '@/utils/requests/_users_requests'
import { updateProfilePictureInCookie } from '@/utils/_auth_cookies'
import { useRouter } from 'next/navigation'
import { Icons } from '../icons'


export const ChangeProfilePicture = () => {
    const ref = useRef<HTMLInputElement | null>(null);
    const [src, setSrc] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()
    const router = useRouter()

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Check if a file is selected by the user.
        if (event.target.files && event.target.files[0]) {
            // Get the selected file.
            const file = event.target.files[0];

            // Check if the file size exceeds 5 MB.
            if (file.size > 5 * 1024 * 1024) {
                // Display an error message using the toast.
                toast({
                    description: "The image size should not exceed 5 MB.",
                    variant: "destructive"
                });
            } else {
                // Set the selected file in the state.
                setImageFile(file);

                // Read the selected file and set it as the image source.
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target && e.target.result) {
                        setSrc(e.target.result.toString());
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };



    const handleImageDelete = () => {
        // Clear the image source and image file state.
        setSrc('');
        setImageFile(null);

        // Check if the file input element (ref.current) exists.
        if (ref.current) {
            // Reset the value of the file input element to clear the selected file.
            ref.current.value = '';
        }
    };


    const handleChangeProfilePicture = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', imageFile!);

        try {
            // Try to update the profile picture on the server.
            const res = await updateProfilPicture({ formData });

            if (res.success) {
                // If the update is successful, update the profile picture in cookies.
                updateProfilePictureInCookie(res.profile_picture);

                // Show a success message to the user.
                toast({
                    title: "Profile picture changed",
                    description: "Your profile picture has been successfully updated.",
                });

                // Refresh the page to reflect the changes.
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        } finally {
            // Ensure that isLoading is set to false regardless of success or failure.
            setIsLoading(false);
        }
    };


    return (
        <>
            <Dialog>
                <DialogTrigger className="icon_change_photo md:block absolute bottom-0 right-0 w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 border-2 border-white bg-gray-300 flex items-center justify-center rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-lg text-center'>Voulez vous changer de photo ?</DialogTitle>
                        <Separator />
                        <DialogDescription className='pt-4 flex justify-center flex-col'>
                            <div className="flex justify-center text-center">
                                <ImageUpload
                                    src={src}
                                    ref={ref}
                                    handleImageUpload={handleImageUpload}
                                    handleImageDelete={handleImageDelete}
                                />
                            </div>
                            <Button disabled={isLoading} onClick={handleChangeProfilePicture} size="lg" className='mt-4' >
                                {isLoading ? <Icons.spinner className='animate-spin' /> : 'Modifier'}
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}
