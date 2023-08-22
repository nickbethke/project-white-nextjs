"use client";

import {RegisterUserInput, RegisterUserSchema} from "@/lib/validations/user.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";


export const SignUpForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<RegisterUserInput>({
        resolver: zodResolver(RegisterUserSchema),
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            username: '',
            passwordConfirm: '',
        }
    });

    const onSubmit = async (data: RegisterUserInput) => {
        setLoading(true);
        try {
            const result = await axios.post('/api/auth/register', data);


            if (result.data.status === 'success') {
                toast.success("Successfully registered.");
                router.push('/auth/signin');
                return;
            } else {
                toast.error(result.data.error);
                setLoading(false);
                return;
            }
        } catch (error) {
            toast.error("Failed to register.");
            setLoading(false);
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                    <FormField control={form.control} name="username" render={
                        ({field}) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Username" type="text"  {...field}/>
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
                                    <Input disabled={loading} placeholder="Email" type="email"  {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }/>
                    <div className="flex gap-4 w-full items-center justify-center">
                        <FormField control={form.control} name="firstName" render={
                            ({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="First Name" type="text"  {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                        <FormField control={form.control} name="lastName" render={
                            ({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Last Name" type="text"  {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                    </div>
                    <div className="flex gap-4 w-full items-center justify-center">
                        <FormField control={form.control} name="password" render={
                            ({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Password" type="password"  {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                        <FormField control={form.control} name="passwordConfirm" render={
                            ({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Password Confirm</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Password Confirm"
                                               type="password"  {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                    </div>
                    <div className="flex items-center justify-between">
                        <a href="/auth/signin" className="text-sm text-gray-600 hover:text-gray-500">
                            Already have an account?
                        </a>
                        <Button disabled={loading} type="submit" className="ml-auto">
                            {loading ? "Loading..." : "Sign Up"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
