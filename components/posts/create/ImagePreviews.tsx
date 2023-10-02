import { Icons } from '@/components/icons';
import Image from 'next/image';

interface ImagePreviewsProps {
    imagePreviews: string[];
    handleRemoveImage: (index: number) => void;
}

const ImagePreviews: React.FC<ImagePreviewsProps> = ({ imagePreviews, handleRemoveImage }) => {
    return (
        <>
            {imagePreviews.length > 0 && (
                <div className="mb-4 grid gap-4 md:grid-cols-3 overflow-x-auto h-40">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative w-full h-full">
                            <div className="flex items-center justify-center w-full h-full">
                                <Image
                                    src={preview}
                                    className="object-cover w-full h-full flex items-center justify-center"
                                    alt={`Selected ${index}`}
                                    height={300}
                                    width={300}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 text-red-500"
                            >
                                <Icons.close className="stroke-black" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default ImagePreviews;
