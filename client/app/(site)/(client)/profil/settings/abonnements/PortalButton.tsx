'use client'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { getAccessTokenFromClient } from '@/utils/_auth_client_info'
import React, { useState } from 'react'

const PortalButton = () => {
    const [isLoading, setIsLoading] = useState(false)
    const redirect = async () => {
        setIsLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-portal-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + getAccessTokenFromClient()
            }
        });
        const { url } = await res.json();
        window.open(url, '_blank');
        setIsLoading(false)
    }


    return (
        <Button onClick={redirect} className="flex items-center justify-center position-fixed inset-0 ">
            {isLoading ? <Icons.spinner className="w-8 h-8 animate-spin" /> : "Gérez votre abonnement"}
        </Button>
    )
}

export default PortalButton