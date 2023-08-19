"use client";

import {Row} from "@tanstack/table-core";
import {TableCell, TableRow} from "@/components/ui/table";
import {flexRender} from "@tanstack/react-table";
import {notifications, users} from "@prisma/client";
import React from "react";
import {cn} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";

export function NotificationDataTableRow({row}: { row: Row<notifications & { from: users, to: users }> }) {
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState<"selected" | "open" | "closed">("closed");

    React.useEffect(() => {
        if (row.getIsSelected()) {
            setStatus("selected");
        } else {
            if (open) {
                setStatus("open");
            } else {
                setStatus("closed");
            }
        }
    }, [row.getIsSelected(), open]);


    return (
        <>
            <TableRow
                onClick={() => setOpen(!open)}
                className={cn("cursor-pointer data-[state=open]:bg-accent-foreground data-[state=open]:text-accent", row.original.status === 'read' ? 'bg-accent-foreground/5 hover:bg-accent-foreground/10 data-[state=selected]:bg-accent-foreground/20' : "")}
                key={row.id}
                data-state={status}
            >
                {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
            </TableRow>
            {open && (
                <TableRow>
                    <TableCell colSpan={row.getVisibleCells().length} className="w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex gap-2">
                                <div className="font-bold">Subject:</div>
                                <div>{row.original.subject}</div>
                            </div>
                            <div className="flex gap-2">
                                <div className="font-bold">From:</div>
                                <div>{row.original.from.username} - {row.original.from.email}</div>
                            </div>
                            <div className="flex gap-2">
                                <div className="font-bold">To:</div>
                                <div>{row.original.to.username} - {row.original.from.email}</div>
                            </div>
                            <Separator/>
                            <div className="flex gap-2">
                                <div>{row.original.content}</div>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}
