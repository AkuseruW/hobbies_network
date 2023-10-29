'use client'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Session } from '@/types/sessions_types';
import { User } from '@/types/user_types';
import { getChatUuid } from '@/utils/requests/_chats';
import { ScrollArea } from '../ui/scroll-area';
import { getUsersPaginated } from '@/utils/requests/_users_requests';
import Searchbar from '../Searchbar';
import { string } from 'zod';

const AsideChats = ({ currentUser, initialUsers }: { currentUser: Session, initialUsers: User[] }) => {
    const [users, setUsers] = useState(initialUsers);
    const router = useRouter()
    const searchParams = useSearchParams();


    useEffect(() => {
        const search = typeof searchParams.get('search') === 'string' ? searchParams.get('search') : undefined
        const getSearchUser = async () => {
            const { users } = await getUsersPaginated({ search: search?.toString() });
            setUsers(users);
        }
        getSearchUser();

    }, [searchParams]);

    const handleStartConversation = async (user_id: number) => {
        const uuid = await getChatUuid({ user_id });
        router.push(`/conversations/${uuid}`);
    }

    return (
        <aside className="w-full bg-white dark:bg-secondary_dark text-gray-800 dark:text-white p-4 flex flex-col justify-between h-[100%]">
            <div className="text-center mb-4">
                <h1 className="text-2xl font-semibold">Hobbies</h1>
            </div>

            <Searchbar type='chat' />

            <ScrollArea className="flex flex-col h-[50%]">
                {users.map((user) => (
                    <Button
                        key={user.id}
                        className="h-16 w-full mb-2 bg-white dark:bg-primary_dark text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            </ScrollArea>

            <Button className="mb-4 h-16 flex items-center bg-white dark:bg-primary_dark text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
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