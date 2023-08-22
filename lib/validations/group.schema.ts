import {z, ZodType} from "zod";

export type GroupCreateFields = {
    name: string,
    addMyself?: boolean,
}

export const NewGroupSchema: ZodType<GroupCreateFields> = z
    .object({
        name: z.string({required_error: "Name is required"}).min(1, "Name is required"),
        addMyself: z.boolean().default(false).optional(),
    });

export type NewGroupInput = z.infer<typeof NewGroupSchema>;
