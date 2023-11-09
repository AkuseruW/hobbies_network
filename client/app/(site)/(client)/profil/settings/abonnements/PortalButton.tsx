'use client'
import { Button } from '@/components/ui/button'
import { getAccessTokenFromClient } from '@/utils/_auth_client_info'
import React from 'react'

const PortalButton = () => {
    const user_token = getAccessTokenFromClient();

    return (
        <form action={`${process.env.NEXT_PUBLIC_API_URL}/api/create-portal-session`} method="POST">
            <input type="hidden" name="user_token" value={`${user_token}`} />
            <Button id="checkout-and-portal-button" type="submit">G&eacute;rez votre abonnement</Button>
        </form>
    )
}

export default PortalButton