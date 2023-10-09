'use client'
import React, { forwardRef } from 'react';
import { Icons } from '@/components/icons';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface ImageUploadProps {
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    src: string;
    setSrc?: React.Dispatch<React.SetStateAction<string>>;
    setImageFile?: React.Dispatch<React.SetStateAction<File | null>>;
    handleImageDelete: () => void;
    accept?: string;
}

const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
    (
        { handleImageUpload, src, setSrc, setImageFile, handleImageDelete, accept },
        ref
    ) => {
        return (
            <>
                <input
                    type="file"
                    id="profilePicture"
                    accept={accept || 'image/jpeg, image/png'}
                    onChange={handleImageUpload}
                    ref={ref}
                    className="border border-gray-300 rounded inset-0 opacity-0 hidden"
                />
                <div
                    className={`bg-black w-32 h-32 relative rounded-full flex items-center justify-center ${!src && 'outline outline-1 outline-zinc-300'
                        }`}
                >
                    {src ? (
                        <>
                            <Avatar className="w-full h-full">
                                <AvatarImage
                                    src={src}
                                    alt="Profile picture"
                                    className="w-full h-full object-cover"
                                />
                            </Avatar>
                            <div
                                onClick={handleImageDelete}
                                className="absolute right-0 w-[25px] h-[25px] top-[10%] rounded-full flex items-center justify-center outline-zinc-200 outline outline-1 bg-white"
                            >
                                <Icons.close className="w-4 h-4 text-black" />
                            </div>
                        </>
                    ) : (
                        <label
                            htmlFor="profilePicture"
                            className="bg-white px-6 py-6 rounded-full flex items-center justify-center cursor-pointer w-32 h-32"
                        >
                            <Icons.add className="w-12 h-12 text-black" />
                        </label>
                    )}
                </div>
            </>
        );
    }
);

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;