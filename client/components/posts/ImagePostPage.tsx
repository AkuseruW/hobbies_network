'use client'
import React, { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';

export const ImagePostPage = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle thumbnail click, set the selected image and index
  const handleThumbnailClick = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  return (
    <div className="grid gap-4 w-full py-2 relative">
      <div>
        <Image
          width={600}
          height={600}
          src={selectedImage}
          alt=""
          className="object-contain h-[60%] max-sm:h-[100%] xl:h-[42%] w-full"
        />
      </div>

      <div className="flex space-x-4 container mt-2 overflow-x-auto bottom-4 w-full lg:absolute md:absolute">
        {images.map((image, index) => (
          <div key={image}>
            <Image
              width={100}
              height={100}
              src={image}
              alt=""
              className={`thumbnail-image w-[100px] h-[100px] object-cover rounded cursor-pointer ${index === currentIndex ? 'selected' : ''}`}
              onClick={() => handleThumbnailClick(image, index)}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        .selected {
          border: 2px solid #0070f3;
        }
      `}</style>
    </div>
  );
};
