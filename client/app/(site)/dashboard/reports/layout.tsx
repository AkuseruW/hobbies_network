import Link from "next/link";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import ArrowBack from "@/components/ArrowBack";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <div className="container mx-auto px-6 py-6">
        <ArrowBack />
        <nav className="mt-2 flex flex-wrap justify-center lg:justify-start">
          <ul className="space-x-8 py-4 flex flex-wrap">
            <li className="flex items-center">
              <Link
                href="/dashboard/reports"
                className="text-gray-700 hover:text-blue-500 font-medium text-lg sm:text-sm dark:text-white dark:hover:text-blue-500"
              >
                <TableCellsIcon className="h-6 w-6 mr-3" />
                <span>All Reports</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div>{children}</div>
      </div>
    </main>
  );
}
