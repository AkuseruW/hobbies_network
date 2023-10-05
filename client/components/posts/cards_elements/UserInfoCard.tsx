import React from "react";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { PostData } from "@/types/post_types";
import DropDownBtn from "./DropDownCardPost";
import DropDownComponent from "@/components/header/DropDownComponent";

const UserInfo = ({ data }: { data: PostData }) => {
    const isDarkMode = false;

    const dropMenuItems = [
        { 'label': 'Signaler', 'href': `/profil/${data.user.user_id}` },
    ]

    const trigger = (
        <svg
            className="w-5 h-5 text-gray-500"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
        </svg>
    )

    return (
        <div className="relative p-4 items-center justify-between dark:text-white">
            <div className="flex">
                <Link href={`/profil/${data.user.user_id}`}>
                    <Avatar>
                        <AvatarImage
                            src={data.user.profile_picture}
                            alt={data.user.username}
                        />
                    </Avatar>
                </Link>
                <div className="flex flex-col ml-2">
                    <div className="flex items-center">
                        <Link href={`/profil/${data.user.user_id}`}>
                            <strong className="text-sm sm:text-base">{data.user.username}</strong>
                        </Link>
                        {data.user.is_certified && (
                            <Image
                                width={100}
                                height={100}
                                src={`/assets/${isDarkMode ? "certif_blue.svg" : "certif_black.svg"}`}
                                alt="certif"
                                className="ml-2 h-4 w-3"
                            />
                        )}
                    </div>

                    <p className="text-[rgba(97,97,97,1)] text-sm sm:text-base">
                        {data.time_of_publication}
                    </p>
                </div>
            </div>
            <div className="absolute top-5 right-5">
                <DropDownBtn postId={data.id} user_id={data.user.user_id} />
            </div>
        </div>

    )
}


export default UserInfo;
