import * as z from "zod";
import axios from "axios";
import {IUserRolesResponse, IUsersResponse} from "@/types/axios-responses";

export const NewUserSchema = z
    .object({
        username: z.string({required_error: "Username is required"}).min(1, "Username is required"),
        firstName: z.string({required_error: "First name is required"}).min(1, "First name is required"),
        lastName: z.string({required_error: "Last name is required"}).min(1, "Last name is required"),
        email: z.string({required_error: "Email is required"}).min(1, "Email is required").email("Email is invalid"),
        password: z.string({required_error: "Password is required"}).min(1, "Password is required").min(8, "Password must be more than 8 characters").max(32, "Password must be less than 32 characters"),
        passwordConfirm: z.string({required_error: "Confirm your password"}).min(1, "Confirm your password"),
        withActivation: z.boolean(),
        role: z.string(),
    }).refine((data) => data.password === data.passwordConfirm, {
        path: ["passwordConfirm"],
        message: "Passwords do not match",
    }).refine(async (data) => {
        const username = data.username;
        const response = await axios.get<IUsersResponse>('/api/users');

        const users = response.data.data.users;

        return users.filter(user => user.username === username).length === 0;
    }, {
        message: "Username is already taken",
        path: ["username"],
    }).refine(async (data) => {
        const email = data.email;
        const response = await axios.get<IUsersResponse>('/api/users');

        const users = response.data.data.users;

        return users.filter(user => user.email === email).length === 0;
    }, {
        message: "Email is already taken",
        path: ["email"],
    }).refine(async (data) => {
        const role = data.role;
        const response = await axios.get<IUserRolesResponse>('/api/users/roles');

        const roles = response.data.data.userRoles;

        const roleIds = roles.map(role => role.id);


        return roleIds.includes(role);
    }, {
        message: "Role does not exist",
        path: ["role"],
    });

export type NewUserInput = z.infer<typeof NewUserSchema>;
