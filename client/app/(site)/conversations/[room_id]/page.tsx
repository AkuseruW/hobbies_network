import React from 'react'
import { getChatMessages } from '@/utils/requests/_chats'
import ChatSection from '@/components/messages/ChatSection'
import { currentUser } from '@/utils/_auth_informations'

const page = async ({ params }: { params: { room_id: string } }) => {
    const { messages, other_user } = await getChatMessages({ room_id: params.room_id })
    const user = currentUser();

    return (
        <div className="mx-auto w-full">
            <ChatSection initialMessages={messages} currentUser={user} other_user={other_user} />
        </div>
    )
}

export default page