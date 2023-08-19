"use client"

import * as React from "react"
import {Check, ChevronsUpDown} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {ApiUser} from "@/types/user";

type UserComboboxProps = {
    onChange: (value: string) => void
}

export function UserCombobox({onChange}: UserComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [users, setUsers] = React.useState<ApiUser[]>([]);

    React.useEffect(() => {
        fetch('/api/users')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.data.users);
            });
    }, []);

    if (!users) return null;


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full flex justify-between")}
                >
                    {value
                        ? users.find((user) => user.username === value)?.username
                        : "Select user..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search user..."/>
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
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
                                {user.username}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
