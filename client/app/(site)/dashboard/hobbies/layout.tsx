import Link from 'next/link';
import { PencilSquareIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import NavigationItem from '@/components/dashboard/NavigationComponent';
import { Icons } from '@/components/icons';


export default async function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="w-full">
            <div className="w-full">
                <div className="container mx-auto px-6 py-6">
                    <nav className="flex flex-wrap justify-center lg:justify-start">
                        <ul className="space-x-8 py-4 flex flex-wrap">
                            <NavigationItem link="/dashboard/hobbies" icon={<TableCellsIcon className="h-6 w-6 mr-3" />} text="All Hobbies" />
                            <li className="flex items-center">
                                <span className="border-l border-gray-300 h-6 mx-3"></span>
                            </li>
                            <NavigationItem link="/dashboard/hobbies/new" icon={<PencilSquareIcon className="h-6 w-6 mr-3" />} text="Create Hobby" />
                            <li className="flex items-center">
                                <span className="border-l border-gray-300 h-6 mx-3"></span>
                            </li>
                            <NavigationItem link="/dashboard/hobbies/proposed_hobbies" icon={<Icons.help className="h-6 w-6 mr-3" />} text="Hobbies Suggest" />
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
