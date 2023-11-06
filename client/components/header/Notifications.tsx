'use client'
import { Icons } from '@/components/icons'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { notification_is_read } from '@/utils/requests/_notifications_requests'
import { Fragment, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useNotificationsStore } from '@/lib/store/notifications_store'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'


const Notifications = ({ client }: { client?: boolean }) => {
    const { notifications, removeNotifications } = useNotificationsStore();
    const router = useRouter();

    const deleteNotification = async (id: number, title: string, message_room_id: string, user_id: number) => {
        await notification_is_read({ notification_id: id });
        removeNotifications(id);
        if (client) {
            title === 'Message' ? router.push(`/conversations/${message_room_id}`) :
                router.push(`/profil/${user_id}`)
        }
    }

    return (
        <Menu as="div" className="relative inline-block text-left ">
            <div>
                <Menu.Button
                    className='border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10
                    flex items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 dark:bg-secondary_dark dark:border-gray-600 dark:hover:bg-zinc-700'
                >
                    <Icons.bell className="w-4 h-4 text-black dark:text-white" />
                    {notifications.length > 0 && (
                        <span className="rounded text-[12px] relative top-[-5px] text-black dark:text-white">
                            {notifications.length}
                        </span>
                    )}
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right
                    origin-top-right rounded-md bg-white shadow-lg ring-1 
                    dark:bg-background_dark
                    ring-black ring-opacity-5 focus:outline-none"
                >
                    <div className="py-1">
                        {notifications.length === 0 && (
                            <p className='text-center text-sm p-2'>
                                Aucune notification
                            </p>
                        )}
                        {notifications.map((notification) => (
                            <Menu.Item key={notification.id}>
                                <Button
                                    onClick={() => deleteNotification(
                                        notification.id,
                                        notification.title,
                                        notification.message_room_id,
                                        notification.user.id
                                    )}

                                    className="bg-transparent
                                    cursor-pointer h-full w-full py-2 m-0 dark:text-white
                                    w-full hover:bg-accent hover:text-accent-foreground
                                    dark:hover:bg-secondary_dark"
                                >
                                    <div className="flex items-center">
                                        <Avatar className="w-6 h-6 mr-2">
                                            <AvatarImage
                                                src={notification.user.profile_picture}
                                                alt={notification.user.profile_picture}
                                                className="border rounded-full"
                                            />
                                        </Avatar>
                                        <p className="flex flex-col pl-2">
                                            <span className="text-[12px] text-muted-foreground">{notification.content}</span>
                                        </p>
                                    </div>
                                </Button>
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default Notifications;

export const NotificationMobile = ({ client }: { client?: boolean }) => {
    const { notifications, removeNotifications } = useNotificationsStore();
    const router = useRouter();

    const deleteNotification = async (id: number, title: string, message_room_id: string, user_id: number) => {
        await notification_is_read({ notification_id: id });
        removeNotifications(id);
        if (client) {
            title === 'Message' ?
                router.push(`/conversations/${message_room_id}`) :
                router.push(`/profil/${user_id}`)
        }
    }

    return (
        <Menu as="div" className="relative inline-block text-left ">
            <div>
                <Menu.Button
                    className='h-6 w-6
                    flex items-center justify-center'
                >
                    <Icons.bell className="text-white" />
                    {notifications.length > 0 && (
                        <span className="rounded text-[12px] relative top-[-5px] text-black dark:text-white">
                            {notifications.length}
                        </span>
                    )}
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
                        {notifications.length === 0 && (
                            <p className='text-center text-sm p-2 text-black dark:text-white'>
                                Aucune notification
                            </p>
                        )}
                        {notifications.map((notification) => (
                            <Menu.Item key={notification.id}>
                                <Button
                                    onClick={() => deleteNotification(
                                        notification.id,
                                        notification.title,
                                        notification.message_room_id,
                                        notification.user.id
                                    )}

                                    className="cursor-pointer h-full w-full py-2 m-0 text-black dark:text-white
                                    dark:bg-secondary_dark hover:bg-accent hover:text-accent-foreground"
                                >
                                    <div className="flex items-center">
                                        <Avatar className="w-6 h-6 mr-2">
                                            <AvatarImage
                                                src={notification.user.profile_picture}
                                                alt={notification.user.profile_picture}
                                                className="border rounded-full"
                                            />
                                        </Avatar>
                                        <p className="flex flex-col pl-2">
                                            <span className="text-[12px] text-muted-foreground">{notification.content}</span>
                                        </p>
                                    </div>
                                </Button>
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}