"use client";

import {ApiPermission, ApiUserRole} from "@/types/user";
import React, {useState} from "react";
import axios from "axios";
import {IUserRolesPermissionResponse, IUserRolesResponse} from "@/types/axios-responses";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Permissions} from "@/lib/user";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Loader} from "lucide-react";
import {UserRolesCheckbox} from "@/app/(root)/settings/user-roles/components/user-roles-checkbox";

const UserRolesEditValues: Record<Permissions, string> = {
    [Permissions.own_profile_update]: 'Own Profile Update',
    [Permissions.own_profile_delete]: 'Own Profile Delete',
    [Permissions.user_read]: 'User Read',
    [Permissions.user_create]: 'User Create',
    [Permissions.user_update]: 'User Update',
    [Permissions.user_delete]: 'User Delete',
    [Permissions.user_role_read]: 'User Role Read',
    [Permissions.user_role_create]: 'User Role Create',
    [Permissions.user_role_update]: 'User Role Update',
    [Permissions.user_role_delete]: 'User Role Delete',
    [Permissions.user_role_permission_read]: 'User Role Permission Read',
    [Permissions.user_role_permission_create]: 'User Role Permission Create',
    [Permissions.user_role_permission_update]: 'User Role Permission Update',
    [Permissions.user_role_permission_delete]: 'User Role Permission Delete',
    [Permissions.group_read]: 'Group Read',
    [Permissions.group_create]: 'Group Create',
    [Permissions.group_update]: 'Group Update',
    [Permissions.group_delete]: 'Group Delete',
    [Permissions.group_member_read]: 'Group Member Read',
    [Permissions.group_member_create]: 'Group Member Create',
    [Permissions.group_member_update]: 'Group Member Update',
    [Permissions.group_member_delete]: 'Group Member Delete',
    [Permissions.notification_read]: 'Notification Read',
    [Permissions.notification_create]: 'Notification Create',
    [Permissions.notification_update]: 'Notification Update',
    [Permissions.notification_delete]: 'Notification Delete',
    [Permissions.calendar_event_read]: 'Calendar Event Read',
    [Permissions.calendar_event_create]: 'Calendar Event Create',
    [Permissions.calendar_event_update]: 'Calendar Event Update',
    [Permissions.calendar_event_delete]: 'Calendar Event Delete',
    [Permissions.option_read]: 'Option Read',
    [Permissions.option_create]: 'Option Create',
    [Permissions.option_update]: 'Option Update',
    [Permissions.option_delete]: 'Option Delete',
    [Permissions.user_roles_create]: 'Calendar Event Create',
    [Permissions.user_roles_read]: 'Calendar Event Read',
    [Permissions.user_roles_update]: 'Calendar Event Update',
    [Permissions.user_roles_delete]: 'Calendar Event Delete',
}

const UserRolesEditTable = () => {

    const [userRoles, setUserRoles] = useState<ApiUserRole[]>([]);
    const [permissions, setPermissions] = useState<ApiPermission[]>([]);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);

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

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center gap-2">
                <Loader className="animate-spin"/>
                Loading...
            </div>
        )
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


    const sortedPermissionGroups = Object.entries(permissionsGroupedByPrefix()).toSorted(([prefixA, permissionsA], [prefixB, permissionsB]) => {
        return prefixA.localeCompare(prefixB);
    });

    const sortedUserRoles = userRoles.toSorted((a, b) => {
        return a.user_role_permissions.length - b.user_role_permissions.length;
    });

    return (
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
                                                <TableCell>{UserRolesEditValues[permission.name as Permissions]}</TableCell>
                                                {sortedUserRoles.map((userRole) => {
                                                    return (<UserRolesCheckbox key={userRole.id} userRole={userRole}
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
    );
}

export default UserRolesEditTable;
