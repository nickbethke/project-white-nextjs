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

type UserComboboxProps = {
    onChange: (value: string) => void
}

export function UserCombobox({onChange}: UserComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [users, setUsers] = React.useState<ApiUser[]>([]);

    React.useEffect(() => {
        fetch('/api/users')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.data.users);
            });
    }, []);

    if (!users) return null;

    const onSearch: FormEventHandler<HTMLInputElement> = (e) => {
        setSearch(e.currentTarget.value);
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
                        {value
                            ? <Gravatar email={users.find((user) => user.username === value)?.email ?? ""}
                                        className="mr-2 h-4 w-4"/>
                            : ""}
                        {value
                            ? users.find((user) => user.username === value)?.username
                            : "Select user..."}
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
                                    onChange(currentValue === value ? "" : users.find((user) => user.username === currentValue)?.id ?? "")
                                }}
                                value={user.username}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === user.username ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <Gravatar email={user.email} className="mr-2 h-8 w-8"/>
                                <div className="flex flex-col">
                                    <span>{user.username}</span><span
                                    className="text-muted-foreground text-xs">{user.email}</span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandGroup heading="Groups">
                        <CommandItem
                            key={1}
                            onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue)
                                setOpen(false)
                                onChange(currentValue === value ? "" : currentValue)
                            }}
                            value="group1"
                        >
                            <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    value === "group1" ? "opacity-100" : "opacity-0"
                                )}
                            />
                            <div className="flex flex-col">
                                <span>Group 1</span><span
                                className="text-muted-foreground text-xs">
                                    Group 1 description
                                </span>
                            </div>
                        </CommandItem>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
