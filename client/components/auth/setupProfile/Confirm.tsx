'use client'
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import ImageUpload from './ImageUpload ';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import Spinner from '@/components/Spinner';
import { deleteCookie } from 'cookies-next'
import { Hobby } from '@/types/hobby_types';
import { setUpProfil } from '@/utils/requests/_auth_requests';
import { setSetupCookies } from '@/utils/_auth_cookies';

interface UserInformation {
    data: {
        firstname: string;
        lastname: string;
        bio: string;
        hobbies: Hobby[];
        hobbyIds: number[];
    };
}

const ConfirmUserInfo: React.FC<UserInformation> = ({ data }) => {
    const ref = useRef<HTMLInputElement | null>(null);
    const [src, setSrc] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast()

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    description: "La taille de l'image ne doit pas dépasser 5 Mo.",
                    variant: "destructive"
                })
            } else {
                setImageFile(file);
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
        setSrc('');
        setImageFile(null);
        if (ref.current) {
            ref.current.value = '';
        }
    };

    const handleSetUpProfil = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('firstName', data.firstname);
            formData.append('lastName', data.lastname);
            formData.append('bio', data.bio);

            if (imageFile) {
                formData.append('profile_picture', imageFile!);
            }
            if (data.hobbies) {
                data.hobbyIds.forEach((hobby_id: number) => {
                    formData.append('hobbies', hobby_id.toString());
                });
            }
            const response = await setUpProfil({ formData });

            if (response.success) {
                const { lastname, firstname, profile_picture, id, role } = response.data;
                await setSetupCookies(lastname, firstname, profile_picture, id, role);
                deleteCookie('hobbies_info');
                deleteCookie('setup_info');
                router.push("/");
            } else {
                toast({
                    description: response.data.detail,
                    variant: "destructive"
                })
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full justify-center items-center mb-12">
            <div className="px-6 py-8 h-[500px] rounded-md border p-4 mt-4 bg-white dark:bg-secondary_dark dark:border-gray-400 w-3/4">
                <div className="flex justify-center text-center">
                    <ImageUpload
                        src={src}
                        ref={ref}
                        handleImageUpload={handleImageUpload}
                        handleImageDelete={handleImageDelete}
                    />
                </div>
                <div className="text-gray-800 mt-6 space-y-14">
                    <p className="text-xl font-semibold mb-6 dark:text-white text-center">
                        {data?.firstname} {data?.lastname}
                    </p>
                    <p className="text-lg text-gray-600 mb-4 dark:text-white">Bio: {data?.bio}</p>
                    <div className="mb-2 flex space-x-3 ">
                        <span className="text-lg text-gray-700 dark:text-white">Hobbies :</span>
                        <p className="text-lg text-gray-700 dark:text-white space-x-3">
                            {data?.hobbies
                                ? data.hobbies.map((hobby, index) => (
                                    <span key={index}>
                                        {hobby.name}
                                        {index !== data.hobbies.length - 1 ? ', ' : ''}
                                    </span>
                                ))
                            : ''}
                        </p>
                    </div>
                </div>
            </div>
            <Button
                onClick={handleSetUpProfil}
                className={`mt-8 w-[25%] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? <Spinner /> : 'Terminer'}
            </Button>

        </div>
    );
};

export default ConfirmUserInfo;
