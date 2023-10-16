'use client'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@/types/sessions_types';
import { User } from '@/types/user_types';
import { getChatUuid } from '@/utils/requests/_chats';

const AsideChats = ({ currentUser, users }: { currentUser: Session, users: User[] }) => {
    const router = useRouter()

    const handleStartConversation = async (user_id: number) => {
        const uuid = await getChatUuid({ user_id });
        router.push(`/conversations/${uuid}`);
    }

    return (
        <aside className="w-full sm:w-1/4 md:w-1/5 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 flex flex-col justify-between">
            <div className="text-center mb-4">
                <h1 className="text-2xl font-semibold">Hobbies</h1>
            </div>

            <div className="flex flex-col">
                {users.map((user) => (
                    <Button
                        key={user.id}
                        className="h-16 w-full mb-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleStartConversation(user.id)}
                    >
                        <div className="flex items-center space-x-2">
                            <Avatar className="w-10 h-10">
                                <AvatarImage
                                    src={user.profile_picture}
                                    alt={user.username}
                                    className="border rounded-full"
                                />
                            </Avatar>
                            <p className="text-gray-800 dark:text-white">{user.firstname} {user.lastname}</p>
                        </div>
                    </Button>
                ))}
            </div>

            <Button className="mb-4 h-16 flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Avatar className="w-12 h-12">
                    <AvatarImage
                        src={currentUser.profile_picture as string}
                        alt={currentUser.lastname as string}
                        className="border rounded-full"
                    />
                </Avatar>
                <p className="text-gray-800 dark:text-white ml-2">{currentUser.firstname} {currentUser.lastname}</p>
            </Button>

            <div className="text-center text-sm text-gray-400">
                © {new Date().getFullYear()} Hobbies App
            </div>
        </aside>
    );
};

export default AsideChats;