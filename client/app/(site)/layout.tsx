import { UserProvider } from '@/providers/useData_provider';
import { WebSocketProvider } from '@/providers/ws_provider';
import React from 'react';

const ClientLayout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <WebSocketProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </WebSocketProvider>
    );
};

export default ClientLayout;
