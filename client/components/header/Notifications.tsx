'use client'
import { Icons } from '@/components/icons'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { NotificationResponse } from '@/types/notifications_types'
import { Notification } from '../../types/notifications_types';
import { notification_is_read } from '@/utils/requests/_notifications_requests'
import { useRouter } from 'next/navigation'

const Notifications = ({ notifications, client }: { notifications: NotificationResponse, client?: boolean }) => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Icons.bell className="w-4 h-4 text-black dark:text-white" />
                    {notifications.count_new_notifications > 0 && (
                        <span className="rounded text-[12px] relative top-[-5px] text-black dark:text-white">
                            {notifications.count_new_notifications}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {notifications.notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id}>
                        <Link
                            href={client ? `/profil/${notification.user.id}` : `/dashboard/${notification.notification_type}/${notification.report_id}`}
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
};

export default Notifications;

export const NotificationMobile = ({ notifications }: { notifications: NotificationResponse }) => {
    const router = useRouter();

    const onclick = async (id: number) => {
        await notification_is_read({ notification_id: id });
        router.refresh();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='rounded-full 
                flex items-center border-1
                justify-center w-6 h-6
                text-white'>
                    <Icons.bell className="w-6 h-6 text-white dark:text-black" />
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
                            onClick={() => onclick(notification.id)}
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