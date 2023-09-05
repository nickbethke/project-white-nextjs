"use client"

import {ColumnDef} from "@tanstack/react-table"
import {notifications, users} from "@prisma/client";
import {notificationTypes} from "@/lib/constants/notification.constants";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Checkbox} from "@/components/ui/checkbox";
import ProfileButton from "@/components/profile-button";


export const notificationColumns: ColumnDef<notifications & { from: users, to: users }>[] = [
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
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: (cell) => {
            const date = Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(cell.row.original.createdAt)
            return (
                <Link href={`/inbox/view/${cell.row.original.id}`}>
                    <div className="flex items-center">
                        <div className="ml-2">{date}</div>
                    </div>
                </Link>
            )
        }
    }, {
        accessorKey: 'subject',
        header: 'Subject',
        cell: (cell) => {
            return (
                <Link href={`/inbox/view/${cell.row.original.id}`}>
                    <div className="flex items-center">
                        {cell.row.original.subject}
                    </div>
                </Link>
            )
        }
    },
    {
        id: 'from',
        accessorKey: 'from',
        header: 'From',
        cell: ({row}) => {
            const notification = row.original;
            return (
                <Link href={`/inbox/view/${notification.id}`}>
                    <ProfileButton user_id={notification.from.id}/>
                </Link>
            )
        }
    },
    {
        id: 'to',
        accessorKey: 'to',
        header: 'To',
        cell: ({row}) => {
            const notification = row.original;
            return (
                <Link href={`/inbox/view/${notification.id}`}>
                    <ProfileButton user_id={notification.to.id}/>
                </Link>
            )
        }
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: (cell) => {
            return (
                <Link href={`/inbox/view/${cell.row.original.id}`}>
                    <div className="flex items-center">
                        <div className="ml-2">{notificationTypes[cell.row.original.type]}</div>
                    </div>
                </Link>
            )
        }
    }, {
        accessorKey: 'actions',
        header: '',
        cell: ({row}) => {
            const notification = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center">
                            <span className="sr-only">Actions</span>
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Link href={`/inbox/view/${notification.id}`} className="w-full">
                                View notification
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={`/profile/${notification.from.id}`} className="w-full">
                                View profile
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
