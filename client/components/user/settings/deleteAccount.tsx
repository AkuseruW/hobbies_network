"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { deleteAccount } from '@/utils/requests/_users_requests'


export const DeleteAccount = () => {

    const handleDeleteAccount = async () => {
        await deleteAccount();
        const deleteCookie = (name: string) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        };

        const cookies = document.cookie.split(';');
        cookies.forEach((cookie) => {
            const cookieName = cookie.split('=')[0].trim();
            if (cookieName !== '_cookie_settings') {
                deleteCookie(cookieName);
            }
        });

        window.location.href = '/connexion';
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button>Suppression du compte</Button>
            </DialogTrigger>
            <DialogContent className='py-auto'>
                <DialogHeader>
                    <DialogTitle>Voulez-vous supprimer votre compte ?</DialogTitle>
                    <DialogDescription>
                        Toutes les données seront perdues (compte, hobbies, posts, etc...).
                    </DialogDescription>
                </DialogHeader>
                <div className='flex space-x-2 justify-end'>
                    <Button className="w-[40%]" onClick={handleDeleteAccount}>Supprimer</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
