import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import React, {useEffect} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {VariantProps} from "class-variance-authority";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {NewUserInput, NewUserSchema} from "@/lib/validations/new-user.schema";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import axios, {AxiosError} from "axios";
import {IResponse, IUserRolesResponse, IUsersResponse} from "@/types/axios-responses";
import {ApiUserRole} from "@/types/user";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import toast from "react-hot-toast";

type NewUserDialogProps = {
    buttonVariant: VariantProps<typeof buttonVariants>["variant"];
    onCreated?: () => void;
}

export const NewUserDialog = ({buttonVariant, onCreated}: NewUserDialogProps) => {

    const [open, setOpen] = React.useState<boolean>(false);

    const [loading, setLoading] = React.useState<boolean>(false);

    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');

    const [roles, setRoles] = React.useState<ApiUserRole[]>([]);


    const form = useForm<NewUserInput>({
        resolver: zodResolver(NewUserSchema),
        defaultValues: {
            username: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
            role: '',
            passwordConfirm: '',
            withActivation: false,
        },
    });

    useEffect(() => {
        setLoading(true)
        setFirstName(form.getValues('firstName'));
        setLastName(form.getValues('lastName'));
        (async () => {
            const response = await axios.get<IUserRolesResponse>('/api/users/roles');
            setRoles(response.data.data.userRoles);
            form.setValue('role', response.data.data.userRoles[0].id);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        form.setValue('firstName', firstName);
        form.setValue('lastName', lastName);
        const username = formatUsername();
        form.setValue('username', username);
    }, [firstName, lastName]);

    const formatUsername = () => {
        // lowercase and remove spaces and special characters
        return `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    const isUsernameFree = async (username: string) => {
        const response = await axios.get<IUsersResponse>('/api/users');

        const users = response.data.data.users;

        return users.filter(user => user.username === username).length === 0;

    }

    const isEmailFree = async (email: string) => {
        const response = await axios.get<IUsersResponse>('/api/users');

        const users = response.data.data.users;

        return users.filter(user => user.email === email).length === 0;
    }

    const onSubmit = async (data: NewUserInput) => {
        setLoading(true);
        try {
            const result = await axios.post<IResponse>("/api/users", {
                data
            });
            if (result.status === 200) {
                setLoading(false);
                toast.success('User created.');
                form.reset();
                onCreated?.();
                setOpen(false);
            } else {
                setLoading(false);
                toast.error(result.data.message);
            }
        } catch (error) {
            if (error instanceof AxiosError)
                toast.error(error.response?.data.message);
            else
                toast.error("Something went wrong.");
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} onClick={() => setOpen(true)}>
                    <Plus className="w-6 h-6 mr-2"/> Create user
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new user</DialogTitle>
                    <DialogDescription>
                        This will create a new user.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="firstName" render={
                                ({field}) => (
                                    <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input {...field} onInput={(e) => {
                                                setFirstName(e.currentTarget.value);
                                            }} disabled={loading} placeholder="First name"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )
                            }/>
                            <FormField control={form.control} name="lastName" render={
                                ({field}) => (
                                    <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input {...field} onInput={(e) => {
                                                setLastName(e.currentTarget.value);
                                            }} disabled={loading} placeholder="Last name"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )
                            }/>
                        </div>
                        <FormField control={form.control} name="username" render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} onInput={async (e) => {
                                            form.setValue('username', e.currentTarget.value);
                                            if (!await isUsernameFree(e.currentTarget.value)) {
                                                form.setError('username', {
                                                    type: 'manual',
                                                    message: 'Username is taken.'
                                                });
                                            } else {
                                                form.clearErrors('username');
                                            }
                                        }} disabled={loading} placeholder="Username"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                        <FormField control={form.control} name="email" render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} onInput={async (e) => {
                                            form.setValue('email', e.currentTarget.value);
                                            if (!await isEmailFree(e.currentTarget.value)) {
                                                form.setError('email', {
                                                    type: 'manual',
                                                    message: 'Email is already taken.'
                                                });
                                            } else {
                                                form.clearErrors('email');
                                            }
                                        }} disabled={loading} placeholder="Email"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                        <FormField control={form.control} name="password" render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loading} placeholder="Password"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                        <FormField control={form.control} name="passwordConfirm" render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loading} placeholder="Confirm password"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                        <FormField control={form.control} name="role" render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roles.map(role => (
                                                <SelectItem value={role.id} key={role.id}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>

                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                        <FormField control={form.control} name="withActivation" render={
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
                                            Generate activation token and send email
                                        </FormLabel>
                                        <FormDescription>
                                            When this is checked, an activation token will be generated and sent to the
                                            user's email, so that the user has to activate their account before they
                                            can log in.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )
                        }/>
                        <div className="flex w-full items-center justify-end">
                            <Button type="submit" disabled={loading}>Send</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
