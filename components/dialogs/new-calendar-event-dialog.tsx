"use client";

import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {NewCalendarEventInput, NewCalendarEventSchema,} from "@/lib/validations/calendar-event.schema";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {MultiInput} from "@/components/ui/multi-input";
import moment from "moment";
import Image from "next/image";

type NewCalendarEventDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onMount?: () => void;
  startDate?: Date;
};

export function NewCalendarEventDialog(props: NewCalendarEventDialogProps) {
  const router = useRouter();

  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(props.open);

  const form = useForm<NewCalendarEventInput>({
    resolver: zodResolver(NewCalendarEventSchema),
    defaultValues: {
      title: "",
      notes: "",
      start: moment(props.startDate).format("YYYY-MM-DDTHH:mm") ?? "",
      end:
        moment(props.startDate).add(1, "hour").format("YYYY-MM-DDTHH:mm") ?? "",
      links: [],
    },
  });

  useEffect(() => {
    setIsMounted(true);
    props.onMount?.();
  }, []);

  useEffect(() => {
    setOpen(props.open);
    props.open ? form.reset() : form.clearErrors();
    props.onOpenChange(props.open);
  }, [props.open]);

  useEffect(() => {
    form.setValue(
      "start",
      moment(props.startDate)
        .set("hour", moment().hour())
        .set("minute", moment().minute())
        .format("YYYY-MM-DDTHH:mm")
    );
    form.setValue(
      "end",
      moment(props.startDate)
        .set("hour", moment().hour() + 1)
        .set("minute", moment().minute())
        .format("YYYY-MM-DDTHH:mm")
    );
  }, [props.startDate]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  if (!isMounted) return <p>Loading...</p>;

  const onSubmit = async (data: NewCalendarEventInput) => {
    setLoading(true);
    try {
      const result = await axios.post("/api/calendar/events", {
        ...data,
        start: moment(data.start).toISOString(),
        end: moment(data.end).toISOString(),
        links: JSON.stringify(data.links),
      });

      if (result.data.status === "success") {
        toast.success("Successfully created.");
        setOpen(false);
        setLoading(false);
        router.refresh();
        return;
      }
    } catch (error) {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          props.onOpenChange(isOpen);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setOpen(true)}>
            New event
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Create a new event</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <div className="flex space-x-4 w-full">
                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-full">
                        <FormLabel>Start</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={loading}
                            placeholder="Start"
                            value={field.value}
                            type="datetime-local"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="end"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>End</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Start"
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Title"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Notes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="links"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Links</FormLabel>
                      <FormControl>
                        <MultiInput
                          disabled={loading}
                          placeholder="Links"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          itemIcon={(value) => (
                            <Image
                              src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${value}&size=16`}
                              width={16}
                              height={16}
                              alt="Icon"
                            />
                          )}
                          isValueValid={(value) => {
                            return (
                              value.startsWith("http://") ||
                              value.startsWith("https://")
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex w-full items-center justify-end">
                <Button type="submit">Create</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
