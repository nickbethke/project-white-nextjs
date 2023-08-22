"use client";

import {LoginUserInput, LoginUserSchema} from "@/lib/validations/user.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";


export const SigninForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<LoginUserInput>({
        resolver: zodResolver(LoginUserSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: LoginUserInput) => {
        setLoading(true)
        const result = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password,
        })

        if (!result || result.error) {
            toast.error("Invalid credentials.");
            setLoading(false)
            return;
        }

        if (result.ok) {
            toast.success("Successfully logged in.");
            router.push('/');
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
                    <FormField control={form.control} name="password" render={
                        ({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Password" type="password"  {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )
                    }/>
                    <div className="flex items-center justify-between">
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-500">
                            Forgot your password?
                        </a>
                        <Button disabled={loading} type="submit" className="ml-auto">
                            {loading ? "Loading..." : "Login"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
