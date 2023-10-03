import CallbackPage from '@/components/auth/callback'
import React, { Suspense } from 'react'

const page = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-700">
                <Suspense fallback={<></>}>
                    <CallbackPage />
                </Suspense>
            </div>
        </div>
    )
}

export default page
