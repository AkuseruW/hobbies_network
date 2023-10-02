import React from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from '@/components/icons'
import { Notifications } from '@/types/notifications_types'

const Alert = ({ notifications }: { notifications: Notifications[] }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Icons.bell className="w-6 h-6 text-accent-color" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    {notifications.map((notification) => {
                        return (
                            <p key={notification.id}>{notification.message}</p>
                        )
                    })}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Alert
