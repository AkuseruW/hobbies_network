import Link from 'next/link';
import { TableCellsIcon } from '@heroicons/react/24/outline';
import { Ban } from "lucide-react";


export default async function ProductLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <main className="w-full overflow-x-hidden min-h-screen overflow-auto">
            <div className="w-full">
                <div className="container mx-auto px-4 py-6">
                    <nav className="flex flex-wrap justify-center lg:justify-start">
                        <ul className="space-x-8 p-4 flex flex-wrap">
                            <li className="flex items-center">
                                <Link href="/dashboard/customers" className="text-gray-700 hover:text-blue-500 dark:text-white dark:hover:text-blue-500 font-medium text-lg sm:text-sm">
                                    <TableCellsIcon className="h-6 w-6 mr-3" />
                                    <span>All users</span>
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <span className="border-l border-gray-300 h-6 mx-3"></span>
                            </li>
                            <li className="flex items-center">
                                <Link href="/dashboard/customers" className="text-gray-700 hover:text-blue-500 dark:text-white dark:hover:text-blue-500 font-medium text-lg sm:text-sm">
                                    <Ban className="h-6 w-6 mr-3" />
                                    <span>Banned users</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}
