'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SignoutBtn from './SignoutBtn'
import { Session } from '@/types/sessions_types'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'


const BtnProfile = ({ currentUser }: { currentUser: Session }) => {

    return (
        <Menu as="div" className="relative inline-block text-left ">
            <div>
                <Menu.Button
                    className='border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 flex items-center justify-center dark:bg-secondary_dark border-none'
                >
                    <Image width={100} height={100}
                        src={`${currentUser?.profile_picture}`}
                        alt="profile_picture"
                        className='rounded'
                    />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 
                origin-top-right rounded-md bg-white shadow-lg ring-1 
                dark:bg-background_dark 
                ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            <Link href={`/profil/${currentUser?.id}`} className='hover:bg-secondary w-full block px-4 py-2 text-sm dark:hover:bg-secondary_dark'>
                                Mon Profil
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link href={`/profil/settings`} className='hover:bg-secondary dark:hover:bg-secondary_dark w-full block px-4 py-2 text-sm'>
                                settings
                            </Link>
                        </Menu.Item>
                        {currentUser?.role === 'ROLE_ADMIN' && (
                            <Menu.Item>
                                <Link href={`/dashboard`} className='hover:bg-secondary dark:hover:bg-secondary_dark w-full block px-4 py-2 text-sm'>
                                    Admin
                                </Link>
                            </Menu.Item>
                        )}
                        <SignoutBtn />
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default BtnProfile


export const BtnMobileProfil = ({ currentUser }: { currentUser: Session }) => {
    return (
        <Menu as="div" className="relative inline-block text-left ">
            <div>
                <Menu.Button
                    className='border-none hover:text-accent-foreground h-6 w-6 flex items-center justify-center border-none'
                >
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
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 
                    bottom-[51px] rounded-md bg-white shadow-lg ring-1 
                    dark:bg-background_dark
                    ring-black ring-opacity-5 focus:outline-none"
                >
                    <div className="py-1">
                        <Menu.Item>
                            <Link href={`/profil/${currentUser?.id}`} className='hover:bg-secondary w-full block px-4 py-2 text-sm dark:hover:bg-secondary_dark'>
                                Mon Profil
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link href={`/profil/settings`} className='hover:bg-secondary dark:hover:bg-secondary_dark w-full block px-4 py-2 text-sm'>
                                settings
                            </Link>
                        </Menu.Item>
                        {currentUser?.role === 'ROLE_ADMIN' && (
                            <Menu.Item>
                                <Link href={`/dashboard`} className='hover:bg-secondary dark:hover:bg-secondary_dark w-full block px-4 py-2 text-sm'>
                                    Admin
                                </Link>
                            </Menu.Item>
                        )}
                        <SignoutBtn />
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}