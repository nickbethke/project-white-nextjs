import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {redirect} from "next/navigation";
import {prismaDB} from "@/lib/prisma";
import {Separator} from "@/components/ui/separator";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {dateTimeFormatted} from "@/lib/utils";
import ProfileButton from "@/components/profile-button";
import Gravatar from "@/components/gravatar";

export default async function ProfileView({params}: { params: { profileId: string } }) {

    const user = await prismaDB.users.findUnique({
        where: {
            id: params.profileId
        }
    });

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/signin');
    }

    if (session.user.id === params.profileId) {
        redirect('/profile');
    }

    if (!user) {
        redirect('/signin');
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold flex gap-2 items-baseline">
                Profile - {user.username}
            </h1>
            <Separator/>
            <div className="p-4">
                <Gravatar email={user.email} size={128}/>
            </div>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-bold">Name</TableCell>
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
    )
}
