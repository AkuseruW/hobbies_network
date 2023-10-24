import Image from 'next/image';
import React, { useState } from 'react';

const PostImagesCarousel = ({ images }: { images: string[] }) => {
    const [showGallery, setShowGallery] = useState(images.length > 1);

    const maxImagesToShow = 6;
    const visibleImages = showGallery ? images.slice(0, maxImagesToShow) : images;
    const remainingImagesCount = Math.max(images.length - maxImagesToShow, 0);

    return (
        <div className="relative w-full">
            <div className="h-full w-full flex items-center justify-center my-auto">
                {showGallery ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {visibleImages.map((imageUrl, index) => (
                            <div key={index} className={index === images.length - 1 ? "relative" : ""}>
                                <Image className="max-w-full rounded-lg h-full object-cover" src={imageUrl} alt="" width={300} height={300} />
                                {index === images.length - 1 && remainingImagesCount > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg h-full w-full">
                                        <span className="text-white z-50 h-full w-full">{remainingImagesCount} autre{remainingImagesCount > 1 ? 's' : ''}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Image className="h-auto max-w-full rounded-lg w-full" src={images[0]} alt="" width={515} height={500} />
                )}
            </div>
        </div>
    );
};

export default PostImagesCarousel;
