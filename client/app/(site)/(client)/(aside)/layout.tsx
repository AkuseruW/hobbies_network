import CurrentUserOnline from '@/components/home/CurrentUserOnline';
import LeftAside from '@/components/home/LeftAside';
import MessagesToggle from '@/components/messages/MessagesToggle';
import { currentUser } from '@/utils/_auth_informations';
import React from 'react';
import { v4 as uuid } from 'uuid'

const ClientLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = currentUser();

    return (
        <div className="lg:flex lg:flex-row min-h-screen mt-5">
            <div className='hidden lg:w-1/5 relative lg:flex'>
                <LeftAside />
            </div>
            <main key={uuid()} className="flex flex-col items-center lg:w-3/5">
                {children}
            </main>
            <div className='hidden lg:w-1/5 relative lg:flex justify-end'>
                <CurrentUserOnline />
                <MessagesToggle />
            </div>
        </div>
    );
};

export default ClientLayout;
