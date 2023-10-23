import { Separator } from '@/components/ui/separator';
import { DeleteAccount } from '@/components/user/settings/deleteAccount';
import React from 'react';

const Page = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Suppression du compte</h3>
                <p className="text-sm text-muted-foreground">
                    Voulez-vous vraiment supprimer votre compte ? <br />
                    Toutes les données seront perdues (compte, hobbies, posts, etc...).
                </p>
            </div>
            <Separator />
            <DeleteAccount />
        </div>
    );
}

export default Page;
