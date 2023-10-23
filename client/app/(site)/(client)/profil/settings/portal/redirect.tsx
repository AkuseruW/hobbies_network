'use client'
import { Icons } from '@/components/icons'
import { getAccessTokenFromClient } from '@/utils/_auth_client_info'
import React, { useEffect } from 'react'

const Redirect = () => {
    const redirect = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-portal-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + getAccessTokenFromClient()
            }
        });
        const { url } = await res.json();
        window.open(url, '_blank');
    }
    useEffect(() => {
        redirect()
    }, [])

    return (
        <>
            <div className="flex items-center justify-center position-fixed inset-0 ">
                <Icons.spinner className="w-16 h-16 animate-spin" />
            </div>
        </>
    )
}

export default Redirect