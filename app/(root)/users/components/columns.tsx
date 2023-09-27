"use client"

import {Column, ColumnDef} from "@tanstack/react-table"
import {Checkbox} from "@/components/ui/checkbox";
import {dateTimeFormatted} from "@/lib/utils";
import Link from "next/link";
import {ApiUser} from "@/types/user";
import {ChevronDown, ChevronsUpDown, ChevronUp, MoreHorizontal} from "lucide-react";
import {RoleBadge} from "@/components/role-badge";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import {UserProfilePicture} from "@/components/user-profile-picture";
import {User} from "@/lib/user";

function sortArrow({column}: { column: Column<ApiUser> }) {
    if (column.getIsSorted() === "desc") {
        return <ChevronDown className="ml-2 h-4 w-4"/>
    }
    if (column.getIsSorted() === "asc") {
        return <ChevronUp className="ml-2 h-4 w-4"/>
    }
    return <ChevronsUpDown className="ml-2 h-4 w-4"/>
}

export const userColumns: ColumnDef<ApiUser>[] = [
    {
        id: 'select',
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label={`Select all rows`}
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }, {
        id: 'username',
        accessorKey: 'username',
        header: ({column}) => {
            return (
                <div
                    className="flex items-center cursor-pointer select-none"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <span>Name</span>
                    {sortArrow({column})}
                </div>
            )
        },
        cell: ({row}) => {
            return (
                <div className="flex items-center">
                    <UserProfilePicture user={row.original}/>
                    <div className="flex flex-col">
                        <span className="ml-2 font-bold">{row.original.username}</span>
                        <span
                            className="ml-2 text-sm text-muted-foreground">{row.original.firstname} {row.original.lastname}</span>
                    </div>
                </div>
            )
        },
        enableSorting: true,
    }, {
        accessorKey: 'email',
        header: ({column}) => {
            return (
                <div
                    className="flex items-center cursor-pointer select-none"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <span>Email</span>
                    {sortArrow({column})}
                </div>
            )
        },
        cell: ({row}) => {
            return (
                <div className="flex items-center">
                    <Link href={`mailto:${row.original.email}`} target="_blank" title="Send email">
                        <p>{row.original.email}</p>
                    </Link>
                </div>
            )
        }
    }, {
        accessorKey: 'user_role',
        header: ({column}) => {
            return (
                <div
                    className="flex items-center cursor-pointer select-none"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <span>Role</span>
                    {sortArrow({column})}
                </div>
            )
        },
        cell: ({row}) => {
            return (
                <>
                    <RoleBadge role={row.original.user_role}/>
                </>
            )
        }

    }, {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: (cell) => {
            const date = dateTimeFormatted(cell.row.original.createdAt);
            return (
                <div className="flex items-center">
                    <div className="ml-2">{date}</div>
                </div>
            )
        }
    }, {
        id: 'actions',
        header: 'Actions',
        cell: ({row}) => {
            const user = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={async () => {
                                await navigator.clipboard.writeText(user.id)
                                toast.success('Copied user ID to clipboard.')
                            }}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link href={`/profile/${user.id}`}>
                                View Profile
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )

        }
    }
]
