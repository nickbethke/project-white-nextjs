import * as z from "zod";
import {ZodType} from "zod";

export type CalendarEventCreateFields = {
    title: string,
    notes: string,
    start: string,
    end: string,
    links: string[]
}

export const NewCalendarEventSchema: ZodType<CalendarEventCreateFields> = z
    .object({
        title: z.string({required_error: "Title is required"}).min(1, "Title is required"),
        notes: z.string(),
        start: z.string({required_error: "Start date is required"}).min(1, "Start date is required"),
        end: z.string({required_error: "End date is required"}).min(1, "End date is required"),
        links: z.array(z.string({required_error: "Links are required"}))
    })
    .refine(data => {
        try {
            const startDate = new Date(data.start);
            const endDate = new Date(data.end);
            return startDate < endDate;
        } catch (e) {
            return false;
        }
    }, {
        message: "Start date must be before end date",
        path: ["start", "end"]
    })
    .refine(data => {
        const links = data.links;
        const validLinks = links.filter(link => link.startsWith("http://") || link.startsWith("https://"));
        return links.length === validLinks.length;
    }, {
        message: "Links must be valid URLs",
        path: ["links"]
    });

export type NewCalendarEventInput = z.infer<typeof NewCalendarEventSchema>;
