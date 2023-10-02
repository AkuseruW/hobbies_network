'use client'
import { Icons } from '@/components/icons'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { NotificationResponse } from '@/types/notifications_types'

const Notifications = ({ notifications }: { notifications: NotificationResponse }) => {

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
                            href={`/dashboard/${notification.notification_type}/${notification.report_id}`}
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
                                    <span className="text-sm">{notification.notification_type} :</span>
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