import AsideChats from '@/components/messages/Aside';
import { currentUser } from '@/utils/_auth_informations';
import { getUsersPaginated } from '@/utils/requests/_users_requests';
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
    const user = currentUser();
    const { users } = await getUsersPaginated({});

    return (
        <div className="flex flex-col md:flex-row lg:flex-row  pb-4 h-[85vh]">
            <div className='lg-w-[28%] lg:block'>
                <AsideChats currentUser={user} initialUsers={users} />
            </div>
            <div className='w-full lg:w-[72%]'>
                {children}
            </div>
        </div>
    )
}

export default layout