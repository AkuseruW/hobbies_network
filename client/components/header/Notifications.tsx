'use client'
import { Icons } from '@/components/icons'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { NotificationResponse } from '@/types/notifications_types'
import { notification_is_read } from '@/utils/requests/_notifications_requests'
import { useState } from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'


const Notifications = ({ notifications: notifications_db, client }: { notifications: NotificationResponse, client?: boolean }) => {
    const [notifications, setNotifications] = useState<NotificationResponse>(notifications_db)

    const deleteNotification = async (id: number) => {
        await notification_is_read({ notification_id: id });

        setNotifications((prevNotifications) => ({
            ...prevNotifications,
            notifications: prevNotifications.notifications.filter(notification => notification.id !== id),
            count_new_notifications: prevNotifications.count_new_notifications - 1,
        }));
    }

    return (
        <Menu as="div" className="relative inline-block text-left ">
            <div>
                <Menu.Button
                    className='border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10
                    flex items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 dark:bg-secondary_dark dark:border-gray-600 dark:hover:bg-zinc-700'
                >
                    <Icons.bell className="w-4 h-4 text-black dark:text-white" />
                    {notifications.count_new_notifications > 0 && (
                        <span className="rounded text-[12px] relative top-[-5px] text-black dark:text-white">
                            {notifications.count_new_notifications}
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-36 
            origin-top-right rounded-md bg-white shadow-lg ring-1 
            dark:bg-background_dark
            ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {notifications.notifications.length === 0 && (
                            <p className='text-center text-sm p-2'>
                                Aucune notification
                            </p>
                        )}
                        {notifications.notifications.map((notification) => (
                            <Menu.Item key={notification.id}>
                                <Link
                                    onClick={() => deleteNotification(notification.id)}
                                    href={client ? 
                                        notification.title === 'Message' ?
                                        `/conversations/${notification.message_room_id}` :
                                        `/profil/${notification.user.id}` 
                                        : `/dashboard/${notification.notification_type}/${notification.report_id}`}
                                    className="cursor-pointer h-full w-full p-0 m-0"
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
                                </Link>
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default Notifications;

export const NotificationMobile = ({ notifications: notifications_db }: { notifications: NotificationResponse }) => {
    const [notifications, setNotifications] = useState<NotificationResponse>(notifications_db)

    const deleteNotification = async (id: number) => {
        await notification_is_read({ notification_id: id });

        setNotifications((prevNotifications) => ({
            ...prevNotifications,
            notifications: prevNotifications.notifications.filter(notification => notification.id !== id),
            count_new_notifications: prevNotifications.count_new_notifications - 1,
        }));
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='rounded-full 
                flex items-center border-1
                justify-center w-6 h-6
                text-white'>
                    <Icons.bell className="w-6 h-6 text-white dark:text-white" />
                    {notifications.count_new_notifications > 0 && (
                        <span className="rounded text-[12px] relative top-[-5px] text-white dark:text-white">
                            {notifications.count_new_notifications}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='absolute bottom-14 -right-5'>
                {notifications.notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id}>
                        <Link
                            href={`/profil/${notification.user.id}`}
                            className="cursor-pointer h-full w-full p-0 m-0"
                            onClick={() => deleteNotification(notification.id)}
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
                                    <span className="text-sm">{notification.title} :</span>
                                    <span className="text-[12px] text-muted-foreground">{notification.content}</span>
                                </p>
                            </div>
                        </Link>
                    </DropdownMenuItem>
                ))}
                {notifications.count_new_notifications >= 5 && (
                    <DropdownMenuItem>Voir Plus ...</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}