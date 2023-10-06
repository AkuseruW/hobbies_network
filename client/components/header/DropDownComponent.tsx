// 'use client';
// import React from 'react';
// import { Button } from '../ui/button';
// import Link from 'next/link';
// import { useDropdown } from '../DropdownEvent';

// interface MenuItem {
//     label: string;
//     href?: string;
//     component?: React.ReactNode;
// }

// interface DropDownComponentProps {
//     menuItems: MenuItem[];
//     trigger: React.ReactNode;
// }

// const DropDownComponent: React.FC<DropDownComponentProps> = ({ menuItems, trigger }) => {
//     const { isOpen, toggleDropdown } = useDropdown();

//     return (
//         <div id="dropdown" className="flex flex-col items-center">
//             <Button
//                 variant="link"
//                 size="icon"
//                 onClick={toggleDropdown}
//             >
//                 {trigger}
//             </Button>

//             {isOpen && (
//                 <div className="origin-top-right absolute top-20 right-0 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
//                     <div>
//                         {menuItems.map((item, index) => (
//                             <React.Fragment key={index}>
//                                 {item.component ? (
//                                     <span className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg'>
//                                         {item.component}
//                                     </span>
//                                 ) : (
//                                     <Link className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
//                                         onClick={toggleDropdown}
//                                         href={item.href ?? "#"}>
//                                         {item.label}
//                                     </Link>
//                                 )}
//                             </React.Fragment>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DropDownComponent;

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
import { Avatar, AvatarImage } from '@/components/ui/avatar';

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