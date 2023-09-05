"use client";

import React from "react";
import {ApiGroupWithMembers} from "@/types/groups";
import axios, {AxiosError} from "axios";
import {IGroupsPostResponse, IGroupsResponse} from "@/types/axios-responses";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {NewGroupInput, NewGroupSchema} from "@/lib/validations/group.schema";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader, RefreshCw} from "lucide-react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import Gravatar from "@/components/gravatar";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";
import {Checkbox} from "@/components/ui/checkbox";
import {useUser} from "@/components/providers/user-provider";
import {Permissions} from "@/lib/user";
import {GroupBadge} from "@/components/group-badge";

type SettingsGroupsFormProps = {}
const SettingsGroupsForm: React.FC<SettingsGroupsFormProps> = () => {

    const [ownGroups, setOwnGroups] = React.useState<ApiGroupWithMembers[]>([]);
    const [groups, setGroups] = React.useState<ApiGroupWithMembers[]>([]);

    const [loadingGroups, setLoadingGroups] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const user = useUser();

    React.useEffect(() => {
        (async () => {
            await reloadGroups();
        })();
    }, []);


    const form = useForm<NewGroupInput>({
        resolver: zodResolver(NewGroupSchema),
        defaultValues: {
            name: '',
            addMyself: false,
        },
    });

    const reloadGroups = async () => {
        setLoadingGroups(true);
        const res = await axios.get<IGroupsResponse>('/api/users/groups');
        setOwnGroups(res.data.data.own);
        setGroups(res.data.data.all.filter((group) => !res.data.data.own.find((ownGroup) => ownGroup.id === group.id)));
        setLoadingGroups(false);
    }

    const onSubmit = async (data: NewGroupInput) => {
        setLoading(true);
        try {
            const result = await axios.post<IGroupsPostResponse>('/api/users/groups', data);
            if (result.data.status === 'success') {
                toast.success(result.data.message);
                await reloadGroups();
                form.reset();
                setLoading(false);
                return;
            } else {
                toast.error(result.data.message);
                setLoading(false);
                return;
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                form.setError('name', {
                    type: 'value',
                    message: error.response?.data.message
                })
            }
            setLoading(false);
            return;
        }
    }

    const view = () => {
        return (
            <>
                <h2 className="text-xl font-bold">Your Groups</h2>
                <div className="flex flex-col items-center justify-between gap-2">
                    {loadingGroups ?
                        Array.from(Array(3).keys()).map((index) => (
                            <Skeleton key={index} className="w-full h-14"/>
                        ))
                        :
                        ownGroups.map((group) => (
                            <GroupView key={group.id} group={group}/>
                        ))
                    }
                </div>
                <Separator/>
                <h2 className="text-xl font-bold">Other Groups</h2>
                <div className="flex flex-col items-center justify-between gap-2">
                    {loadingGroups ?
                        Array.from(Array(3).keys()).map((index) => (
                            <Skeleton key={index} className="w-full h-14"/>
                        ))
                        :
                        groups.map((group) => (
                            <GroupView key={group.id} group={group}/>
                        ))
                    }
                </div>

            </>
        )
    }

    return (
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-4 gap-4">
            <div className="mt-4 lg:col-span-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={reloadGroups}
                        variant="outline"
                        size="sm"
                        className="w-fit"
                    >
                        <RefreshCw className="w-4 h-4 mr-2"/>
                        Reload
                    </Button>
                    {loadingGroups ?
                        <span className="font-normal text-xs text-muted-foreground flex gap-2">
                            <Loader className="w-4 h-4 animate-spin"/> Loading...
                        </span>
                        : null
                    }
                </div>
                {view()}
            </div>
            <div className="mt-4 lg:mt-0 lg:border-l p-4 flex flex-col gap-4">
                {!user ?
                    <Skeleton className="w-full h-12"/>
                    : null}
                {user?.isSuperAdmin && user.permission(Permissions.group_delete) ?
                    <>
                        <div>
                            <h3 className="text-xl font-bold">Super Admin</h3>
                            <div className="flex items-center justify-between mt-4">
                                <Button
                                    onClick={() => {
                                        axios.post('/api/users/groups/delete-empty').then(async () => {

                                                toast.success('Deleting empty groups...');
                                                await reloadGroups();
                                            }
                                        ).catch((error) => {
                                                toast.error('Error deleting empty groups.');
                                            }
                                        )
                                    }}
                                    variant="outline"
                                >
                                    Delete Empty Groups
                                </Button>
                            </div>

                        </div>
                        <Separator/>
                    </>
                    :
                    null
                }
                {user && !user.isUser ?
                    <>
                        <h3 className="sr-only">Create a new group</h3>
                        <div className="flex items-center justify-between">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                                    <FormField control={form.control} name="name" render={
                                        ({field}) => (
                                            <FormItem>
                                                <FormLabel>New Group Name</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="Group Name"
                                                           type="text"  {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }/>
                                    <FormField control={form.control} name="addMyself" render={
                                        ({field}) => (
                                            <FormItem
                                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Add me to this group
                                                    </FormLabel>
                                                    <FormDescription>
                                                        You will be added to this group as a member.
                                                    </FormDescription>
                                                </div>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }/>
                                    <Button disabled={loading} type="submit" className="ml-auto">Create Group</Button>
                                </form>
                            </Form>
                        </div>
                    </>
                    : null}
            </div>
        </div>
    )
}

const GroupView: React.FC<{ group: ApiGroupWithMembers }> = ({group}) => {
    const router = useRouter();
    return (

        <Button
            onClick={() => router.push(`/settings/groups/${group.id}`)}
            variant="outline"
            className="w-full py-8 justify-start items-center"
        >
            <div className="flex items-center justify-between w-full">
                <GroupBadge group={group} size="lg"/>
                <MembersView group={group}/>
            </div>
        </Button>

    )
}

const MembersView: React.FC<{ group: ApiGroupWithMembers }> = ({group}) => {
    if (group.group_members.length === 0) return null;

    const firstThreeMembers = group.group_members.slice(0, 3);
    return (
        <div className="flex items-center">
            <div className="flex items-center -space-x-2">
                {firstThreeMembers.map((member, index) => (
                    <Gravatar email={member.user.email} key={member.user_id} className="w-6 h-6 rounded-full"
                              style={{zIndex: 3 - index}}/>
                ))}
            </div>
            {group.group_members.length > 3 ?
                <span className="ml-2 text-xs text-muted-foreground">+{group.group_members.length - 3}</span>
                : null}
        </div>
    )
}

export default SettingsGroupsForm
