import AsideChats from '@/components/messages/Aside';
import { ToggleChat } from '@/providers/chatToogle';
import { currentUser } from '@/utils/_auth_informations';
import { getUsersPaginated } from '@/utils/requests/_users_requests';

const layout = async ({ children }: { children: React.ReactNode }) => {
    const user = currentUser();
    const { users } = await getUsersPaginated({});

    return (
        <ToggleChat>
            <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
                <AsideChats currentUser={user} initialUsers={users} />
                <div className='w-full lg:w-[72%]'>
                    {children}
                </div>
            </div>
        </ToggleChat>
    )
}

export default layout