'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
const page = () => {
    const handleClick = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/certification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const {checkout_url} = await res.json();
            window.open(checkout_url, '_blank');
        } catch (error) {
            console.error('Erreur lors de la requête fetch :', error);
        }
    }

    return (
        <div>
            <Button onClick={handleClick}>Settings</Button>
        </div>
    )
}

export default page
