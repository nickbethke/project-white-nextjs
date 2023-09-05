"use client"

import * as React from "react"
import {FormEventHandler} from "react"
import {Check, ChevronsUpDown} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {ApiUser} from "@/types/user";
import Gravatar from "@/components/gravatar";
import axios from "axios";
import {ApiGroup, ApiGroupWithMembers} from "@/types/groups";
import {IGroupsResponse} from "@/types/axios-responses";
import {GroupBadge} from "@/components/group-badge";

type Result = {
    type: "user" | "group"
    value: string
}

type UserComboboxProps = {
    onChange: (value: Result) => void
}

export function UserCombobox({onChange}: UserComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [users, setUsers] = React.useState<ApiUser[]>([]);
    const [groups, setGroups] = React.useState<ApiGroupWithMembers[]>([]);

    const [toGroup, setToGroup] = React.useState<boolean>(false);

    React.useEffect(() => {
        axios.get('/api/users').then((res) => {
            setUsers(res.data.data.users);
        });

        axios.get<IGroupsResponse>('/api/users/groups').then((res) => {
            setGroups(res.data.data.all);
        });
    }, []);

    if (!users || !groups) {
        return <div>Loading...</div>
    }

    const onSearch: FormEventHandler<HTMLInputElement> = (e) => {
        setSearch(e.currentTarget.value);
    }

    const inputElement = () => {
        if (toGroup) {
            const group = groups.find((group) => group.name.toLowerCase() === value);
            if (!group) return "";
            return <GroupBadge group={group}/>
        }
        return (<>
            {value
                ? <Gravatar email={users.find((user) => user.username === value)?.email ?? ""}
                            className="mr-2 h-4 w-4"/>
                : ""}
            {value
                ? users.find((user) => user.username === value)?.username
                : "Select user..."}
        </>);
    }


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full flex justify-between items-center", open && "outline-none ring-2 ring-ring ring-offset-2")}
                >
                    <div className="flex items-center">
                        {inputElement()}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search user by username..." value={search} onInput={onSearch}/>
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup heading="Users">
                        {users.map((user) => (
                            <CommandItem
                                key={user.username}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                    setToGroup(false);
                                    onChange({
                                        type: "user",
                                        value: currentValue === value ? "" : users.find((user) => user.username === currentValue)?.id ?? ""
                                    })
                                }}
                                value={user.username}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === user.username ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <Gravatar email={user.email} className="mr-2 h-6 w-6"/>
                                <div className="flex flex-col">
                                    <span>{user.username}</span><span
                                    className="text-muted-foreground text-xs">{user.email}</span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandGroup heading="Groups">
                        {groups.map((group) => (
                            <CommandItem
                                key={group.name.toLowerCase()}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                    setToGroup(true);
                                    onChange({
                                        type: "group",
                                        value: currentValue === value ? "" : group.name.toLowerCase()
                                    })
                                }}
                                value={group.name.toLowerCase()}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === group.name.toLowerCase() ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <GroupBadge group={group}/>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
