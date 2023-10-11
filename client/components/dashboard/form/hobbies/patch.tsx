'use client'
import { Hobby } from '@/types/hobby_types';
import { getHobbyBySlug, updateHobby } from '@/utils/requests/_hobbies_requests';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';



const HobbyFormUpdate = ({ hobby }: { hobby: Hobby }) => {
    const router = useRouter()
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<Hobby>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = event.target.files;
            const imagesArray = [];

            for (let i = 0; i < files.length; i++) {
                imagesArray.push(URL.createObjectURL(files[i]));
            }
            setSelectedFile(files);
            setSelectedImage(imagesArray[0]);
        }
    };

    const onSubmit: SubmitHandler<Hobby> = async (data) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('slug', data.slug);
        formData.append('description', data.description as string);

        if (selectedFile) {
            const file = selectedFile[0];
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
            const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
            if (allowedExtensions.includes(`.${fileExtension}`)) {
                formData.append('banner', file);
            }
            else {
                console.error('Le fichier sélectionné n\'est pas une image valide.');
            }
        };

        const updatedCategory = await updateHobby({ slug: hobby.slug, formData });

        if (updatedCategory.success === true) {
            setIsLoading(false);
            router.back();
            router.refresh();
        }
    }

    useEffect(() => {
        if (hobby) {
            setValue('name', hobby.name)
            setValue('description', hobby.description)
            setValue('slug', hobby.slug)
        }
    }, [hobby, setValue]);

    return (
        <div className='container mt-16 w-3/4'>
            <h1 className="text-2xl font-bold tracking-tight">Update {hobby.name}</h1>
            <form onSubmit={handleSubmit(onSubmit)} className=" mt-16 ">
                <div className="pr-2">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            {...register('name', { required: true })}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            id="name"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                        {errors.name && <span className="text-red-500">Name is required</span>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="slug" className="block text-gray-700 font-medium mb-1">Slug</label>
                        <input
                            {...register('slug', { required: true })}
                            type="text"
                            id="slug"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                        {errors.slug && <span className="text-red-500">Slug is required</span>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea
                            {...register('description')}
                            id="description"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="image" className="block font-medium text-gray-700 dark:text-white">Icon</label>
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e)}
                        />
                    </div>
                </div>


                <div className="mt-8">
                    <button type="submit" className="bg-black text-white px-4 py-2 rounded-md w-3/6" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Category'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default HobbyFormUpdate