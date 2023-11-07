'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from './icons'

const ArrowBack = () => {
    const router = useRouter()

    return (
        <div className="flex items-center cursor-pointer" onClick={() => router.back()}>
            <Icons.arrowLeft className="w-8 h-8 text-primary" />
            <span className="text-lg">Back</span>
        </div>
    )
}

export default ArrowBack
