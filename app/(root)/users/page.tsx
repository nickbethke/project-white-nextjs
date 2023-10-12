"use client";

import { NewUserDialog } from "@/components/dialogs/new-user-dialog";
import { Loader } from "@/components/loader";
import { useUser } from "@/components/providers/user-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Api from "@/lib/api";
import { Permissions } from "@/lib/user";
import { IUsersResponse } from "@/types/axios-responses";
import { ApiUser } from "@/types/user";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { userColumns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default function UsersAdminPage() {
  const router = useRouter();
  const user = useUser();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<ApiUser[]>([]);

  React.useEffect(() => {
    (async () => {
      await requestUsers();
    })();
  }, []);

  const requestUsers = async () => {
    setLoading(true);
    const response = await Api.getUsers();
    if (response.isSuccess) {
      setUsers(response.data as ApiUser[]);
    } else {
      toast.error(response.errorMessage);
    }
    setLoading(false);
  };

  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const onSearch = async (searchQuery: string) => {
    setSearchQuery(searchQuery);
    setLoading(true);
    const response = await axios.get<IUsersResponse>("/api/users", {
      params: {
        searchQuery,
      },
    });
    setUsers(response.data.data.users);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold flex gap-2 items-center">Users</h1>
      <Separator />
      <div className="flex gap-2 items-center mt-4">
        {user.permission(Permissions.user_create) && (
          <NewUserDialog
            buttonVariant={"outline"}
            onCreated={() => requestUsers()}
          />
        )}
        <Button onClick={() => requestUsers()} variant="outline">
          <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>
      <Input
        className="mt-4"
        placeholder="Search"
        type="search"
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
      />
      <Loader loading={loading} text="Loading users...">
        <DataTable columns={userColumns} data={users} loading={loading} />
      </Loader>
    </div>
  );
}
