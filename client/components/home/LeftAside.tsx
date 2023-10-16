import React from 'react';
import { UserGroupIcon, HomeIcon, RectangleGroupIcon, } from "@heroicons/react/24/outline";
import HeaderLinksIcons from '../header/HeaderLinksIcons';
import { Button } from '../ui/button';

const LeftAside = () => {
    const headerLinks = [
        {
            icon: <HomeIcon className="w-6 h-6 text-accent-color" />,
            text: "Accueil",
            url: "/",
        },
        {
            icon: <RectangleGroupIcon className="w-6 h-6 text-accent-color" />,
            text: "Hobbies",
            url: "/hobbies",
        },
        {
            icon: <UserGroupIcon className="w-6 h-6 text-accent-color" />,
            text: "Utilisateurs",
            url: "/utilisateurs",
        }
        
    ];
    return (
        <div className="shadow-md aside-size h-[80%] bg-white dark:bg-gray-800 rounded-lg fixed z-11  dark:border-gray-800 mt-5">
            <div className="p-3 h-full">
                <div className="flex flex-col mt-5">
                    {headerLinks.map((link, index) => (
                        <div key={index} className='mt-4'>
                            <HeaderLinksIcons  link={link} />
                        </div>
                    ))}
                </div>

                <div className='absolute bottom-7 flex flex-col justify-center items-center'>
                    <Button className='w-[80%]'>Sign Out</Button>
                    <p className='text-[13px] text-gray-500 mt-5'>© 2023 Hobbies, Inc. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default LeftAside;
