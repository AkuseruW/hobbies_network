import React from 'react'
import Image from "next/image";
import Link from "next/link";

const HeaderLinksIcons = ({
    link,
}: {
    link: { icon?: JSX.Element; text: string; url: string };
}) => {
    const { icon, text, url } = link;

    return (
        <Link
            href={url}
            className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-4 py-2"
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
        <Link
            href={url}
            className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-4 py-2"
            aria-label={text}
            title={text}
            prefetch={false}
        >
            {icon && <span className="w-6 h-6">{icon}</span>}
        </Link>
    )
}
