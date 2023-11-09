import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { getUsersPaginated } from "@/utils/requests/_users_requests"
import { Avatar, AvatarImage } from "../ui/avatar"
import Link from "next/link"
import { User } from '../../types/user_types';
import { ScrollArea } from "../ui/scroll-area";
import { Icons } from "../icons";

const MessagesToggle = async () => {
    const { users } = await getUsersPaginated({}) // Call the getUsersPaginated API function

    return (
        <Sheet>
            <SheetTrigger className="fixed bottom-8 w-12 h-12 right-16  z-10 bg-black flex justify-center items-center rounded-full">
                <Icons.message_circle className="w-8 h-8 text-white dark:text-white" />
            </SheetTrigger>

            <SheetContent>
                <SheetHeader className="border-b">
                    <SheetTitle>Chats</SheetTitle>
                </SheetHeader>

                <ul>
                    <ScrollArea>
                        {users.map((user: User) => (
                            <li className="p-4 border-gray-200" key={user.id}>
                                <Link href="#" className="flex items-center justify-between">
                                    <div className="w-10 h-10 overflow-hidden rounded-full">
                                        <Avatar className=" mr-2">
                                            <AvatarImage
                                                src={user.profile_picture}
                                                alt={user.profile_picture}
                                                className="border rounded-full"
                                            />
                                        </Avatar>
                                    </div>
                                    <div>
                                        <p>
                                            {user.firstname} {user.lastname}
                                        </p>
                                    </div>
                                    <Icons.message_circle className="w-4 h-4 text-black dark:text-white" />
                                </Link>
                            </li>
                        ))}
                    </ScrollArea>
                </ul>
            </SheetContent>
        </Sheet>

    )
}

export default MessagesToggle
