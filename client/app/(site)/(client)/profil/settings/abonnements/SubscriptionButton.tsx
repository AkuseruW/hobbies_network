'use client'
import { Button } from '@/components/ui/button'
import { getAccessTokenFromClient } from '@/utils/_auth_client_info';
import React from 'react'

const SubscriptionButton = () => {
    const handleSubscription = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/certification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + getAccessTokenFromClient()
                }
            });
            const { checkout_url } = await res.json();
            window.open(checkout_url, '_blank');
        } catch (error) {
            console.error('Erreur lors de la requête fetch :', error);
        }
    };

    return (
        <Button onClick={handleSubscription}>
            S&apos;abonner maintenant
        </Button>
    )
}

export default SubscriptionButton