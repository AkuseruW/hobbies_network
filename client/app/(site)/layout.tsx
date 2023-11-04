import { UserHobbiesProvider } from '@/providers/userHobbies_provider';
import { WebSocketProvider } from '@/providers/ws_provider';
import React from 'react';

const ClientLayout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <WebSocketProvider>
            <UserHobbiesProvider>
                {children}
            </UserHobbiesProvider>
        </WebSocketProvider>
    );
};

export default ClientLayout;
