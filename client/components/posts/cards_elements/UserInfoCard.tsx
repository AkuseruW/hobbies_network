'use client';
import React, { Suspense } from "react";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { PostData } from "@/types/post_types";
import DropDownBtn from "./DropDownCardPost";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

const UserInfo = ({ data }: { data: PostData }) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === "dark";

    return (
        <div className="relative p-4 items-center justify-between dark:text-white">
            <div className="flex">
                <Suspense fallback={<Skeleton className="h-12 w-12 rounded-full" />}>
                    <Link href={`/profil/${data.user.user_id}`}>
                        <Avatar>
                            <AvatarImage
                                src={data.user.profile_picture}
                                alt={data.user.username}
                            />
                        </Avatar>
                    </Link>
                </Suspense>
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

                    <p className="text-[rgba(97,97,97,1)] dark:text-text_dark text-sm sm:text-base">
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
