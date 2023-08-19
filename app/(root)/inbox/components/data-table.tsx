"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell, TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {NotificationDataTableRow} from "@/app/(root)/inbox/components/notification-data-table-row";
import React from "react";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {notification_status, notifications, users} from "@prisma/client";
import {IResponse} from "@/types/axios-responses";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
    status?: notification_status | 'all'
    send?: boolean
}

export function DataTable<TValue>({columns, data, status = 'all', send = false}: DataTableProps<notifications & {
    from: users,
    to: users
}, TValue>) {

    const router = useRouter();

    const [rowSelection, setRowSelection] = React.useState({})

    const hiddenColumnsOnSend = ['select', 'from'];
    const hiddenColumns = ['to'];

    const realColumnsSend = columns.filter((column) => (!hiddenColumnsOnSend.includes(column.id ?? '')))
    const realColumns = columns.filter((column) => (!hiddenColumns.includes(column.id ?? '')))


    const table = useReactTable({
        data,
        columns: send ? realColumnsSend : realColumns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            rowSelection,
        }
    })

    const handleArchive = async () => {
        let successMessage = "Successfully archived notifications";
        let errorMessage = "Failed to archive notifications";
        if (status === 'archived') {
            successMessage = "Successfully unarchived notifications";
            errorMessage = "Failed to move notifications to inbox";
        }
        try {
            const notifications = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
            const notificationIds = notifications.map((notification) => notification.id)
            let response;

            if (status !== 'archived') {
                response = await axios.post<IResponse>('/api/inbox/archived', notificationIds);
            } else {
                response = await axios.post<IResponse>('/api/inbox/read', notificationIds);
            }
            if (response.status === 200) {
                toast.success(successMessage);
                setRowSelection({});
                router.refresh();
            } else {
                toast.error(errorMessage);
            }
        } catch (e) {
            toast.error(errorMessage);
        }
    }

    const handleDelete = async () => {
        try {
            const notifications = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
            const notificationIds = notifications.map((notification) => notification.id)
            const response = await axios.delete<IResponse>('/api/notifications', {data: notificationIds});
            if (response.status === 200) {
                toast.success("Successfully deleted notifications");
                setRowSelection({});
                router.refresh();
            } else {
                toast.error("Failed to delete notifications");
            }
        } catch (e) {
            toast.error("Failed to delete notifications");
        }
    }

    async function handleStatusChange(url: string, successMessage: string, errorMessage: string) {
        try {
            const notifications = table.getFilteredRowModel().rows.map((row) => row.original)
            const notificationIds = notifications.map((notification) => notification.id)
            const response = await axios.post<IResponse>(url, notificationIds);
            if (response.status === 200) {
                toast.success(successMessage);
                setRowSelection({});
                router.refresh();
            } else {
                toast.error(errorMessage);
            }
        } catch (e) {
            toast.error(errorMessage);
        }
    }

    const handleMarkAsRead = async () => {
        let successMessage = "Successfully marked all notifications as read";
        let errorMessage = "Failed to mark all notifications as read";
        let url = '/api/inbox/read';
        await handleStatusChange(url, successMessage, errorMessage);
    }

    const handleMarkAsNotRead = async () => {
        let successMessage = "Successfully marked all notifications as not read";
        let errorMessage = "Failed to mark all notifications as not read";
        let url = '/api/inbox/unread';
        await handleStatusChange(url, successMessage, errorMessage);
    }

    return (<>
            <div className="py-4 pl-4 flex items-center gap-2 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
                {!send && (
                    <>
                        <Button variant="outline" disabled={Object.entries(rowSelection).length === 0}
                                onClick={handleMarkAsRead}>
                            Mark as read
                        </Button>
                        <Button variant="outline" disabled={Object.entries(rowSelection).length === 0}
                                onClick={handleMarkAsNotRead}>
                            Mark as not read
                        </Button>
                        <Button variant="outline" disabled={Object.entries(rowSelection).length === 0}
                                onClick={handleArchive}>
                            {status === 'archived' ? 'Unarchive' : 'Archive'}
                        </Button>
                        <Button variant="outline" disabled={Object.entries(rowSelection).length === 0}
                                onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                )}
                <div className="ml-auto space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <NotificationDataTableRow row={row} key={row.id}/>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableHeader className="border-t">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                    </Table>
                </div>

            </div>
            <div className="py-4 pl-4 flex gap-4 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
                <div className="ml-auto space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    )
}
