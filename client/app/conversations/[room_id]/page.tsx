
import React from 'react'
import { getChatMessages } from '@/utils/requests/_chats'
import ChatSection from '@/components/messages/ChatSection'
import { currentUser } from '@/utils/_auth_informations'

const page = async ({ params }: { params: { room_id: string } }) => {
    const messages = await getChatMessages({ room_id: params.room_id })
    const user = currentUser();
    console.log(user)
    return (
        <div className="h-screen mx-auto w-[60%]">
            <div className="h-60 w-full">
                <ChatSection messages={messages} currentUser={user}/>
            </div>
            {/* <FormChat room_id={params.room_id} /> */}
        </div>
    )
}

export default page