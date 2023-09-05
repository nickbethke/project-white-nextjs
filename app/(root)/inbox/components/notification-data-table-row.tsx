"use client";

import {Row} from "@tanstack/table-core";
import {TableCell, TableRow} from "@/components/ui/table";
import {flexRender} from "@tanstack/react-table";
import {notifications, users} from "@prisma/client";
import React from "react";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";

export function NotificationDataTableRow({row}: { row: Row<notifications & { from: users, to: users }> }) {
    const router = useRouter();

    const [status, setStatus] = React.useState<"selected" | "closed">("closed");

    React.useEffect(() => {
        if (row.getIsSelected()) {
            setStatus("selected");
        }
    }, [row]);


    return (
        <>
            <TableRow
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
        </>
    )
}
