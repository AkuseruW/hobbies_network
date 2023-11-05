'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Session } from '@/types/sessions_types';
import { User } from '@/types/user_types';
import { getChatUuid } from '@/utils/requests/_chats';
import { ScrollArea } from '../ui/scroll-area';
import { getUsersPaginated } from '@/utils/requests/_users_requests';
import Searchbar from '../Searchbar';
import { string } from 'zod';
import { Avatar, AvatarImage } from '../ui/avatar';

const AsideChats = ({ currentUser, initialUsers }: { currentUser: Session, initialUsers: User[] }) => {
    const [users, setUsers] = useState(initialUsers);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isUserListOpen, setIsUserListOpen] = useState(true);

    useEffect(() => {
        const search = typeof searchParams.get('search') === 'string' ? searchParams.get('search') : undefined;
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
        <>
            <button className="lg:hidden" onClick={() => setIsUserListOpen(!isUserListOpen)}>
                {isUserListOpen ? 'Fermer la liste' : 'Ouvrir la liste'}
            </button>
            <aside className={`border-r border-gray-300 lg:col-span-1 ${isUserListOpen ? 'block' : 'hidden'}`}>
                <div className="mx-3 my-3">
                    <Searchbar type='chat' />
                </div>

                <ScrollArea className="overflow-auto h-[75vh]">
                    <h2 className="my-2 mb-2 ml-2 text-lg text-gray-600">Chats</h2>
                    {users.map((user) => (
                        <button
                            key={user.id}
                            className="p-2 rounded h-16 w-full mb-2 bg-white dark:bg-primary_dark text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                        </button>
                    ))}
                </ScrollArea>
            </aside>
        </>
    );
};

export default AsideChats;
