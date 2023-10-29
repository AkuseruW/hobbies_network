'use client'
import React from 'react'
import Link from "next/link";
import { usePathname } from 'next/navigation';

const HeaderLinksIcons = ({
    link,
}: {
    link: { icon?: JSX.Element; text: string; url: string };
}) => {
    const { icon, text, url } = link;
    const pathname = usePathname()


    return (
        <Link
            href={url}
            className={
                pathname === url
                    ? "bg-gray-200 dark:bg-gray-700 hover:bg-muted flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-4 py-2"
                    : "hover:bg-transparent hover:underline flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-4 py-2"
            }
            aria-label={text}
            title={text}
            prefetch={false}
        >
            {icon && <span className="w-6 h-6">{icon}</span>}
            {text && <span className="text-text text-lg font-medium ml-3 hidden  sm:block ">{text}</span>}
        </Link>

    )
}

export default HeaderLinksIcons

export const MobileLinksIcons = ({ link }: { link: { icon?: JSX.Element; text: string; url: string } }) => {
    const { icon, text, url } = link;

    return (
        <>
            <Link
                href={url}
                className="flex items-center rounded-full cursor-pointerrounded-md px-3 py-2"
                aria-label={text}
                title={text}
                prefetch={false}
            >
                {icon && <span className="w-6 h-6">{icon}</span>}
            </Link>

        </>
    )
}
