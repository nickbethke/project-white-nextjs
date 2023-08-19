"use client";

import React from "react";
import {Separator} from "@/components/ui/separator";
import {NewMessageDialog} from "@/components/dialogs/new-message-dialog";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Archive, ChevronRight, MailQuestion, MailWarning} from "lucide-react";
import {notification_status, notification_type} from "@prisma/client";

type InboxSidebarProps = {
    type?: notification_type | "all",
    status?: notification_status | "all",
    send?: boolean
}

const InboxSidebar: React.FC<InboxSidebarProps> = ({type = 'all', status = 'all', send = false}) => {

    const itemClasses = cn("flex items-center gap-4 px-4 py-2 hover:bg-accent cursor-pointer transition");
    return (
        <>
            <div className="border-l h-full w-0 md:w-64 xl:w-72 2xl:w-80 pt-16 fixed top-0 right-0">
                <div className="p-4 flex flex-col gap-4">
                    <NewMessageDialog/>
                    <Separator/>
                    <div className="text-muted-foreground">Filters</div>
                    <Link href={send ? "/inbox" : "/inbox/send"}
                          className={cn(itemClasses, send ? "bg-muted text-accent-foreground" : "")}>
                        <div className="text-muted-foreground w-4 h-4 flex items-center justify-center">
                            <ChevronRight/>
                        </div>
                        <p className="tracking-tighter">Sent</p>
                    </Link>
                    <div className="text-muted-foreground text-sm">Status</div>
                    <div className="flex flex-col gap-2">
                        <Link href={status === notification_status.unread ? "/inbox" : "/inbox/status/unread"}
                              className={cn(itemClasses, status === notification_status.unread ? "bg-muted text-accent-foreground" : "")}>
                            <div className="text-muted-foreground w-4 h-4 flex items-center justify-center">
                                <MailQuestion/>
                            </div>
                            <p className="tracking-tighter">Unread</p>
                        </Link>
                        <Link href={status === notification_status.archived ? "/inbox" : "/inbox/status/archived"}
                              className={cn(itemClasses, status === notification_status.archived ? "bg-muted text-accent-foreground" : "")}>
                            <div className="text-muted-foreground w-4 h-4 flex items-center justify-center">
                                <Archive/>
                            </div>
                            <p className="tracking-tighter">Archive</p>
                        </Link>
                    </div>
                    <div className="text-muted-foreground text-sm">Type</div>
                    <div className="flex flex-col gap-2">
                        <Link href={type === notification_type.request ? "/inbox" : "/inbox/type/request"}
                              className={cn(itemClasses, type === notification_type.request ? "bg-muted text-accent-foreground" : "")}>
                            <div className="text-muted-foreground w-4 h-4 flex items-center justify-center">
                                <MailQuestion/>
                            </div>
                            <p className="tracking-tighter">Requests</p>
                        </Link>
                        <Link href={type === notification_type.alert ? "/inbox" : "/inbox/type/alert"}
                              className={cn(itemClasses, type === notification_type.alert ? "bg-muted text-accent-foreground" : "")}>
                            <div className="text-muted-foreground w-4 h-4 flex items-center justify-center">
                                <MailWarning/>
                            </div>
                            <p className="tracking-tighter">Warnings</p>
                        </Link>
                    </div>
                </div>
            </div>

        </>
    );
}

export default InboxSidebar;
