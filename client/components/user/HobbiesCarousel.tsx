'use client'
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Hobby } from '@/types/hobby_types';
import IconColor from './iconColor';

export const HobbiesCarousel = ({ hobbies }: { hobbies: Hobby[] }) => {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    return (
        <div className='sm:container'>
            <h2 className="text-2xl font-semibold mb-3">Mes hobbies</h2>
            <Slider {...settings}>
                {hobbies.map((hobby) => (
                    <div key={hobby.id} className='w-[20%]'>
                        <div className="flex flex-col items-center gap-2 bg-white p-4 relative w-32 h-40 overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-lg dark:hover:border-gray-500 transition-all duration-300 ease-in-out dark:bg-secondary_dark dark:text-white">
                            <IconColor icone_black={hobby.icone_black} icone_white={hobby.icone_white} />
                            <p>{hobby.name}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};
