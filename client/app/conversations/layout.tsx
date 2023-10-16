import AsideChats from '@/components/messages/Aside';
import { currentUser } from '@/utils/_auth_informations';
import { getUsersPaginated } from '@/utils/requests/_users_requests';
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
    const user = currentUser();
    const users  = await getUsersPaginated({});
    console.log(users)
    return (
        <div className="flex h-screen overflow-hidden">
            <AsideChats currentUser={user} users={users} />
            {children}
        </div>
    )
}

export default layout