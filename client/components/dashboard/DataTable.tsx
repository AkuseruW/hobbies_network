'use client'
import { useState } from "react"
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTablePagination } from "./dataTable/data-table-pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, HeaderGroup, Row } from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageSize: number
    initialPage: { page: number }
    paginationUrl: string
    type: string
}

export function DataTable<TData, TValue>({ type, columns, data, pageSize, initialPage, paginationUrl }: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [rowSelection, setRowSelection] = useState({})
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [filterValue, setFilterValue] = useState(searchParams.get('search') || "");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFilterValue = event.target.value;
        setFilterValue(newFilterValue);

        if (type === 'typeHobbies') {
            table.getColumn("name")?.setFilterValue(newFilterValue);
        } else if (type === 'typeCustomer') {
            table.getColumn("email")?.setFilterValue(newFilterValue);
        } else if (type === 'typeOrder') {
            table.getColumn("id")?.setFilterValue(newFilterValue);
        }

        const url = new URL(window.location.href);
        if (newFilterValue !== "") {
            url.searchParams.set("search", newFilterValue);
        } else {
            url.searchParams.delete("search");
        }
        router.push(url.toString());
    };

    const table = useReactTable<TData>({
        data,
        columns,
        state: { sorting, columnVisibility, rowSelection, columnFilters },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-4 ">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter..."
                    value={filterValue}
                    onChange={handleInputChange}
                    className="max-w-sm dark:bg-secondary_dark dark:border-gray-400"
                />
            </div>
            <div className="rounded-md border bg-white dark:bg-secondary_dark dark:border-gray-400">
                <Table>
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
                            <TableRow key={headerGroup.id} className="dark:border-gray-400">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <div>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody >
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row: Row<TData>) => (
                                <TableRow
                                    className="dark:border-gray-400"
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination
                table={table}
                url={paginationUrl}
                pageSize={pageSize}
                initialPage={initialPage}
            />
        </div>
    );
}
