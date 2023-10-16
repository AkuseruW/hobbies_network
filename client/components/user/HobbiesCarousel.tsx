'use client'
import { Hobby } from '@/types/hobby_types';
import React, { useState } from 'react'
import { Icons } from '../icons';
import IconColor from './iconColor';

export const HobbiesCarousel = ({ hobbies }: { hobbies: Hobby[] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const prevSlide = () => {
        setCurrentSlide((currentSlide - 1 + hobbies.length) % hobbies.length);
    };

    const nextSlide = () => {
        setCurrentSlide((currentSlide + 1) % hobbies.length);
    };
    return (
        <>
            <div className='flex justify-between'>
                <h2 className="text-2xl font-semibold mb-3">Mes hobbies</h2>
                <div className='flex'>
                    <button className=" p-4 text-gray-700 dark:text-gray-300" onClick={prevSlide}>
                        <Icons.chevronLeft />
                    </button>
                    <button className=" p-4 text-gray-700 dark:text-gray-300" onClick={nextSlide}>
                        <Icons.chevronRight />
                    </button>
                </div>
            </div>

            <div className="relative">
                <div className="flex space-x-8 overflow-x-auto">
                    {hobbies.map((hobby) => (
                        <div
                            key={hobby.id}
                            className="
                                flex flex-col items-center gap-2
                                bg-white p-4 relative w-28 h-26 overflow-hidden 
                                rounded-xl border border-gray-300 dark:border-gray-700
                                hover:border-gray-500 hover:shadow-lg transition-all
                                duration-300 ease-in-out dark:bg-gray-800 dark:text-white"
                        >
                            <IconColor icone_black={hobby.icone_black} icone_white={hobby.icone_white} />
                            <p>{hobby.name}</p>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

