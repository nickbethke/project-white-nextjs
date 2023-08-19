import * as z from "zod";
import {notificationTypes} from "@/lib/constants/notification.constants";

const types = Object.keys(notificationTypes);
export const NotificationTypes = z.enum(types as any);


export const NewNotificationSchema = z
    .object({
        subject: z.string({required_error: "Subject is required"}).min(1, "Subject is required"),
        content: z.string({required_error: "Content is required"}).min(1, "Content is required"),
        type: NotificationTypes,
        to_id: z.string({required_error: "Recipient is required"}).min(1, "Recipient is required"),
    })


export type NewNotificationInput = z.infer<typeof NewNotificationSchema>;
