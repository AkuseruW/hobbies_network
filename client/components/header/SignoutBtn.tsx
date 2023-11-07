'use client'
import React from 'react';
import { Menu } from '@headlessui/react'
import { useRouter } from 'next/navigation';

const SignoutBtn = () => {
    const router = useRouter();
    const signOut = () => {
        // Delete a cookie by name.
        const deleteCookie = (name: string) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        };

        // Split the cookies and iterate through them.
        const cookies = document.cookie.split(';');
        cookies.forEach((cookie) => {
            const cookieName = cookie.split('=')[0].trim();

            // Delete cookies except for '_cookie_settings'.
            if (cookieName !== '_cookie_settings') {
                deleteCookie(cookieName);
            }
        });

        router.push('/connexion');
    };

    return (
        <Menu.Item>
            <button className='hover:bg-secondary dark:hover:bg-secondary_dark w-full bg-transparent dark:text-white p-0 m-0 flex px-4 py-2 text-sm' onClick={signOut}>
                Sign Out
            </button>
        </Menu.Item>
    );
};

export default SignoutBtn;
