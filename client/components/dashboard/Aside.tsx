import Image from "next/image";
import Link from "next/link";
import {
    UserGroupIcon,
    RectangleStackIcon,
    ChartPieIcon,
    ArrowLeftOnRectangleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const NavItem = ({ href, icon, text, unread }: { href: string, icon: any, text: string, unread?: number }) => (
    <li className="pl-4 py-2 list-none flex space-x-3 items-center">
        <Link href={href} className="flex items-center text-gray-900 dark:text-white hover:text-gray-600 font-medium mr-6">
            {icon}
            <span className="text-lg">{text} {unread ? `(${unread})` : ''}</span>
        </Link>
    </li>
);

const Aside = ({ len_reports_unread, len_notifications_unread, len_proposed_hobbies }: { len_reports_unread: number, len_notifications_unread: number, len_proposed_hobbies: number }) => {
    return (
        <aside className="hidden lg:block w-1/5 bg-white dark:bg-secondary_dark shadow-md h-screen overflow-hidden">
            <header className="p-4">
                <div className="flex items-center mb-6">
                    <Image className="h-8 w-auto mr-2" src="/octagon.svg" width={50} height={50} alt="Logo" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hobbies</h2>
                </div>
            </header>
            <nav className="flex-grow mt-5 h-4/5">
                <ul className="space-y-4 flex flex-col justify-between">
                    <NavItem href="/dashboard" icon={<ChartPieIcon className="h-6 w-6 mr-3" />} text="Dashboard" />
                    <NavItem href="/dashboard/users" icon={<UserGroupIcon className="h-6 w-6 mr-3" />} text="Users" />
                    <NavItem href="/dashboard/hobbies" icon={<RectangleStackIcon className="h-6 w-6 mr-3" />} text="Hobbies" unread={len_proposed_hobbies} />
                    <NavItem href="/dashboard/reports" icon={<ExclamationCircleIcon className="h-6 w-6 mr-3" />} text="Reports" unread={len_reports_unread} />
                    {/* <NavItem href="/dashboard/notifications" icon={<Icons.bell className="h-6 w-6 mr-3" />} text="Notifications" unread={len_notifications_unread} /> */}
                </ul>
            </nav>
            <div className="pl-4">
                <NavItem href="/" icon={<ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />} text="Return to website" />
            </div>
        </aside>
    );
};

export default Aside;
