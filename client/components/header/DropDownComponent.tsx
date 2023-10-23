import React from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import Link from 'next/link'
import SignoutBtn from './SignoutBtn'
import { Session } from '@/types/sessions_types'

const BtnProfile = ({ currentUser }: { currentUser: Session }) => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Image width={100} height={100}
                        src={`${currentUser?.profile_picture}`}
                        alt="profile_picture"
                        className='rounded'
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href={`/profil/${currentUser?.id}`} className='w-full'>
                        Mon Profil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/profil/settings`} className='w-full'>
                        settings
                    </Link>
                </DropdownMenuItem>
                {currentUser?.role === 'ROLE_ADMIN' && (
                    <DropdownMenuItem>
                        <Link href={`/dashboard`} className='w-full'>
                            Admin
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                    <SignoutBtn />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default BtnProfile


export const BtnMobileProfil = ({ currentUser }: { currentUser: Session }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='w-6 h-6'>
                    <Image
                        alt="profile_picture"
                        className="rounded-full"
                        src={`${currentUser?.profile_picture}`}
                        style={{
                            aspectRatio: "32/32",
                            objectFit: "cover",
                        }}
                        height="32"
                        width="32"
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='absolute bottom-14 -right-5'>
                <DropdownMenuItem>
                    <SignoutBtn />
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/profil/${currentUser?.id}`} className='w-full'>
                        Mon Profil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/profil/settings`} className='w-full'>
                        settings
                    </Link>
                </DropdownMenuItem>
                {currentUser?.role === 'ROLE_ADMIN' && (
                    <DropdownMenuItem>
                        <Link href={`/dashboard`} className='w-full'>
                            Admin
                        </Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}