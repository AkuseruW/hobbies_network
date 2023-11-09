'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Session } from '@/types/sessions_types';
import { User } from '@/types/user_types';
import { getChatUuid } from '@/utils/requests/_chats';
import { ScrollArea } from '../ui/scroll-area';
import { getUsersPaginated } from '@/utils/requests/_users_requests';
import Searchbar from '../Searchbar';
import { Avatar, AvatarImage } from '../ui/avatar';
import { useToggleChat } from '@/providers/chatToogle';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import { headerLinks } from '../header/Hearder';
import HeaderLinksIcons from '../header/HeaderLinksIcons';

const AsideChats = ({ currentUser, initialUsers }: { currentUser: Session, initialUsers: User[] }) => {
    const { toggleIsUserListOpen, isUserListOpen } = useToggleChat();
    const [users, setUsers] = useState(initialUsers);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const search = typeof searchParams.get('search') === 'string' ? searchParams.get('search') : undefined;
        // function to get search user
        const getSearchUser = async () => {
            const { users } = await getUsersPaginated({ search: search?.toString() });
            setUsers(users);
        }
        getSearchUser();
    }, [searchParams]);

    // function to start conversation
    const handleStartConversation = async (user_id: number) => {
        const uuid = await getChatUuid({ user_id }); // Call the getChatUuid API function
        router.push(`/conversations/${uuid}`); // Redirect to the conversation
        toggleIsUserListOpen(); // Close the user list
    }

    return (
        <>
            <Button className="lg:hidden bg-transparent" variant={'ghost'} onClick={toggleIsUserListOpen}>
                {isUserListOpen ? <Icons.arrowLeft /> : <Icons.arrowRight />}
            </Button>
            <aside className={`border-r border-gray-300 lg:col-span-1 w-full lg:w-[35%] md:w-full h-full sm:h-[90vh] md:h-[94vh] lg:h-full relative ${isUserListOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="mx-3 my-3">
                    <Searchbar type='chat' />
                </div>

                <ScrollArea className={`h-[75vh] sm:h-[60vh] md:h-[75vh] lg:h-[80vh]`}>
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
                <nav className="border-t border-gray-300 p-2 bottom-0 w-full absolute">
                    <div className="flex items-center justify-between">
                        {headerLinks.map((link, index) => (
                            <HeaderLinksIcons key={index} link={link} chat={true} />
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default AsideChats;
