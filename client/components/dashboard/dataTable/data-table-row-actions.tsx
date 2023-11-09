import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pen, Trash, Eye, Ban } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ModalValidation from "../ModalValidation";
import { deleteHobby, deleteHobbySuggest } from "@/utils/requests/_hobbies_requests";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { unbanUser } from "@/utils/requests/_users_requests";


export function DataTableRowActionsProducts({ row }: any) {
    const router = useRouter();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleDelete = async () => {
        const productID = row.original.id
        const data = { productID }


    }

    return (
        <>
            {/* <Modal
                item={row.original.name}
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                onDelete={handleDelete}
            /> */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <Link href={`/dashboard/products/${row.original.slug}`} prefetch={false}>
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            View
                        </DropdownMenuItem>
                    </Link>
                    <Link href={`/dashboard/products/edit/${row.original.slug}`} prefetch={false}>
                        <DropdownMenuItem>
                            <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            Edit
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { setModalIsOpen(true) }}>
                        <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
        </>
    );
}

export const DataTableRowActionsReports = ({ row }: any) => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <Link href={`/dashboard/reports/${row.original.id}`}>
                    <DropdownMenuItem>
                        <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        View
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu >
    );
}

export const DataTableRowActionsHobbies = ({ row }: any) => {
    const router = useRouter();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { toast } = useToast()


    const handleDelete = async () => {
        const id = row.original.slug
        const req = await deleteHobby({ id })

        if (req.success === true) {
            setModalIsOpen(false);
            toast({
                description: req.message,
            })
            router.refresh();
        }
    }

    return (
        <>
            <ModalValidation
                item={row.original.name}
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                onDelete={handleDelete}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <Link href={`/dashboard/hobbies/edit/${row.original.slug}`} prefetch={false}>
                        <DropdownMenuItem>
                            <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            Edit
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { setModalIsOpen(true); }}>
                        <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
        </>
    );
}

export const DataTableRowActionsCustomers = ({ row }: any) => {
    const router = useRouter();
    const handleUnban = async () => {
        await unbanUser({ user_id: row.original.id })
        router.refresh()
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem className="hover:bg-muted">
                        <Link href={`/profil/${row.original.id}`} prefetch={false} className="w-full flex items-center">
                            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            View
                        </Link>
                    </DropdownMenuItem>
                    {row.original.is_banned && (
                        <DropdownMenuItem className="hover:bg-muted">
                            <Button variant={"link"} onClick={handleUnban} className="w-full flex justify-start m-0 p-0 h-auto">
                                <Ban className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                Unban
                            </Button>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};


export const DataTableRowActionsProposedHobbies = ({ row }: any) => {
    const router = useRouter();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { toast } = useToast()


    const handleDelete = async () => {
        const id = row.original.id
        const req = await deleteHobbySuggest({ id })

        if (req.success === true) {
            setModalIsOpen(false);
            toast({
                description: req.message,
            })
            router.refresh();
        }
    }

    return (
        <>
            <ModalValidation
                item={row.original.name}
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                onDelete={handleDelete}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px] dark:bg-secondary_dark">
                    <Link href={`/dashboard/hobbies/new?name=${row.original.name}&description=${row.original.description}`} prefetch={false}>
                        <DropdownMenuItem>
                            <Icons.approve className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            Approuve
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem  onClick={() => { setModalIsOpen(true); }}>
                        <Icons.x className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Reject
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
        </>
    );
}