import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import Gravatar from "@/components/gravatar";
import {Separator} from "@/components/ui/separator";
import {Table, TableBody, TableCaption, TableCell, TableRow} from "@/components/ui/table";
import {prismaDB} from "@/lib/prisma";
import {dateTimeFormatted} from "@/lib/utils";
import {user_role} from ".prisma/client";
import {Roles} from "@/lib/constants/roles";
import {Badge} from "@/components/ui/badge";

const ProfilePage = async () => {


    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/signin');
    }

    const user = await prismaDB.users.findUnique({
        where: {
            id: session.user.id
        }
    });

    if (!user) {
        redirect('/signin');
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold flex gap-2 items-center">
                Profile
                <Badge variant={user.user_role === user_role.superadmin ? 'destructive' : 'outline'}>
                    {Roles[user.user_role]}
                </Badge>
            </h1>
            <Separator/>
            <div className="p-4">
                <Gravatar email={user.email} size={128}/>
            </div>
            <Table>
                <TableCaption>
                    Your profile information
                </TableCaption>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-bold">Name</TableCell>
                        <TableCell>{session.user.username}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Email</TableCell>
                        <TableCell>{session.user.email}</TableCell>
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
                        <TableCell>{session.user.id}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Created At</TableCell>
                        <TableCell>{dateTimeFormatted(user.createdAt)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );

}

export default ProfilePage;
