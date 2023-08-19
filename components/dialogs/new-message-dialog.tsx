"use client";

import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input"
import {Pen} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {NewNotificationInput, NewNotificationSchema} from "@/lib/validations/notification.schema";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {UserCombobox} from "@/components/user-combobox";
import axios from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";


export const NewMessageDialog: React.FC = () => {

    const router = useRouter();

    const [isMounted, setIsMounted] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);

    const form = useForm<NewNotificationInput>({
        resolver: zodResolver(NewNotificationSchema),
        defaultValues: {
            subject: '',
            content: '',
            type: 'message',
            to_id: '0',
        }
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const onSubmit = async (data: NewNotificationInput) => {
        setLoading(true);
        try {
            const result = await axios.post('/api/notifications', data);

            if (result.data.status === 'success') {
                toast.success("Successfully sent.");
                setOpen(false);
                setLoading(false);
                router.refresh();
                return;
            }
        } catch (error) {
            toast.error("Failed to send.");
            setLoading(false);
        }
    }


    return (
        <>
            <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
                <DialogTrigger asChild>
                    <Button className="w-full text-lg" size="lg" onClick={() => setOpen(true)}>
                        <Pen className="w-5 h-5 mr-2"/>
                        Write
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[640px]">
                    <DialogHeader>
                        <DialogTitle>Write a message</DialogTitle>
                        <DialogDescription>
                            Send a message to another user.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                            <FormField control={form.control} name="to_id" render={
                                ({field}) => (
                                    <FormItem>
                                        <FormLabel>To</FormLabel>
                                        <FormControl>
                                            <UserCombobox onChange={(value) => {
                                                form.setValue('to_id', value);
                                            }}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )
                            }/>
                            <FormField control={form.control} name="subject" render={
                                ({field}) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Subject"
                                                   type="text"  {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )
                            }/>
                            <FormField control={form.control} name="content" render={
                                ({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea className="min-h-[100px]" placeholder="Content"
                                                      disabled={loading} {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )
                            }/>
                            <div className="flex w-full items-center justify-end">
                                <Button type="submit">Send</Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>

            </Dialog>
        </>
    );
}
