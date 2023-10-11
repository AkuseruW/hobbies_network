'use client'
import React, { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';

export const ImagePostPage = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleThumbnailClick = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  return (
    <div className="grid gap-4 w-full py-2">
      <div className='relative'>
        <Image
          width={600}
          height={600}
          src={selectedImage}
          alt=""
          className="object-contain h-[660px] w-full"
        />
      </div>

      <div className="flex space-x-4 container mt-2 overflow-x-auto">
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
