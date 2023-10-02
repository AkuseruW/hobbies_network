import { WebSocketProvider } from '@/providers/ws_provider';
import React from 'react';

const ClientLayout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <WebSocketProvider>
            {children}
        </WebSocketProvider>
    );
};

export default ClientLayout;
