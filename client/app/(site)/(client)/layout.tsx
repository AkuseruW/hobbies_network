import Header from '@/components/header/Hearder';
import { LikeProvider } from '@/providers/like_provider';
import { currentUser } from '@/utils/_auth_informations';
import React from 'react';
import { v4 as uuid } from 'uuid'

const ClientLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = currentUser();

    return (
        <LikeProvider>
            <div className="p-2 lg:p-6">
                <div className="flex flex-col flex-1">
                    <Header currentUser={user} />
                    <main key={uuid()} className="flex-1 flex flex-col items-center min-h-screen mt-5">
                        {children}
                    </main>
                </div>
            </div>
        </LikeProvider>
    );
};

export default ClientLayout;
