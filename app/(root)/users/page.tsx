"use client";

import {Separator} from "@/components/ui/separator";
import {DataTable} from "./components/data-table";
import {userColumns} from "./components/columns";
import {ChevronRight, Plus} from "lucide-react";
import React from "react";
import axios from "axios";
import {IUsersResponse} from "@/types/axios-responses";
import {ApiUser} from "@/types/user";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useUser} from "@/components/providers/user-provider";
import {Input} from "@/components/ui/input";


export default function UsersAdminPage() {

    const router = useRouter();
    const user = useUser();

    const [loading, setLoading] = React.useState<boolean>(false);
    const [users, setUsers] = React.useState<ApiUser[]>([]);

    React.useEffect(() => {
        (async () => {
            await requestUser();
        })();
    }, []);

    const requestUser = async () => {
        setLoading(true)
        const response = await axios.get<IUsersResponse>('/api/users');
        setUsers(response.data.data.users);
        setLoading(false)
    }

    const [searchQuery, setSearchQuery] = React.useState<string>('');

    const onSearch = async (searchQuery: string) => {
        setSearchQuery(searchQuery);
        setLoading(true);
        const response = await axios.get<IUsersResponse>('/api/users', {
            params: {
                searchQuery
            }
        });
        setUsers(response.data.data.users);
        setLoading(false);
    }


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold flex gap-2 items-center">
                Settings <ChevronRight className="w-6 h-6 text-muted-foreground"/> Users
            </h1>
            <Separator/>
            {user.isAdmin &&
                <Button size="sm" className="mt-4" onClick={() => router.push('/users/create')}>
                    <Plus className="w-4 h-4 mr-2"/> Create User
                </Button>
            }
            <Input
                className="mt-4"
                placeholder="Search"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}/>
            <DataTable columns={userColumns} data={users} loading={loading}/>
        </div>
    )
}
