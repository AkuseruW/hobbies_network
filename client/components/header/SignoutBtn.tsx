'use client'
import { Button } from '@/components/ui/button';
import React from 'react';

const SignoutBtn = () => {
    const signOut = () => {
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
        <button className='w-full bg-transparent dark:text-white p-0 m-0 hover:bg-transparent flex' onClick={signOut}>
            Sign Out
        </button>
    );
};

export default SignoutBtn;
