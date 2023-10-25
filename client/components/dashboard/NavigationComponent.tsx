'use client'
import React from 'react';
import Link from 'next/link';

interface NavigationItemProps {
    link: string;
    icon: React.ReactElement;
    text: string;
}

const NavigationItem = ({ link, icon, text }: NavigationItemProps) => {
    return (
        <li className="flex items-center">
            <Link href={link}
                className="text-gray-700 flex items-center hover:text-blue-500 dark:text-white dark:hover:text-blue-500 font-medium text-lg sm:text-sm">
                {icon}
                <span>{text}</span>
            </Link>
        </li>
    );
}

export default NavigationItem;
