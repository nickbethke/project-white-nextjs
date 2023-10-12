"use client";

import {ApiPermission, ApiUserRole} from "@/types/user";
import React, {useState} from "react";
import axios from "axios";
import {
    IUserRolesPermissionPatchResponse,
    IUserRolesPermissionResponse,
    IUserRolesResponse
} from "@/types/axios-responses";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Loader} from "@/components/loader";
import {UserRolesCheckbox} from "@/app/(root)/settings/user-roles/components/user-roles-checkbox";
import {Button} from "@/components/ui/button";
import {Warning} from "postcss";
import {AlertCircle, FileWarning} from "lucide-react";

const UserRolesEditTable = () => {

    const [userRoles, setUserRoles] = useState<ApiUserRole[]>([]);
    const [permissions, setPermissions] = useState<ApiPermission[]>([]);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [patched, setPatched] = useState<string>("");

    React.useEffect(() => {
        (async () => {
            await loadData();
        })();
    }, []);

    const loadData = async () => {
        const res = await axios.get<IUserRolesResponse>('/api/users/roles');
        const resPer = await axios.get<IUserRolesPermissionResponse>('/api/users/roles/permissions');
        setUserRoles(res.data.data.userRoles);
        setPermissions(resPer.data.data.permissions);
        initialLoading && setInitialLoading(false);
    }

    const patchPermissions = async () => {
        setInitialLoading(true);
        const patched = await axios.patch<IUserRolesPermissionPatchResponse>('/api/permissions');
        setPatched("(D: " + patched.data.data.deleted + " C: " + patched.data.data.created + ")");
        setTimeout(() => {
            setPatched("");
        }, 5000);
        setInitialLoading(false)
        await loadData();
    }

    const permissionPrefix = (permission: string) => {
        return permission.split('_').slice(0, -1).join('_');
    }

    const permissionsGroupedByPrefix = () => {
        const grouped: Record<string, ApiPermission[]> = {};
        permissions.forEach((permission) => {
            const prefix = permissionPrefix(permission.name);
            if (!grouped[prefix]) {
                grouped[prefix] = [];
            }
            grouped[prefix].push(permission);
        });
        // sort by prefix
        Object.entries(grouped).forEach(([prefix, permissions]) => {
            grouped[prefix] = permissions.toSorted((a, b) => {
                return a.name.localeCompare(b.name);
            });
        });
        return grouped;
    }

    const prefixToReadable = (prefix: string) => {
        return prefix.split('_').join(' ').toUpperCase();
    }

    const sortedPermissionGroups = Object.entries(permissionsGroupedByPrefix()).toSorted(([prefixA], [prefixB]) => {
        return prefixA.localeCompare(prefixB);
    });

    const sortedUserRoles = userRoles.toSorted((a, b) => {
        return a.user_role_permissions.length - b.user_role_permissions.length;
    });

    return (
        <>
            <Loader loading={initialLoading} text="Loading permissions...">
                <Accordion type="multiple">
                    {sortedPermissionGroups.map(([prefix, permissions]) => {
                        return (
                            <AccordionItem key={prefix} value={prefix}>
                                <AccordionTrigger>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm">{prefixToReadable(prefix)}</span>
                                        <span className="text-sm text-gray-500">{permissions.length}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Permission</TableHead>
                                                {sortedUserRoles.map((userRole) => {
                                                    return (
                                                        <TableHead key={userRole.id}>
                                                            {userRole.readable_name}
                                                        </TableHead>
                                                    )
                                                })}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {permissions.map((permission) => {
                                                return (
                                                    <TableRow key={permission.id}>
                                                        <TableCell>{permission.readable_name}</TableCell>
                                                        {sortedUserRoles.map((userRole) => {
                                                            return (
                                                                <UserRolesCheckbox key={userRole.id} userRole={userRole}
                                                                                   onRefresh={loadData}
                                                                                   permission={permission}/>)
                                                        })}
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            </Loader>
            <div className="flex gap-4 mt-4">
                <Button variant="outline-destructive" size="sm" className="flex gap-2 items-center"
                        onClick={patchPermissions}><AlertCircle/> Patch {patched}</Button>
            </div>
        </>
    );
}

export default UserRolesEditTable;
