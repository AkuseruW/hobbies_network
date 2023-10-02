'use client';
import slugify from 'slugify';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { createHobby } from '@/utils/requests/_hobbies_requests';

type FormData = {
    name: string;
    price: number;
    stock: number;
    brand: string;
    description?: string;
    slug: string;
    cover: FileList;
    publish?: boolean;
    category: string;
};

export const CategoryFormCreate = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any | null>(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
    const { toast } = useToast()

    useEffect(() => {
        // Generate a slug from the 'name' field and set it in the form data
        const slugValue = slugify(name, { lower: true });
        setValue("slug", slugValue);
    }, [name, setValue]);

    const handleFileChange = (event: any) => {
        if (event.target.files) {
            const files = event.target.files;
            const svgArray = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Check if the file is an SVG file
                if (file.type === "image/svg+xml") {
                    const reader = new FileReader();

                    reader.onload = async (e) => {
                        const svgText = e.target?.result as string;

                        // Parse the SVG file
                        const parser = new DOMParser();
                        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

                        // Clone the SVG to have two identical copies
                        const svgElementBlack = svgDoc.documentElement.cloneNode(true) as SVGSVGElement;
                        const svgElementWhite = svgDoc.documentElement.cloneNode(true) as SVGSVGElement;

                        // Modify the stroke color to black for one and white for the other
                        svgElementBlack.setAttribute("stroke", "black");
                        svgElementWhite.setAttribute("stroke", "white");

                        // Convert the modified SVGs to text strings
                        const modifiedSvgTextBlack = new XMLSerializer().serializeToString(svgElementBlack);
                        const modifiedSvgTextWhite = new XMLSerializer().serializeToString(svgElementWhite);

                        // Add both modified SVG strings to selectedFile
                        svgArray.push(new Blob([modifiedSvgTextBlack], { type: "image/svg+xml" }));
                        svgArray.push(new Blob([modifiedSvgTextWhite], { type: "image/svg+xml" }));
                    };

                    reader.readAsText(file);
                } else {
                    svgArray.push(URL.createObjectURL(file));
                }
            }
            setSelectedFile(svgArray);
        }
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        // Prepare form data for submission
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('slug', data.slug);
        formData.append('description', data.description as string);
        if (selectedFile) {
            const fileBlack = selectedFile[0];
            const fileWhite = selectedFile[1];
            formData.append('black', fileBlack);
            formData.append('white', fileWhite);
            setLoading(true);
            try {
                // Create a new category using the provided form data
                const newCategory = await createHobby({ formData });

                if (newCategory) {
                    setLoading(false);
                    router.refresh();
                    toast({
                        description: `${newCategory.message}`,
                    })
                }
            } catch (error) {
                console.error('An error occurred during creation:', error);
                setLoading(false);
            }

        } else {
            toast({
                description: "Image required",
                variant: "destructive"
            })
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="container mt-16 w-3/4">
            <div className=" pr-2">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1 dark:text-white">Name</label>
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
                    <label htmlFor="slug" className="block text-gray-700 font-medium mb-1 dark:text-white">Slug</label>
                    <input
                        {...register('slug', { required: true })}
                        type="text"
                        id="slug"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                    {errors.slug && <span className="text-red-500">Slug is required</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-1 dark:text-white">Description</label>
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

            <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md w-2/4 mt-5"
                disabled={loading}
            >
                {loading ? 'Creating...' : 'Create Hobby'}
            </button>
        </form>
    );
};
