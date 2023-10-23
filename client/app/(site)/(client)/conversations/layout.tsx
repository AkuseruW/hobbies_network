import AsideChats from '@/components/messages/Aside';
import { currentUser } from '@/utils/_auth_informations';
import { getUsersPaginated } from '@/utils/requests/_users_requests';
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
    const user = currentUser();
    const { users } = await getUsersPaginated({});

    return (
        <div className="flex overflow-hidden h-[80vh]">
            <AsideChats currentUser={user} users={users} />
            {children}
        </div>
    )
}

export default layout