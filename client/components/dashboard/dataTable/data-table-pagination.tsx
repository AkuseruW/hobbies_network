import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    url: string
    pageSize: number
    initialPage: { page: number }
}

export function DataTablePagination<TData>({ table, url, pageSize, initialPage }: DataTablePaginationProps<TData>) {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(Number(initialPage?.page) || 1)
    if ( pageSize === 0 || pageSize === 1) {
        return null
    }

    const onPageChange = (page: number) => {
        setCurrentPage(page)
        const url = new URL(window.location.href);
        url.searchParams.set("page", String(page));

        router.push(url.toString());
    }

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of {" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {currentPage} of {" "} {pageSize}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex dark:bg-secondary_dark dark:border-gray-400"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}>
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 dark:bg-secondary_dark dark:border-gray-400"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}>
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 dark:bg-secondary_dark dark:border-gray-400"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === pageSize}>
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex dark:bg-secondary_dark dark:border-gray-400"
                        onClick={() => onPageChange(pageSize)}
                        disabled={currentPage === pageSize}>
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}