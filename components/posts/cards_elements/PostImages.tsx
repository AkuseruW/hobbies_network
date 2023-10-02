'use client'
import Image from 'next/image';
import React, { useState } from 'react';

const PostImagesCarousel = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPreviousImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goToNextImage = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className="relative w-full">
            <div className="h-full w-full flex items-center justify-center my-auto">
                <Image
                    className="object-contain h-full w-full"
                    src={images[currentIndex]}
                    alt=""
                    height={500}
                    width={500}
                />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`h-4 w-4 rounded-full cursor-pointer ${currentIndex === index ? 'bg-white' : 'bg-gray-700'
                            }`}
                    ></span>
                ))}
            </div>
            <button
                onClick={goToPreviousImage}
                className="bg-transparent hover:bg-gray-500 text-white absolute h-full top-1/2 transform -translate-y-1/2 rounded px-2 py-1 left-0"
                disabled={currentIndex === 0}
            >
                Précédent
            </button>
            <button
                onClick={goToNextImage}
                className="bg-transparent hover:bg-gray-500 text-white h-full absolute top-1/2 transform -translate-y-1/2 rounded px-2 py-1 right-0"
                disabled={currentIndex === images.length - 1}
            >
                Suivant
            </button>
        </div>
    );
};

export default PostImagesCarousel;
