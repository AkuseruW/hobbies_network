import { Button } from '@/components/ui/button';
import { NotificationResponse } from '@/types/notifications_types';
import { Session } from '@/types/sessions_types';
import Image from 'next/image';
import React from 'react';
import Notifications from '../header/Notifications';

const HeaderAdmin = ({ currentUser, notifications }: { currentUser: Session, notifications: NotificationResponse }) => {

    return (
        <nav className="relative fixed flex w-full items-center justify-between text-neutral-200 shadow-lg lg:flex-wrap lg:justify-start lg:py-4 h-20 dark:bg-neutral-900">
            <div className="flex w-full items-center justify-between px-3 flex-row w-full">
                <div className="flex w-full justify-start h-full">
                    <button
                        className="block border-0 px-2 text-neutral-600 dark:text-neutral-200 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 lg:hidden"
                        type="button"
                        data-te-collapse-init
                        data-te-target="#navbarSupportedContent4"
                        aria-controls="navbarSupportedContent4"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="w-7 h-7">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-7 w-7"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>
                    </button>
                </div>
                <div className="flex flex-wrap w-full items-center space-x-2 flex-0 w-fit justify-end">
                    <Notifications notifications={notifications} />
                    <Button variant="outline" size="icon">
                        <Image
                            width={100}
                            height={100}
                            src={`${currentUser?.profile_picture}`}
                            alt="profile_picture"
                            className="rounded"
                        />
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default HeaderAdmin;
