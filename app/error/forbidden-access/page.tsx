import Link from "next/link";

const ForbiddenAccess = () => {
    return (
        <main className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-indigo-600">403</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">Forbidden Access</h1>
                <p className="mt-6 text-base leading-7 text-gray-600">Sorry, you do not have permission to access this page.</p>
                <div className="mt-10">
                    <Link href="/" className="inline-block px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
                        Go back home
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default ForbiddenAccess