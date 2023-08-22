import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {ZodError} from "zod";
import {NextResponse} from "next/server";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getErrorResponse(
    status: number = 500,
    message: string = "Internal Server Error",
    errors: ZodError | null = null
) {
    return new NextResponse(
        JSON.stringify({
            status: status < 500 ? "fail" : "error",
            message,
            errors: errors ? errors.flatten() : null,
        }),
        {
            status,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

export function getResponse(
    status: number = 200,
    message: string = "OK",
    data: any = null
) {
    return new NextResponse(
        JSON.stringify({
            status: "success",
            message,
            data,
        }),
        {
            status,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

type EnvVariableKey = "JWT_SECRET_KEY" | "JWT_EXPIRES_IN";

export function dateTimeFormatted(date: string | Date): string {
    if (moment(date).isSame(moment(), "day")) {
        return moment(date).format(process.env.NEXT_PUBLIC_PROJECT_WHITE_TIME_FORMAT);
    }
    return moment(date).format(process.env.NEXT_PUBLIC_PROJECT_WHITE_DATETIME_FORMAT);
}

export function dateFormatted(date: string | Date): string {
    return moment(date).format(process.env.NEXT_PUBLIC_PROJECT_WHITE_DATE_FORMAT);
}

export function timeFormatted(date: string | Date): string {
    return moment(date).format(process.env.NEXT_PUBLIC_PROJECT_WHITE_TIME_FORMAT);
}
