import CallbackPage from '@/components/auth/callback'

const page = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md dark:bg-primary_dark">
                <CallbackPage />
            </div>
        </div>
    )
}

export default page
