import React from 'react'
import Image from "next/image";
import Link from "next/link";

const HeaderLinksIcons = ({
    link,
}: {
    link: { image?: string; icon?: JSX.Element; text: string; url: string };
}) => {
    const { image, icon, text, url } = link;

    return (
        <Link
            href={url}
            className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mt-4 px-4 py-2"
            aria-label={text}
            title={text}
            prefetch={false}
        >
            {image && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                    {/* <Image
                        width={30}
                        height={30}
                        className="object-cover"
                        src={image}
                        alt="profile_picture"
                    /> */}
                </div>
            )}

            {icon && <span className="w-6 h-6">{icon}</span>}

            {text && <span className="text-text text-lg font-medium ml-3 hidden  sm:block ">{text}</span>}
        </Link>

    )
}

export default HeaderLinksIcons
