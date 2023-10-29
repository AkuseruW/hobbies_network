'use client';
import { User } from '@/types/user_types';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import React from 'react'

const Badge = ({ user }: { user: User }) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === "dark";
    return (
        <>
            {user.is_certified && (
                <Image
                    width={20}
                    height={20}
                    src={`/assets/${isDarkMode ? "certif_blue.svg" : "certif_black.svg"}`}
                    alt="certif"
                    className="ml-2"
                />
            )}
        </>
    )
}

export default Badge
