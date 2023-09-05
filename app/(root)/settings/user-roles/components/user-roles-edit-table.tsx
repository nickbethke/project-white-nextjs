"use client";

import {ApiUserRole} from "@/types/user";
import React, {useState} from "react";
import axios from "axios";
import {IUserRolesResponse} from "@/types/axios-responses";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {Permissions} from "@/lib/user";
import toast from "react-hot-toast";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

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

    React.useEffect(() => {
        (async () => {
            await loadUserRoles();
        })();
    }, []);

    const loadUserRoles = async () => {
        try {
            const response = await axios.get<IUserRolesResponse>('/api/users/roles');
            const roles = response.data.data.userRoles;

            // sort roles by allowed permissions count (ascending)
            roles.sort((a, b) => {
                const aCount = permissionTrueLength(a);
                const bCount = permissionTrueLength(b);

                if (aCount < bCount) {
                    return -1;
                }

                if (aCount > bCount) {
                    return 1;
                }

                return 0;
            });

            setUserRoles(roles);
        } catch (e) {
            console.error(e);
        }
    }

    const permissionTrueLength = (userRole: ApiUserRole) => {
        let count = 0;
        Object.keys(userRole.permissions).forEach((permission) => {
            if (userRole.permissions[permission as keyof typeof Permissions]) {
                count++;
            }
        });
        return count;
    }

    if (!userRoles) {
        return null;
    }

    const getPrefix = (permission: string) => {
        return permission.split('_').slice(0, -1).join('_');
    }

    const prefixReadable = (prefix: string) => {
        return prefix.split('_').join(' ').toUpperCase();
    }


    const groupPermissionsByPrefix = (): Record<string, Permissions[]> => {
        const permissions = Object.keys(Permissions);
        const groupedPermissions: Record<string, Permissions[]> = {};
        permissions.forEach((permission) => {
            const prefix = getPrefix(permission);
            if (!groupedPermissions[prefix]) {
                groupedPermissions[prefix] = [];
            }
            groupedPermissions[prefix].push(Permissions[permission as keyof typeof Permissions]);
        });

        // order by prefix
        Object.keys(groupedPermissions).sort((a, b) => a.localeCompare(b)).forEach((key) => {
            const value = groupedPermissions[key];
            delete groupedPermissions[key];
            groupedPermissions[key] = value;
        });
        return groupedPermissions;
    }

    const body = (prefix: string) => {

        const groupedPermissions = groupPermissionsByPrefix();
        return groupedPermissions[prefix].map((permission) => (
            <TableRow key={permission}>
                <TableCell>
                    <div className="font-bold">{UserRolesEditValues[permission]}</div>
                </TableCell>
                {userRoles.map((userRole) => {
                    return (
                        <TableCell key={userRole.id}>
                            <Checkbox
                                checked={userRole.permissions[permission]}
                                onCheckedChange={async (checked) => {
                                    try {
                                        const response = await axios.patch(`/api/users/roles/${userRole.id}`, {
                                            permission: {
                                                [permission]: checked,
                                            }
                                        });
                                        toast.success(response.data.message);
                                        await loadUserRoles();
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }}
                            />
                        </TableCell>
                    )
                })}
            </TableRow>
        ))
    }

    const table = (prefix: string) => {

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Role / Permission</TableHead>
                        {userRoles.map((userRole) => (
                            <TableHead className="font-bold tracking-widest"
                                       key={userRole.id}>{userRole.name}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body(prefix)}
                </TableBody>

            </Table>
        );

    }


    return (
        <Accordion type="multiple">
            {Object.keys(groupPermissionsByPrefix()).map((prefix) => {
                if (prefix === 'user_roles')
                    return null;
                return (
                    <AccordionItem key={prefix} value={prefix}>
                        <AccordionTrigger>
                            {prefixReadable(prefix)}
                        </AccordionTrigger>
                        <AccordionContent>
                            {table(prefix)}
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    );
}

export default UserRolesEditTable;
