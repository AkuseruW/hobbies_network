import Link from "next/link";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { Ban } from "lucide-react";
import NavigationItem from "@/components/dashboard/NavigationComponent";
import { Icons } from "@/components/icons";

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <div className="container mx-auto px-6 py-6">
        <nav className="flex flex-wrap justify-center lg:justify-start">
          <ul className="space-x-8 py-4 flex flex-wrap">
            <NavigationItem
              link="/dashboard/users"
              icon={<TableCellsIcon className="h-6 w-6 mr-3" />}
              text="All users"
            />
            <li className="flex items-center">
              <span className="border-l border-gray-300 h-6 mx-3"></span>
            </li>
            <NavigationItem
              link="/dashboard/users?q=banned"
              icon={<Ban className="h-6 w-6 mr-3" />}
              text="Banned users"
            />
            <li className="flex items-center">
              <span className="border-l border-gray-300 h-6 mx-3"></span>
            </li>
            <NavigationItem
              link="/dashboard/users?q=certified"
              icon={<Icons.badgecheck className="h-6 w-6 mr-3" />}
              text="Certified users"
            />
          </ul>
        </nav>
        <div>{children}</div>
      </div>
    </main>
  );
}
