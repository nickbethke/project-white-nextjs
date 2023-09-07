import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import Gravatar from "@/components/gravatar";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {dateTimeFormatted} from "@/lib/utils";
import {User} from "@/lib/user";
import React from "react";

type Props = {
    user: User
}

export const Profile: React.FC<Props> = ({user}) => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold flex gap-2 items-center">
                Profile
                <Badge variant={user.isSuperAdmin ? 'destructive' : 'outline'}>
                    {user.user_role.readable_name}
                </Badge>
            </h1>
            <Separator/>
            <div className="p-4">
                <Gravatar email={user.email} size={128}/>
            </div>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-bold">Username</TableCell>
                        <TableCell>{user.username}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Email</TableCell>
                        <TableCell>{user.email}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">First Name</TableCell>
                        <TableCell>{user.firstname}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Last Name</TableCell>
                        <TableCell>{user.lastname}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">ID</TableCell>
                        <TableCell>{user.id}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Created At</TableCell>
                        <TableCell>{dateTimeFormatted(user.createdAt)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};
