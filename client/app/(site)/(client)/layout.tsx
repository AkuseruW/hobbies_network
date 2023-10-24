import Header from '@/components/header/Hearder';
import { MobileNav } from '@/components/mobile-nav';
import { LikeProvider } from '@/providers/like_provider';
import { currentUser } from '@/utils/_auth_informations';
import React from 'react';

const ClientLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = currentUser();

    return (
        <LikeProvider>
            <section className="m-2 lg:m-6">
                <div className="flex flex-col flex-1">
                    <Header currentUser={user} />
                    <div className="mt-5">
                        {children}
                    </div>
                    <div className='flex items-center justify-center lg:hidden'>
                        <MobileNav currentUser={user} />
                    </div>
                </div>
            </section>
        </LikeProvider>
    );
};

export default ClientLayout;
