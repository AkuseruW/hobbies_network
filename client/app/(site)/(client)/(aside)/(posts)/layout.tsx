import React from 'react';

const ClientLayout = async ({ modal }: { modal: React.ReactNode }) => {

    return (
        <main className="h-[80vh] overflow-hidden">
            {modal}
        </main>
    );
};

export default ClientLayout;
