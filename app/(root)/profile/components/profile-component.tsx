"use client";

import { RoleBadge } from "@/components/role-badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { UserProfilePicture } from "@/components/user-profile-picture";
import { dateTimeFormatted } from "@/lib/utils";
import { ApiUser } from "@/types/user";

type Props = {
  user: ApiUser;
};

export const Profile = (props: Props) => {
  const { user } = props;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold flex gap-2 items-center">
        Profile
        <RoleBadge role={user.user_role} />
      </h1>
      <Separator />
      <div className="p-4 flex gap-4 items-center">
        <UserProfilePicture user={user} size={160} />
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
